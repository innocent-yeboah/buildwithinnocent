/**
 * Lead form domain types and validation, shared between the client form
 * and the API route so both sides enforce identical rules.
 */
export const industries = [
  "Spa & Wellness",
  "Food & Beverage",
  "Creative & Arts",
  "Retail & E-commerce",
  "Service Provider",
  "Other",
] as const;

export type Industry = (typeof industries)[number];

export type LeadInput = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  industry: string;
  projectDetails: string;
};

export type LeadFieldErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

/**
 * Validates a lead submission. Returns a map of human-first error
 * messages keyed by field; an empty map means the lead is valid.
 */
export function validateLead(input: LeadInput): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = "Please share your name so we know who to greet.";
  }
  if (input.businessName.trim().length < 2) {
    errors.businessName = "Please tell us your business name.";
  }
  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "That email does not look right — mind checking it?";
  }
  if (!PHONE_PATTERN.test(input.phone.trim())) {
    errors.phone = "Please add a phone number we can reach you on.";
  }
  if (!input.industry.trim()) {
    errors.industry = "Please choose the industry closest to your business.";
  }
  if (input.projectDetails.trim().length < 20) {
    errors.projectDetails =
      "Tell us a little more — even two sentences helps us prepare a better proposal.";
  }

  return errors;
}

/** Normalizes a raw submission into trimmed, length-capped values. */
export function normalizeLead(input: LeadInput): LeadInput {
  return {
    fullName: input.fullName.trim().slice(0, 120),
    businessName: input.businessName.trim().slice(0, 160),
    email: input.email.trim().toLowerCase().slice(0, 200),
    phone: input.phone.trim().slice(0, 30),
    industry: input.industry.trim().slice(0, 60),
    projectDetails: input.projectDetails.trim().slice(0, 4000),
  };
}
