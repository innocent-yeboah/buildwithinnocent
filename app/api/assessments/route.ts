import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { sendAssessmentWhatsAppNotification } from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * Persists a completed assessment. The visitor already has their score
 * client-side, so failures here are logged but reported gently — the
 * funnel never breaks because storage hiccupped.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Unreadable submission." }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
  const businessName = typeof body.businessName === "string" ? body.businessName.trim().slice(0, 160) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const score = typeof body.score === "number" ? Math.round(body.score) : NaN;
  const band = typeof body.band === "string" ? body.band.slice(0, 40) : "";

  if (
    fullName.length < 2 ||
    businessName.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    Number.isNaN(score) ||
    score < 0 ||
    score > 100
  ) {
    return NextResponse.json(
      { message: "A few details need another look." },
      { status: 422 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("Supabase not configured — assessment not persisted.");
    return NextResponse.json({ message: "Saved locally." }, { status: 202 });
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
    return NextResponse.json({ message: "Saved locally." }, { status: 202 });
  }

  // Notify Innocent — best effort, never block the visitor.
  try {
    await sendAssessmentWhatsAppNotification({
      fullName,
      businessName,
      email,
      score,
      band,
    });
  } catch (error) {
    console.error("Assessment WhatsApp notification failed:", error);
  }

  return NextResponse.json({ message: "Assessment saved." }, { status: 201 });
}
