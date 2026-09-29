import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { screenPublicWrite } from "@/lib/abuse";
import { normalizeLead, validateLead, type LeadInput } from "@/lib/leads";
import { intakeLead } from "@/lib/lead-intake";
import { publicFallback, responseTimePhrase, site } from "@/lib/site";
import {
  sendLeadConfirmationEmail,
  sendOwnerLeadAlert,
  sendWhatsAppNotification,
} from "@/lib/notifications";

export const runtime = "nodejs";

async function readJson(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.json();
    if (typeof raw !== "object" || raw === null) return null;
    return raw as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Counts a referral only the first time this contact submits with the code.
 * Repeat enquiries from the same email (or phone, when there is no email)
 * do not inflate converted_leads.
 */
async function creditReferralOnce(
  supabase: SupabaseClient,
  referralCode: string,
  lead: LeadInput,
): Promise<void> {
  let query = supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("referral_code", referralCode);

  query = lead.email ? query.eq("email", lead.email) : query.eq("phone", lead.phone);

  const { count, error } = await query;
  if (error) {
    console.error("Referral dedupe lookup failed:", error.message);
    return;
  }

  // The row just inserted is included. Count 1 means this is the first one.
  if ((count ?? 0) !== 1) return;

  const { error: rpcError } = await supabase.rpc("increment_referral_leads", {
    ref_code: referralCode,
  });
  if (rpcError) {
    console.error("Referral lead increment failed:", rpcError.message);
  }
}

/**
 * Lead capture. Saves to Supabase first when it is configured. If the save
 * cannot happen, the full enquiry is still sent to the owner by email and
 * WhatsApp (whichever is configured) and the visitor is told honestly,
 * with a direct fallback.
 */
export async function POST(request: NextRequest) {
  const body = await readJson(request);
  if (!body) {
    return NextResponse.json(
      { message: "We could not read that submission. Let's try that again together?" },
      { status: 400 },
    );
  }

  const screened = await screenPublicWrite(request, body);
  if (screened) return screened;

  const lead = normalizeLead({
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

  const supabase = getSupabaseAdmin();
  const fallback = publicFallback();

  const result = await intakeLead({
    save: supabase
      ? async () => {
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
        }
      : null,
    afterSave: async () => {
      if (supabase && referralCode) {
        await creditReferralOnce(supabase, referralCode, lead);
      }
      const tasks: Promise<unknown>[] = [sendWhatsAppNotification(lead)];
      if (lead.email) tasks.push(sendLeadConfirmationEmail(lead));
      const settled = await Promise.allSettled(tasks);
      for (const item of settled) {
        if (item.status === "rejected") {
          console.error("Lead notification failed:", item.reason);
        }
      }
    },
    notifyOwner: async () => {
      const reason = supabase
        ? "The database insert failed."
        : "Supabase is not configured.";
      const [emailResult, whatsappResult] = await Promise.allSettled([
        sendOwnerLeadAlert(lead, reason),
        sendWhatsAppNotification(lead),
      ]);
      if (emailResult.status === "rejected") {
        console.error("Owner lead email failed:", emailResult.reason);
      }
      if (whatsappResult.status === "rejected") {
        console.error("Owner lead WhatsApp failed:", whatsappResult.reason);
      }
      const emailed = emailResult.status === "fulfilled" && emailResult.value;
      const whatsapped = whatsappResult.status === "fulfilled" && whatsappResult.value;
      return emailed || whatsapped;
    },
    successMessage: lead.email
      ? `Your project is in. Watch your inbox — we will reply ${responseTimePhrase}.`
      : `Your project is in. We will reply on WhatsApp ${responseTimePhrase}.`,
    contact: {
      whatsapp: site.whatsappUrl ?? undefined,
      email: site.email ?? undefined,
    },
  });

  return NextResponse.json(
    {
      saved: result.saved,
      notified: result.notified,
      message: result.message,
      ...(result.saved ? {} : { fallback: result.fallback ?? fallback }),
    },
    { status: result.httpStatus },
  );
}
