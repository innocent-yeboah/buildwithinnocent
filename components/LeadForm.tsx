"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  industries,
  validateLead,
  type LeadFieldErrors,
  type LeadInput,
} from "@/lib/leads";
import { REFERRAL_STORAGE_KEY } from "@/components/ReferralTracker";
import { trackLeadConversion } from "@/lib/pixels";
import { CheckIcon } from "@/components/Icons";

const emptyLead: LeadInput = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  industry: "",
  projectDetails: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-500";

/**
 * The lead capture form — the single most important component on the site.
 * Validates client-side, submits to /api/leads, and confirms warmly.
 */
export default function LeadForm() {
  const [lead, setLead] = useState<LeadInput>(emptyLead);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");

  // Visitors arriving from the pricing calculator get their selection
  // pre-written into the project description.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modules = params.get("modules");
    const estimate = params.get("estimate");
    if (!modules && !estimate) return;

    const parts: string[] = [];
    if (modules) parts.push(`From the pricing calculator, I am interested in: ${modules}.`);
    if (estimate) {
      const plan =
        params.get("plan") === "monthly"
          ? "GHS 1,000/month for 6 months"
          : "50% upfront to start and 50% on delivery";
      parts.push(`My estimate came to GHS ${estimate} with ${plan}.`);
    }
    parts.push("About my business: ");

    setLead((current) =>
      current.projectDetails
        ? current
        : { ...current, projectDetails: parts.join("\n") },
    );
  }, []);

  function update<K extends keyof LeadInput>(field: K, value: string) {
    setLead((current) => ({ ...current, [field]: value }));
    // Clear the field's error as soon as the visitor starts fixing it.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldErrors = validateLead(lead);
    if (Object.values(fieldErrors).some(Boolean)) {
      setErrors(fieldErrors);
      return;
    }

    setState("submitting");
    setServerMessage("");

    // Attach referral attribution when the visitor arrived via a referral link.
    let referralCode: string | null = null;
    try {
      referralCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
    } catch {
      // Storage unavailable — submit without attribution.
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, referralCode }),
      });

      const payload = (await response.json()) as {
        message?: string;
        errors?: LeadFieldErrors;
      };

      if (!response.ok) {
        if (payload.errors) setErrors(payload.errors);
        setServerMessage(
          payload.message ?? "Something interrupted us. Let's try that again together?",
        );
        setState("error");
        return;
      }

      trackLeadConversion();
      setState("success");
    } catch {
      setServerMessage(
        "We could not reach our server. Please check your connection and try again — your details are still in the form.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border-2 border-growth bg-growth-50 p-10 text-center"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-growth text-white">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-primary">
          Your project is in good hands, {lead.fullName.split(" ")[0]}.
        </h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/80">
          We have received your details and sent a confirmation to{" "}
          <span className="font-semibold text-primary">{lead.email}</span>.
          Expect your tailored proposal within 24-48 hours.
        </p>
        <p className="mt-4 text-sm font-semibold text-growth-700">
          10+ leads in 30 days or we work for free. That clock starts soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-primary">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={lead.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            placeholder="Ama Serwaa"
            className={inputClasses}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="businessName" className="mb-1.5 block text-sm font-semibold text-primary">
            Business Name
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            required
            value={lead.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={errors.businessName ? "businessName-error" : undefined}
            placeholder="Serwaa's Kitchen"
            className={inputClasses}
          />
          {errors.businessName && (
            <p id="businessName-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.businessName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-primary">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={lead.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@yourbusiness.com"
            className={inputClasses}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-primary">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={lead.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            placeholder="+233 20 000 0000"
            className={inputClasses}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="industry" className="mb-1.5 block text-sm font-semibold text-primary">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          required
          value={lead.industry}
          onChange={(e) => update("industry", e.target.value)}
          aria-invalid={Boolean(errors.industry)}
          aria-describedby={errors.industry ? "industry-error" : undefined}
          className={`${inputClasses} ${lead.industry ? "" : "text-ink/40"}`}
        >
          <option value="" disabled>
            Choose the closest match
          </option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p id="industry-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.industry}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="projectDetails" className="mb-1.5 block text-sm font-semibold text-primary">
          Tell us about your project
        </label>
        <textarea
          id="projectDetails"
          name="projectDetails"
          required
          rows={5}
          value={lead.projectDetails}
          onChange={(e) => update("projectDetails", e.target.value)}
          aria-invalid={Boolean(errors.projectDetails)}
          aria-describedby={errors.projectDetails ? "projectDetails-error" : undefined}
          placeholder="What does your business do? Where do your customers come from today? What would you love your system to handle for you?"
          className={`${inputClasses} resize-y`}
        />
        {errors.projectDetails && (
          <p id="projectDetails-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.projectDetails}
          </p>
        )}
      </div>

      {state === "error" && serverMessage && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "submitting" ? "Sending your project…" : "Send My Project Details"}
        {state !== "submitting" && <span aria-hidden="true">&rarr;</span>}
      </button>

      <p className="text-center text-xs text-ink/60">
        We reply personally within 24-48 hours. Your details are never shared
        or sold.
      </p>
    </form>
  );
}
