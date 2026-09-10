import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * One-click unsubscribe. Accepts token via query string (email link)
 * or JSON body. Soft-unsubscribes (subscribed = false) so history is kept.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const result = await unsubscribe(token);

  if (!result.ok) {
    return NextResponse.redirect(
      new URL(`/newsletter/unsubscribe?status=error`, request.url),
    );
  }

  return NextResponse.redirect(
    new URL(`/newsletter/unsubscribe?status=ok`, request.url),
  );
}

export async function POST(request: NextRequest) {
  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ message: "Unreadable request." }, { status: 400 });
  }

  const result = await unsubscribe(token);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ message: "You have been unsubscribed." }, { status: 200 });
}

async function unsubscribe(
  token: string,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  if (!UUID_PATTERN.test(token)) {
    return { ok: false, status: 400, message: "That unsubscribe link looks incomplete." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      status: 503,
      message: "Our system is taking a short breath. Please try again in a moment.",
    };
  }

  try {
    await withBackoff(async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .update({ subscribed: false })
        .eq("unsubscribe_token", token)
        .select("id")
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new Error("NOT_FOUND");
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return {
        ok: false,
        status: 404,
        message: "We could not find that subscription. You may already be unsubscribed.",
      };
    }
    console.error("Unsubscribe failed:", error);
    return {
      ok: false,
      status: 500,
      message: "We could not update your subscription just now.",
    };
  }
}
