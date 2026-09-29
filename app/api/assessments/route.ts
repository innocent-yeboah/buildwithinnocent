import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { screenPublicWrite } from "@/lib/abuse";
import { isValidEmail } from "@/lib/email";
import { publicFallback } from "@/lib/site";
import {
  sendAssessmentWhatsAppNotification,
  sendOwnerEmail,
} from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * Persists a completed assessment. The visitor already has their score
 * client-side. If storage fails, we still notify the owner and return
 * saved: false so the page does not count it as a conversion.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Unreadable submission." }, { status: 400 });
  }

  const screened = await screenPublicWrite(request, body);
  if (screened) return screened;

  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
  const businessName =
    typeof body.businessName === "string" ? body.businessName.trim().slice(0, 160) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const score = typeof body.score === "number" ? Math.round(body.score) : NaN;
  const band = typeof body.band === "string" ? body.band.slice(0, 40) : "";

  if (
    fullName.length < 2 ||
    businessName.length < 2 ||
    !isValidEmail(email) ||
    Number.isNaN(score) ||
    score < 0 ||
    score > 100
  ) {
    return NextResponse.json({ message: "A few details need another look." }, { status: 422 });
  }

  const payload = { fullName, businessName, email, score, band };

  async function notifyOwner(reason: string): Promise<boolean> {
    const text = [
      "An assessment was completed but was NOT saved to the database.",
      `Reason: ${reason}`,
      "",
      `Name: ${fullName}`,
      `Business: ${businessName}`,
      `Email: ${email}`,
      `Score: ${score}/100 (${band})`,
    ].join("\n");

    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendOwnerEmail("Unsaved assessment", text),
      sendAssessmentWhatsAppNotification(payload),
    ]);
    if (emailResult.status === "rejected") {
      console.error("Assessment owner email failed:", emailResult.reason);
    }
    if (whatsappResult.status === "rejected") {
      console.error("Assessment WhatsApp failed:", whatsappResult.reason);
    }
    const emailed = emailResult.status === "fulfilled" && emailResult.value;
    const whatsapped = whatsappResult.status === "fulfilled" && whatsappResult.value;
    return emailed || whatsapped;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase is not configured — assessment was not saved.");
    const notified = await notifyOwner("Supabase is not configured.");
    return NextResponse.json(
      {
        saved: false,
        notified,
        message: notified
          ? "Your score is ready on this page. We could not store it, but we sent the result to Innocent."
          : "Your score is ready on this page. We could not store it. Message us if you would like us to keep a copy.",
        fallback: publicFallback(),
      },
      { status: 503 },
    );
  }

  try {
    await withBackoff(async () => {
      const { error } = await supabase.from("assessments").insert({
        full_name: fullName,
        business_name: businessName,
        email,
        score,
        band,
        layer_scores: body.layerScores ?? {},
        answers: body.answers ?? {},
      });
      if (error) throw new Error(`Assessment insert failed: ${error.message}`);
    });
  } catch (error) {
    console.error("Failed to save assessment:", error);
    const notified = await notifyOwner("The database insert failed.");
    return NextResponse.json(
      {
        saved: false,
        notified,
        message: notified
          ? "Your score is ready on this page. We could not store it, but we sent the result to Innocent."
          : "Your score is ready on this page. We could not store it. Message us if you would like us to keep a copy.",
        fallback: publicFallback(),
      },
      { status: 503 },
    );
  }

  try {
    await sendAssessmentWhatsAppNotification(payload);
  } catch (error) {
    console.error("Assessment WhatsApp notification failed:", error);
  }

  return NextResponse.json({ saved: true, message: "Assessment saved." }, { status: 201 });
}
