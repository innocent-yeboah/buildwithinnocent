import { Resend } from "resend";
import { withBackoff } from "@/lib/retry";
import { site } from "@/lib/site";
import type { LeadInput } from "@/lib/leads";

/**
 * Sends the warm confirmation email to a new lead via Resend.
 * No-ops (with a log) when RESEND_API_KEY is not configured so a missing
 * key never blocks lead capture.
 */
export async function sendLeadConfirmationEmail(lead: LeadInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email.");
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? `Build With Innocent <onboarding@resend.dev>`;
  const firstName = lead.fullName.split(" ")[0];

  await withBackoff(async () => {
    const { error } = await resend.emails.send({
      from,
      to: lead.email,
      replyTo: site.email,
      subject: `We received your project, ${firstName} — proposal coming within 48 hours`,
      html: buildConfirmationHtml(lead, firstName),
      text: buildConfirmationText(lead, firstName),
    });
    if (error) throw new Error(`Resend error: ${error.message}`);
  });
}

/**
 * Sends a free-form WhatsApp text via the Cloud API.
 * No-ops when the WhatsApp environment is not configured.
 */
async function sendWhatsAppText(body: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_NOTIFY_NUMBER;

  if (!token || !phoneNumberId || !recipient) {
    console.warn("WhatsApp env not fully set — skipping WhatsApp notification.");
    return;
  }

  await withBackoff(async () => {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: { body },
        }),
      },
    );
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`WhatsApp API ${response.status}: ${detail}`);
    }
  });
}

/**
 * Notifies Innocent on WhatsApp about a new lead.
 */
export async function sendWhatsAppNotification(lead: LeadInput): Promise<void> {
  const body = [
    "🔔 New lead on Build With Innocent",
    "",
    `Name: ${lead.fullName}`,
    `Business: ${lead.businessName}`,
    `Industry: ${lead.industry}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    "",
    `Project: ${lead.projectDetails.slice(0, 600)}`,
  ].join("\n");

  await sendWhatsAppText(body);
}

type AssessmentAlert = {
  fullName: string;
  businessName: string;
  email: string;
  score: number;
  band: string;
};

/**
 * Notifies Innocent when someone completes the readiness assessment.
 */
export async function sendAssessmentWhatsAppNotification(
  assessment: AssessmentAlert,
): Promise<void> {
  const body = [
    "📊 New assessment completed",
    "",
    `Name: ${assessment.fullName}`,
    `Business: ${assessment.businessName}`,
    `Email: ${assessment.email}`,
    `Score: ${assessment.score}/100 (${assessment.band})`,
    "",
    `View funnel: ${site.url}/admin/analytics`,
  ].join("\n");

  await sendWhatsAppText(body);
}

function buildConfirmationHtml(lead: LeadInput, firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#EEF3F9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#1E3A5F;padding:32px;text-align:center;">
            <p style="margin:0;color:#FFC107;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">Build With Innocent</p>
            <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;">We received your project, ${escapeHtml(firstName)}.</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:#333333;font-size:15px;line-height:1.7;">
            <p style="margin:0 0 16px;">Thank you for telling us about <strong>${escapeHtml(lead.businessName)}</strong>. Your project is now in our hands.</p>
            <p style="margin:0 0 16px;"><strong>What happens next:</strong></p>
            <ol style="margin:0 0 16px;padding-left:20px;">
              <li style="margin-bottom:8px;">Innocent personally reviews your submission.</li>
              <li style="margin-bottom:8px;">We prepare a tailored proposal — scope, timeline, and price.</li>
              <li>You receive it within <strong>24-48 hours</strong>.</li>
            </ol>
            <p style="margin:0 0 24px;">In the meantime, feel free to reply to this email with anything you forgot to mention — screenshots, links, ideas. It all helps.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="background:#EDF7EE;border-radius:12px;padding:16px 20px;color:#1F5622;font-size:14px;font-weight:bold;text-align:center;">
                  Our promise: 10+ leads in 30 days or we work for free.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#0E1F35;padding:24px 32px;text-align:center;color:#AFC6E0;font-size:12px;line-height:1.6;">
            <p style="margin:0;">Build With Innocent — Digital Business Systems for African Enterprises</p>
            <p style="margin:8px 0 0;"><a href="${site.url}" style="color:#FFC107;text-decoration:none;">${site.url.replace("https://", "")}</a> &nbsp;•&nbsp; ${site.phoneDisplay}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationText(lead: LeadInput, firstName: string): string {
  return [
    `We received your project, ${firstName}.`,
    "",
    `Thank you for telling us about ${lead.businessName}. Your project is now in our hands.`,
    "",
    "What happens next:",
    "1. Innocent personally reviews your submission.",
    "2. We prepare a tailored proposal — scope, timeline, and price.",
    "3. You receive it within 24-48 hours.",
    "",
    "Our promise: 10+ leads in 30 days or we work for free.",
    "",
    `Build With Innocent — ${site.tagline}`,
    site.url,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
