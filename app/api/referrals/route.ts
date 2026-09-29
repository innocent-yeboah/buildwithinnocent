import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { screenPublicWrite } from "@/lib/abuse";
import { isValidEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { sendDirectEmail } from "@/lib/notifications";

export const runtime = "nodejs";

/** Generates a short, friendly, unambiguous referral code. */
function generateCode(name: string): string {
  const prefix = name
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 6);
  // Unambiguous alphabet: no 0/O or 1/I lookalikes.
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(4);
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `${prefix || "FRIEND"}-${suffix}`;
}

/**
 * Creates a referral partner and their shareable code.
 * An existing email does not get its code back in the response — that
 * would let anyone who knows the address read the link. The code is
 * emailed to that inbox instead.
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

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";

  if (name.length < 2 || !isValidEmail(email)) {
    return NextResponse.json(
      { message: "Please share your name and a valid email so we can track your rewards." },
      { status: 422 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { message: "Our system is taking a short breath. Please try again in a moment." },
      { status: 503 },
    );
  }

  try {
    const { data: existing } = await supabase
      .from("referrals")
      .select("code")
      .eq("referrer_email", email)
      .maybeSingle();

    if (existing?.code) {
      const link = `${site.url}/referral/${existing.code}`;
      let sent = false;
      try {
        sent = await sendDirectEmail(
          email,
          "Your Build With Innocent referral link",
          [
            `Hi ${name.split(" ")[0]},`,
            "",
            "You already have a referral link. Here it is again:",
            link,
            "",
            "We do not show existing links on the website, so only this inbox receives the code.",
            "",
            site.name,
          ].join("\n"),
        );
      } catch (error) {
        console.error("Could not email an existing referral code:", error);
      }

      return NextResponse.json(
        {
          existing: true,
          message: sent
            ? "This email already has a referral link. We sent it to that inbox instead of showing it here."
            : "This email already has a referral link. We could not email it just now — message us and we will resend it.",
        },
        { status: 200 },
      );
    }

    const code = generateCode(name);
    await withBackoff(async () => {
      const { error } = await supabase.from("referrals").insert({
        code,
        referrer_name: name,
        referrer_email: email,
        referrer_phone: phone || null,
      });
      if (error) throw new Error(`Referral insert failed: ${error.message}`);
    });

    return NextResponse.json({ code }, { status: 201 });
  } catch (error) {
    console.error("Failed to create referral:", error);
    return NextResponse.json(
      { message: "We could not create your link just now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
