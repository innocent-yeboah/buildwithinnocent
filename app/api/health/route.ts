import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/lib/site";
import { turnstileConfigured } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public uptime check. Returns ok or degraded only.
 * Integration booleans are included when the request sends
 * `x-health-token` matching HEALTH_DETAIL_TOKEN.
 * HTTP 503 when Supabase is not configured, because leads cannot be stored.
 */
export function GET(request: NextRequest) {
  const supabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const status = supabase ? "ok" : "degraded";
  const secret = process.env.HEALTH_DETAIL_TOKEN;
  const provided = request.headers.get("x-health-token");
  const showDetails = Boolean(secret && provided && provided === secret);

  if (!showDetails) {
    return NextResponse.json({ status }, { status: supabase ? 200 : 503 });
  }

  return NextResponse.json(
    {
      status,
      integrations: {
        supabase,
        resend: Boolean(process.env.RESEND_API_KEY),
        whatsappCloud: Boolean(
          process.env.WHATSAPP_ACCESS_TOKEN &&
            process.env.WHATSAPP_PHONE_NUMBER_ID &&
            process.env.WHATSAPP_NOTIFY_NUMBER,
        ),
        publicWhatsapp: Boolean(site.whatsappUrl),
        turnstile: turnstileConfigured(),
        contactEmail: Boolean(site.email),
      },
    },
    { status: supabase ? 200 : 503 },
  );
}
