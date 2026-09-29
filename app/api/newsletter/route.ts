import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { screenPublicWrite } from "@/lib/abuse";
import { isValidEmail } from "@/lib/email";
import { publicFallback, site } from "@/lib/site";
import { sendOwnerEmail } from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * Newsletter subscription: stores the subscriber (idempotently) and sends
 * a welcome email. If storage fails, the address is emailed to the owner
 * instead of pretending the person is subscribed.
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

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
  const source = typeof body.source === "string" ? body.source.slice(0, 60) : "newsletter_page";

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "That email does not look right — mind checking it?" },
      { status: 422 },
    );
  }

  const supabase = getSupabaseAdmin();

  async function holdForOwner(reason: string): Promise<boolean> {
    console.error(`Newsletter subscriber was not saved. ${reason}`);
    try {
      return await sendOwnerEmail(
        "Unsaved newsletter signup",
        [
          "Someone tried to subscribe, but the address was NOT saved.",
          `Reason: ${reason}`,
          "",
          `Email: ${email}`,
          `Name: ${fullName || "(not given)"}`,
          `Source: ${source}`,
        ].join("\n"),
      );
    } catch (error) {
      console.error("Owner email for unsaved subscriber failed:", error);
      return false;
    }
  }

  if (!supabase) {
    const notified = await holdForOwner("Supabase is not configured.");
    return NextResponse.json(
      {
        saved: false,
        notified,
        message: notified
          ? "We could not add you to the list just now, but we sent your email to Innocent so it is not lost."
          : "We could not add you to the list just now. Please email us directly so we can add you.",
        fallback: publicFallback(),
      },
      { status: 503 },
    );
  }

  let unsubscribeToken: string | null = null;

  try {
    await withBackoff(async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .upsert(
          { email, full_name: fullName || null, source, subscribed: true },
          { onConflict: "email" },
        )
        .select("unsubscribe_token")
        .single();
      if (error) throw new Error(`Subscriber upsert failed: ${error.message}`);
      unsubscribeToken = (data?.unsubscribe_token as string | undefined) ?? null;
    });
  } catch (error) {
    console.error("Failed to save subscriber:", error);
    const notified = await holdForOwner("The database insert failed.");
    return NextResponse.json(
      {
        saved: false,
        notified,
        message: notified
          ? "We could not add you to the list just now, but we sent your email to Innocent so it is not lost."
          : "We could not add you to the list just now. Please email us directly so we can add you.",
        fallback: publicFallback(),
      },
      { status: 503 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const from = process.env.RESEND_FROM_EMAIL ?? "Build With Innocent <onboarding@resend.dev>";
      const firstName = fullName ? fullName.split(" ")[0] : "there";
      const unsubscribeUrl = unsubscribeToken
        ? `${site.url}/api/newsletter/unsubscribe?token=${unsubscribeToken}`
        : `${site.url}/newsletter`;
      await withBackoff(async () => {
        const { error } = await resend.emails.send({
          from,
          to: email,
          replyTo: site.email ?? undefined,
          subject: "Welcome — one useful idea, every two weeks",
          text: [
            `Hi ${firstName},`,
            "",
            "Welcome to the Build With Innocent newsletter.",
            "",
            "Every two weeks you will get one practical idea for growing your business online — lead capture, mobile money, automation, and lessons from real client systems. No fluff, no spam.",
            "",
            "While you are here, two free things worth your time:",
            `- Your Digital Business Readiness Score (2 minutes): ${site.url}/assessment`,
            `- The live demo of the system we build: ${site.url}/demo`,
            "",
            "Talk soon,",
            site.founder,
            site.name,
            "",
            `Unsubscribe anytime (one click): ${unsubscribeUrl}`,
          ].join("\n"),
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
          },
        });
        if (error) throw new Error(`Resend error: ${error.message}`);
      });
    } catch (error) {
      console.error("Welcome email failed:", error);
    }
  }

  return NextResponse.json({ saved: true, message: "Subscribed." }, { status: 201 });
}
