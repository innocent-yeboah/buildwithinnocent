import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { normalizeLead, validateLead, type LeadInput } from "@/lib/leads";
import {
  sendLeadConfirmationEmail,
  sendWhatsAppNotification,
} from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * Lead capture endpoint — the revenue-critical path of the site.
 * Saves the lead to Supabase first (never lose a lead), then sends the
 * confirmation email and WhatsApp notification. Notification failures
 * are logged but never surface as an error to the visitor.
 */
export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read that submission. Let's try that again together?" },
      { status: 400 },
    );
  }

  if (typeof raw !== "object" || raw === null) {
    return NextResponse.json(
      { message: "We could not read that submission. Let's try that again together?" },
      { status: 400 },
    );
  }

  const body = raw as Record<string, unknown>;
  const lead: LeadInput = normalizeLead({
    fullName: typeof body.fullName === "string" ? body.fullName : "",
    businessName: typeof body.businessName === "string" ? body.businessName : "",
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    industry: typeof body.industry === "string" ? body.industry : "",
    projectDetails: typeof body.projectDetails === "string" ? body.projectDetails : "",
  });

  const referralCode =
    typeof body.referralCode === "string" && body.referralCode.trim()
      ? body.referralCode.trim().slice(0, 40)
      : null;

  const errors = validateLead(lead);
  if (Object.values(errors).some(Boolean)) {
    return NextResponse.json(
      { message: "A few details need another look before we can send this.", errors },
      { status: 422 },
    );
  }

  // 1. Persist the lead — this must succeed before anything else.
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase is not configured — lead could not be saved.");
    return NextResponse.json(
      { message: "Our system is taking a short breath. Please try again in a moment." },
      { status: 503 },
    );
  }

  try {
    await withBackoff(async () => {
      const { error } = await supabase.from("leads").insert({
        full_name: lead.fullName,
        business_name: lead.businessName,
        email: lead.email,
        phone: lead.phone,
        industry: lead.industry,
        project_details: lead.projectDetails,
        source: "website",
        status: "new",
        referral_code: referralCode,
      });
      if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    });

    // Credit the referrer's lead counter atomically (best effort).
    // "converted_leads" here means attributed inquiries — payouts still
    // happen when a project kicks off (status → won in the CRM).
    if (referralCode) {
      const { error: rpcError } = await supabase.rpc("increment_referral_leads", {
        ref_code: referralCode,
      });
      if (rpcError) {
        console.error("Referral lead increment failed:", rpcError.message);
      }
    }
  } catch (error) {
    console.error("Failed to save lead:", error);
    return NextResponse.json(
      { message: "We could not save your details just now. Please try again in a moment." },
      { status: 500 },
    );
  }

  // 2. Notifications — best effort, never block the visitor's success.
  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendLeadConfirmationEmail(lead),
    sendWhatsAppNotification(lead),
  ]);
  if (emailResult.status === "rejected") {
    console.error("Confirmation email failed:", emailResult.reason);
  }
  if (whatsappResult.status === "rejected") {
    console.error("WhatsApp notification failed:", whatsappResult.reason);
  }

  return NextResponse.json(
    { message: "Your project is in. Watch your inbox — your proposal arrives within 24-48 hours." },
    { status: 201 },
  );
}
