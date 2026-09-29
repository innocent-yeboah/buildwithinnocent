import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { turnstileConfigured } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Integration health for an uptime monitor.
 * Booleans only — never env values or secrets.
 * HTTP 503 when Supabase is not configured, because leads cannot be stored.
 */
export function GET() {
  const supabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const resend = Boolean(process.env.RESEND_API_KEY);
  const whatsappCloud = Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_NOTIFY_NUMBER,
  );
  const publicWhatsapp = Boolean(site.whatsappUrl);
  const turnstile = turnstileConfigured();
  const contactEmail = Boolean(site.email);

  return NextResponse.json(
    {
      ok: supabase,
      integrations: {
        supabase,
        resend,
        whatsappCloud,
        publicWhatsapp,
        turnstile,
        contactEmail,
      },
    },
    { status: supabase ? 200 : 503 },
  );
}
