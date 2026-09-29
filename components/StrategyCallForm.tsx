"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  industries,
  validateLead,
  type LeadFieldErrors,
  type LeadInput,
} from "@/lib/leads";
import { budgetRanges, composeQualification, timelines } from "@/lib/engagement";
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

/**
 * Short qualification for a strategy call. Name, WhatsApp, and type of
 * business are required. Budget and timeline are optional.
 */
export default function StrategyCallForm() {
  const [lead, setLead] = useState<LeadInput>(emptyLead);
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [errors, setErrors] = useState<LeadFieldErrors & { budgetRange?: string; timeline?: string }>(
    {},
  );
  const [state, setState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [fallback, setFallback] = useState<Fallback | undefined>();
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  function update<K extends keyof LeadInput>(field: K, value: string) {
    setLead((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = validateLead(lead);
    const qualification = composeQualification({
      budgetRange,
      timeline,
      note: lead.projectDetails,
      strategyCall: true,
    });
    const nextErrors = { ...fieldErrors, ...qualification?.errors };
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setState("submitting");
    setServerMessage("");
    setFallback(undefined);

    let referralCode: string | null = null;
    try {
      referralCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
    } catch {
      referralCode = null;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          budgetRange,
          timeline,
          source: "strategy-call",
          referralCode,
          [HONEYPOT_FIELD]: honeypot,
          turnstileToken,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        errors?: typeof errors;
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
        "We could not reach our server. Your details are still in the form.",
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
      <div role="status" className="rounded-3xl border border-growth bg-growth-50 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-growth text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl text-primary">
          The request is with Innocent, {lead.fullName.split(" ")[0]}.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/80">
          {lead.email
            ? `Expect a reply ${responseTimePhrase}, including a note to ${lead.email}.`
            : `Expect a reply on WhatsApp ${responseTimePhrase}.`}
        </p>
        {site.whatsappUrl && (
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
            Message Innocent on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-primary-100 bg-white p-6 shadow-card sm:p-8">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <p className="font-display text-xl text-primary">Request the call</p>
      <p className="mt-1 text-sm text-ink/70">
        Name, WhatsApp, and the kind of business. Budget and timing can wait.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Your name" id="call-name" error={errors.fullName}>
          <input
            id="call-name"
            name="fullName"
            autoComplete="name"
            value={lead.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.fullName)}
            required
          />
        </Field>
        <Field label="WhatsApp number" id="call-phone" error={errors.phone}>
          <input
            id="call-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={lead.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.phone)}
            required
          />
        </Field>
        <Field label="Type of business" id="call-industry" error={errors.industry}>
          <select
            id="call-industry"
            name="industry"
            value={lead.industry}
            onChange={(event) => update("industry", event.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.industry)}
            required
          >
            <option value="">Choose one</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget range" id="call-budget" optional error={errors.budgetRange}>
            <select
              id="call-budget"
              name="budgetRange"
              value={budgetRange}
              onChange={(event) => {
                setBudgetRange(event.target.value);
                if (errors.budgetRange) setErrors((current) => ({ ...current, budgetRange: undefined }));
              }}
              className={inputClasses}
            >
              <option value="">Optional</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Timeline" id="call-timeline" optional error={errors.timeline}>
            <select
              id="call-timeline"
              name="timeline"
              value={timeline}
              onChange={(event) => {
                setTimeline(event.target.value);
                if (errors.timeline) setErrors((current) => ({ ...current, timeline: undefined }));
              }}
              className={inputClasses}
            >
              <option value="">Optional</option>
              {timelines.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Business name" id="call-business" optional error={errors.businessName}>
          <input
            id="call-business"
            name="businessName"
            value={lead.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Email" id="call-email" optional error={errors.email}>
          <input
            id="call-email"
            name="email"
            type="email"
            autoComplete="email"
            value={lead.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Anything Innocent should know" id="call-note" optional error={errors.projectDetails}>
          <textarea
            id="call-note"
            name="projectDetails"
            rows={3}
            value={lead.projectDetails}
            onChange={(event) => update("projectDetails", event.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />
      <button type="submit" className="btn-primary mt-6 w-full" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : "Book a strategy call"}
      </button>
      <p className="mt-3 text-center text-xs text-ink/60">
        A reply {responseTimePhrase}. No obligation.
      </p>
      <FormLegalNote />
      {state === "error" && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          <p>{serverMessage}</p>
          {fallback?.whatsapp && (
            <a href={fallback.whatsapp} className="mt-2 inline-block font-semibold underline" target="_blank" rel="noopener noreferrer">
              WhatsApp instead
            </a>
          )}
          {fallback?.email && (
            <a href={`mailto:${fallback.email}`} className="mt-2 block font-semibold underline">
              {fallback.email}
            </a>
          )}
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  error,
  optional,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-primary">
        {label}
        {optional && <span className="text-xs font-normal text-ink/50">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
