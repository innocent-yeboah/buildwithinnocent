/**
 * Lead form domain types and validation, shared between the client form
 * and the API route so both sides enforce identical rules.
 *
 * Required to follow up: name, WhatsApp/phone, and type of business.
 * Email, business name, and project details are optional.
 */
import { isValidEmail } from "@/lib/email";

export const industries = [
  "Creative & Arts",
  "Food & Beverage",
  "Retail & E-commerce",
  "Service Provider",
  "Spa & Wellness",
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

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

function isIndustry(value: string): value is Industry {
  return (industries as readonly string[]).includes(value);
}

/**
 * Validates a lead submission. Returns a map of human-first error
 * messages keyed by field; an empty map means the lead is valid.
 */
export function validateLead(input: LeadInput): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = "Please share your name so we know who to greet.";
  }

  const business = input.businessName.trim();
  if (business.length > 0 && business.length < 2) {
    errors.businessName = "That business name looks too short — or leave it blank.";
  }

  const email = input.email.trim();
  if (email.length > 0 && !isValidEmail(email)) {
    errors.email = "That email does not look right — mind checking it?";
  }

  if (!PHONE_PATTERN.test(input.phone.trim())) {
    errors.phone = "Please add a WhatsApp number we can reach you on.";
  }

  if (!isIndustry(input.industry.trim())) {
    errors.industry = "Please choose the type of business closest to yours.";
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
