/**
 * Client-side conversion event helpers for Meta, Google, and LinkedIn.
 * Safe no-ops when pixels are not loaded (dev / missing env).
 */

type WindowWithPixels = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  lintrk?: (action: string, payload: Record<string, unknown>) => void;
};

function w(): WindowWithPixels | undefined {
  return typeof window !== "undefined" ? (window as WindowWithPixels) : undefined;
}

/** Fire when a project inquiry is successfully submitted. */
export function trackLeadConversion() {
  const win = w();
  win?.fbq?.("track", "Lead");
  win?.gtag?.("event", "generate_lead", { event_category: "engagement" });
  win?.lintrk?.("track", { conversion_id: "lead" });
}

/** Fire when an assessment is completed and contact captured. */
export function trackAssessmentComplete(score: number) {
  const win = w();
  win?.fbq?.("track", "CompleteRegistration", { value: score, currency: "GHS" });
  win?.gtag?.("event", "assessment_complete", {
    event_category: "engagement",
    value: score,
  });
  win?.lintrk?.("track", { conversion_id: "assessment" });
}

/** Fire when someone joins the newsletter. */
export function trackNewsletterSignup() {
  const win = w();
  win?.fbq?.("track", "Subscribe");
  win?.gtag?.("event", "sign_up", { method: "newsletter" });
  win?.lintrk?.("track", { conversion_id: "newsletter" });
}
