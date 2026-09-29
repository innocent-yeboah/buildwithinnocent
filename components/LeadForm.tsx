"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  industries,
  validateLead,
  type Industry,
  type LeadFieldErrors,
  type LeadInput,
} from "@/lib/leads";
import { REFERRAL_STORAGE_KEY } from "@/components/ReferralTracker";
import { trackLeadConversion } from "@/lib/pixels";
import { responseTimePhrase, site } from "@/lib/site";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { CheckIcon } from "@/components/Icons";
import { FormLegalNote, HoneypotField, TurnstileWidget } from "@/components/FormGuards";

const emptyLead: LeadInput = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  industry: "",
  projectDetails: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

type Fallback = { whatsapp?: string; email?: string };

const inputClasses =
  "w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-500";

function isIndustry(value: string): value is Industry {
  return (industries as readonly string[]).includes(value);
}

/**
 * The lead capture form. Name, WhatsApp number, and type of business are
 * required. Email and project details are optional. Validates with the same
 * rules as /api/leads.
 */
export default function LeadForm() {
  const [lead, setLead] = useState<LeadInput>(emptyLead);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [fallback, setFallback] = useState<Fallback | undefined>();
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLead((current) => {
      const next = { ...current };
      const name = params.get("name");
      const business = params.get("business");
      const email = params.get("email");
      const phone = params.get("phone");
      const industry = params.get("industry");
      if (name && !next.fullName) next.fullName = name;
      if (business && !next.businessName) next.businessName = business;
      if (email && !next.email) next.email = email;
      if (phone && !next.phone) next.phone = phone;
      if (industry && !next.industry && isIndustry(industry)) next.industry = industry;

      if (!next.projectDetails) {
        const parts: string[] = [];
        const details = params.get("details");
        if (details) parts.push(details);
        const modules = params.get("modules");
        const estimate = params.get("estimate");
        if (modules) {
          parts.push(`From the pricing calculator, I am interested in: ${modules}.`);
        }
        if (estimate) {
          const plan =
            params.get("plan") === "monthly"
              ? "GHS 1,000/month for 6 months"
              : "50% upfront to start and 50% on delivery";
          parts.push(`My estimate came to GHS ${estimate} with ${plan}.`);
        }
        if (parts.length > 0) next.projectDetails = parts.join("\n\n");
      }
      return next;
    });
  }, []);

  function update<K extends keyof LeadInput>(field: K, value: string) {
    setLead((current) => ({ ...current, [field]: value }));
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
    setFallback(undefined);

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
        body: JSON.stringify({
          ...lead,
          referralCode,
          [HONEYPOT_FIELD]: honeypot,
          turnstileToken,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        errors?: LeadFieldErrors;
        saved?: boolean;
        ignored?: boolean;
        fallback?: Fallback;
      };

      if (payload.ignored) {
        setState("success");
        return;
      }

      if (!response.ok || !payload.saved) {
        if (payload.errors) setErrors(payload.errors);
        setServerMessage(
          payload.message ?? "Something interrupted us. Let's try that again together?",
        );
        setFallback(payload.fallback);
        setState("error");
        return;
      }

      trackLeadConversion();
      setState("success");
    } catch {
      setServerMessage(
        "We could not reach our server. Please check your connection and try again — your details are still in the form.",
      );
      setFallback(
        site.whatsappUrl || site.email
          ? {
              ...(site.whatsappUrl ? { whatsapp: site.whatsappUrl } : {}),
              ...(site.email ? { email: site.email } : {}),
            }
          : undefined,
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
          {lead.email
            ? `We have your details. Expect a reply ${responseTimePhrase}, including a note to ${lead.email}.`
            : `We have your WhatsApp number. Expect a reply ${responseTimePhrase}.`}
        </p>
        {site.whatsappUrl && (
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            Or message us on WhatsApp now
          </a>
        )}
        <p className="mt-4 text-sm font-semibold text-growth-700">
          10+ leads in 30 days or we work for free.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-primary">
            Your name
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
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-primary">
            WhatsApp number
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
            placeholder="024 000 0000"
            className={inputClasses}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="businessName" className="mb-1.5 block text-sm font-semibold text-primary">
            Business name <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
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
            Email <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
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
      </div>

      <div>
        <label htmlFor="industry" className="mb-1.5 block text-sm font-semibold text-primary">
          Type of business
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
          Project details <span className="font-normal text-ink/50">(optional)</span>
        </label>
        <textarea
          id="projectDetails"
          name="projectDetails"
          rows={4}
          value={lead.projectDetails}
          onChange={(e) => update("projectDetails", e.target.value)}
          aria-invalid={Boolean(errors.projectDetails)}
          aria-describedby={errors.projectDetails ? "projectDetails-error" : undefined}
          placeholder="What should the system handle for you? A sentence is enough."
          className={`${inputClasses} resize-y`}
        />
        {errors.projectDetails && (
          <p id="projectDetails-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.projectDetails}
          </p>
        )}
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      {state === "error" && serverMessage && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{serverMessage}</p>
          {(fallback?.whatsapp || fallback?.email || site.whatsappUrl || site.email) && (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {(fallback?.whatsapp || site.whatsappUrl) && (
                <a
                  href={fallback?.whatsapp || site.whatsappUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-growth-700 underline"
                >
                  Message us on WhatsApp
                </a>
              )}
              {(fallback?.email || site.email) && (
                <a
                  href={`mailto:${fallback?.email || site.email}`}
                  className="font-semibold underline"
                >
                  Email {fallback?.email || site.email}
                </a>
              )}
            </div>
          )}
        </div>
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
        We reply personally {responseTimePhrase}. Your details are never shared or sold.
      </p>
      <FormLegalNote />
    </form>
  );
}
