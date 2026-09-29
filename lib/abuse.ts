import { NextResponse, type NextRequest } from "next/server";
import { publicFallback } from "@/lib/site";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Shared gate for public write endpoints.
 * Returns a response when the request should stop, or null to continue.
 * Honeypot hits get a quiet 200 so scripts do not learn they were filtered,
 * and no email or WhatsApp message is sent.
 */
export async function screenPublicWrite(
  request: NextRequest,
  body: Record<string, unknown>,
): Promise<NextResponse | null> {
  const honey = body[HONEYPOT_FIELD];
  if (typeof honey === "string" && honey.trim().length > 0) {
    return NextResponse.json(
      { ignored: true, message: "Thanks — we received that." },
      { status: 200 },
    );
  }

  const ip = clientIp(request);
  const path = new URL(request.url).pathname;
  if (!rateLimit(`${path}:${ip}`).ok) {
    return NextResponse.json(
      {
        message:
          "Too many attempts from this connection. Please wait a few minutes, or reach us directly.",
        fallback: publicFallback(),
      },
      { status: 429 },
    );
  }

  const turnstile = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ message: turnstile.message }, { status: 403 });
  }

  return null;
}
