import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";

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
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Unreadable submission." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
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
    // Returning partner? Give them their existing code back.
    const { data: existing } = await supabase
      .from("referrals")
      .select("code")
      .eq("referrer_email", email)
      .maybeSingle();

    if (existing?.code) {
      return NextResponse.json({ code: existing.code }, { status: 200 });
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
