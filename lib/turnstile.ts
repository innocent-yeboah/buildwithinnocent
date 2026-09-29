/**
 * Optional Cloudflare Turnstile. Verification runs only when BOTH
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY are set.
 * If either is missing, forms work exactly as before.
 */

export function turnstileConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY,
  );
}

export async function verifyTurnstile(
  token: unknown,
  remoteIp: string | null,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!turnstileConfigured()) return { ok: true };

  if (typeof token !== "string" || token.trim().length === 0) {
    return { ok: false, message: "Please complete the spam check and try again." };
  }

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY ?? "",
    response: token,
  });
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await response.json()) as { success?: boolean };
    if (!data.success) {
      return { ok: false, message: "The spam check did not pass. Please try again." };
    }
    return { ok: true };
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return { ok: false, message: "The spam check could not be completed. Please try again." };
  }
}
