/**
 * Lead intake: save first when the database is healthy, and never drop the
 * enquiry just because storage failed. Owner notification is the fallback.
 */

export type LeadFallback = {
  whatsapp?: string;
  email?: string;
};

export type LeadIntakeResult = {
  httpStatus: number;
  saved: boolean;
  notified: boolean;
  message: string;
  fallback?: LeadFallback;
};

export type LeadIntakeDeps = {
  /** Null when Supabase is not configured. Throws when the insert fails. */
  save: (() => Promise<void>) | null;
  /** Runs only after a successful save. Must not throw out of this module. */
  afterSave: () => Promise<void>;
  /** Owner email and/or WhatsApp. True when at least one channel accepted it. */
  notifyOwner: () => Promise<boolean>;
  successMessage: string;
  contact: LeadFallback;
};

export async function intakeLead(deps: LeadIntakeDeps): Promise<LeadIntakeResult> {
  if (deps.save) {
    try {
      await deps.save();
      try {
        await deps.afterSave();
      } catch (error) {
        console.error("Post-save lead notification failed:", error);
      }
      return {
        httpStatus: 201,
        saved: true,
        notified: true,
        message: deps.successMessage,
      };
    } catch (error) {
      console.error("Failed to save lead. Attempting owner notification so it is not lost:", error);
    }
  } else {
    console.error(
      "Supabase is not configured — lead was not saved. Attempting owner notification so the enquiry is not lost.",
    );
  }

  let notified = false;
  try {
    notified = await deps.notifyOwner();
  } catch (error) {
    console.error("Owner notification failed after the lead could not be saved:", error);
    notified = false;
  }

  const fallback: LeadFallback = {};
  if (deps.contact.whatsapp) fallback.whatsapp = deps.contact.whatsapp;
  if (deps.contact.email) fallback.email = deps.contact.email;

  const message = notified
    ? "We could not store your details in our database just now, but we sent them straight to Innocent. If you do not hear back, use WhatsApp or email below."
    : "We could not store your details, and we could not send them on automatically. Please message us directly so this enquiry is not lost.";

  return {
    httpStatus: 503,
    saved: false,
    notified,
    message,
    fallback: Object.keys(fallback).length > 0 ? fallback : undefined,
  };
}
