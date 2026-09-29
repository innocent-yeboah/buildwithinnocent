"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import {
  answerChoices,
  normalizeScorecardContact,
  scoreAnswers,
  scorecardSections,
  validateScorecard,
  type AnswerValue,
  type QuestionId,
  type ScorecardContact,
  type ScorecardFieldErrors,
  type ScorecardResult,
} from "@/lib/scorecard";
import { site } from "@/lib/site";
import { FormLegalNote, HoneypotField, TurnstileWidget } from "@/components/FormGuards";

type ViewResult = {
  result: ScorecardResult;
  saved: boolean;
  note: string;
};

const inputClasses =
  "w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-500";

const emptyContact: ScorecardContact = {
  fullName: "",
  email: "",
  businessName: "",
  phone: "",
};

function readUtm(): Record<string, string> | undefined {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  const pairs: [string, string][] = [
    ["source", "utm_source"],
    ["medium", "utm_medium"],
    ["campaign", "utm_campaign"],
    ["term", "utm_term"],
    ["content", "utm_content"],
  ];
  for (const [key, param] of pairs) {
    const value = params.get(param);
    if (value) utm[key] = value;
  }
  return Object.keys(utm).length > 0 ? utm : undefined;
}

export default function ScorecardForm() {
  const formId = useId();
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const [contact, setContact] = useState<ScorecardContact>(emptyContact);
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, AnswerValue>>>({});
  const [errors, setErrors] = useState<ScorecardFieldErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [view, setView] = useState<ViewResult | null>(null);
  const [utm, setUtm] = useState<Record<string, string> | undefined>();
  const [referrer, setReferrer] = useState("");

  useEffect(() => {
    setUtm(readUtm());
    setReferrer(document.referrer || "");
  }, []);

  useEffect(() => {
    if (view) resultHeading.current?.focus();
  }, [view]);

  function updateContact<K extends keyof ScorecardContact>(field: K, value: string) {
    setContact((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updateAnswer(id: QuestionId, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [id]: value }));
    if (errors[id]) setErrors((current) => ({ ...current, [id]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeScorecardContact(contact);
    const fieldErrors = validateScorecard(normalized, answers);
    if (Object.values(fieldErrors).some(Boolean)) {
      setErrors(fieldErrors);
      setFormError("A few details need another look.");
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    const local = scoreAnswers(answers as Record<QuestionId, AnswerValue>);
    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...normalized,
          answers,
          utm,
          referrer,
          turnstileToken,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        saved?: boolean;
        ignored?: boolean;
        message?: string;
        errors?: ScorecardFieldErrors;
        result?: {
          salesScore: number;
          aiScore: number;
          revenueScore: number;
          total: number;
          tier: string;
          startHere: string;
          nextSteps: [string, string, string];
        };
      } | null;

      if (data?.ignored) {
        setSubmitting(false);
        return;
      }

      if (response.status === 422 && data?.errors) {
        setErrors(data.errors);
        setFormError(data.message || "A few details need another look.");
        setSubmitting(false);
        return;
      }

      if (data?.result) {
        setView({
          result: {
            ...local,
            salesScore: data.result.salesScore,
            aiScore: data.result.aiScore,
            revenueScore: data.result.revenueScore,
            total: data.result.total,
            tier: data.result.tier,
            startHere: data.result.startHere,
            nextSteps: data.result.nextSteps,
          },
          saved: Boolean(data.saved),
          note: data.message || "",
        });
        setSubmitting(false);
        return;
      }

      setView({
        result: local,
        saved: false,
        note: data?.message || "Your result is ready on this page. A copy was not saved.",
      });
    } catch (error) {
      console.error("Scorecard request failed:", error);
      setView({
        result: local,
        saved: false,
        note: "Your result is ready on this page. A copy was not saved.",
      });
    }
    setSubmitting(false);
  }

  if (view) {
    const { result, saved, note } = view;
    const sections = [
      { label: "Sales process", score: result.salesScore, max: 6 },
      { label: "AI adoption", score: result.aiScore, max: 6 },
      { label: "Revenue goals", score: result.revenueScore, max: 8 },
    ];
    return (
      <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-growth">Your result</p>
        <h2
          ref={resultHeading}
          tabIndex={-1}
          className="mt-3 font-display text-4xl font-semibold text-primary outline-none sm:text-5xl"
        >
          {result.total}
          <span className="text-2xl text-ink/50"> / 20</span>
        </h2>
        <p className="mt-3 text-lg font-medium text-ink">{result.tier}</p>
        {!saved && (
          <p className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-sm text-ink/80" role="status">
            {note}
          </p>
        )}

        <ul className="mt-8 space-y-4">
          {sections.map((section) => (
            <li key={section.label}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-semibold text-primary">{section.label}</span>
                <span className="text-ink/70">
                  {section.score} / {section.max}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-50" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(section.score / section.max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 rounded-2xl border border-gold/40 bg-gold-50 px-4 py-4 text-sm leading-relaxed text-ink">
          <span className="font-semibold text-primary">Start here: </span>
          {result.startHere}
        </p>

        <h3 className="mt-8 font-display text-2xl text-primary">Next steps</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink/85">
          {result.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/strategy-call" className="btn-primary">
            Book a strategy call <span aria-hidden="true">&rarr;</span>
          </Link>
          {site.whatsappUrl ? (
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              WhatsApp Innocent
            </a>
          ) : null}
        </div>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.16em] text-ink/50">
          Powered by Offer Value With Innocent
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8"
      aria-describedby={formError ? `${formId}-form-error` : undefined}
    >
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      {formError ? (
        <p id={`${formId}-form-error`} className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="space-y-10">
        {scorecardSections.map((section) => (
          <fieldset key={section.id} className="space-y-6">
            <legend className="font-display text-2xl text-primary">{section.title}</legend>
            {section.questions.map((question, index) => {
              const number = scorecardSections
                .slice(0, scorecardSections.indexOf(section))
                .reduce((count, item) => count + item.questions.length, index + 1);
              const errorId = `${formId}-${question.id}-error`;
              const invalid = Boolean(errors[question.id]);
              return (
                <div key={question.id}>
                  <p id={`${formId}-${question.id}-label`} className="text-base font-medium text-ink">
                    {number}. {question.prompt}
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby={`${formId}-${question.id}-label`}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? errorId : undefined}
                    className="mt-3 grid grid-cols-3 gap-2"
                  >
                    {answerChoices.map((choice) => {
                      const inputId = `${formId}-${question.id}-${choice.value}`;
                      const selected = answers[question.id] === choice.value;
                      return (
                        <label
                          key={choice.value}
                          htmlFor={inputId}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-semibold transition-colors ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-primary-100 bg-white text-primary hover:border-primary"
                          }`}
                        >
                          <input
                            id={inputId}
                            className="sr-only"
                            type="radio"
                            name={question.id}
                            value={choice.value}
                            checked={selected}
                            onChange={() => updateAnswer(question.id, choice.value)}
                          />
                          {choice.label}
                        </label>
                      );
                    })}
                  </div>
                  {invalid ? (
                    <p id={errorId} className="mt-2 text-sm text-red-700">
                      {errors[question.id]}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </fieldset>
        ))}
      </div>

      <fieldset className="mt-10 space-y-4 border-t border-primary-100 pt-8">
        <legend className="font-display text-2xl text-primary">Your details</legend>
        <p className="text-sm text-ink/70">
          Name, email, and business name are required. Phone or WhatsApp is optional.
        </p>
        <Field
          id={`${formId}-name`}
          label="Name"
          autoComplete="name"
          value={contact.fullName}
          error={errors.fullName}
          onChange={(value) => updateContact("fullName", value)}
          required
        />
        <Field
          id={`${formId}-email`}
          label="Email"
          type="email"
          autoComplete="email"
          value={contact.email}
          error={errors.email}
          onChange={(value) => updateContact("email", value)}
          required
        />
        <Field
          id={`${formId}-business`}
          label="Business name"
          autoComplete="organization"
          value={contact.businessName}
          error={errors.businessName}
          onChange={(value) => updateContact("businessName", value)}
          required
        />
        <Field
          id={`${formId}-phone`}
          label="Phone or WhatsApp"
          type="tel"
          autoComplete="tel"
          value={contact.phone}
          error={errors.phone}
          onChange={(value) => updateContact("phone", value)}
          optional
        />
      </fieldset>

      <div className="mt-6">
        <TurnstileWidget onToken={setTurnstileToken} />
      </div>
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Scoring…" : "See my score"}
      </button>
      <div className="mt-4">
        <FormLegalNote />
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  required = false,
  optional = false,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-primary">
        {label}
        {optional ? <span className="font-normal text-ink/50"> (optional)</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
