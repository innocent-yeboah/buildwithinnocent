"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  assessmentQuestions,
  computeScores,
  getBand,
  ASSESSMENT_ANSWERS_KEY,
  ASSESSMENT_CONTACT_KEY,
} from "@/lib/assessment";
import { trackAssessmentComplete } from "@/lib/pixels";

type Contact = { fullName: string; businessName: string; email: string };

const inputClasses =
  "w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

/**
 * Capture step: the score is ready, we ask who to address it to.
 * Saves the assessment via the API, then reveals the score page.
 */
export default function AssessmentCapture() {
  const router = useRouter();
  const [contact, setContact] = useState<Contact>({
    fullName: "",
    businessName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answersReady, setAnswersReady] = useState<boolean | null>(null);

  // A visitor landing here without answers should start the assessment.
  useEffect(() => {
    const saved = sessionStorage.getItem(ASSESSMENT_ANSWERS_KEY);
    if (!saved) {
      setAnswersReady(false);
      router.replace("/assessment");
      return;
    }
    try {
      const answers = JSON.parse(saved) as Record<string, number>;
      const complete = assessmentQuestions.every((q) => q.id in answers);
      setAnswersReady(complete);
      if (!complete) router.replace("/assessment/questions");
    } catch {
      router.replace("/assessment");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      contact.fullName.trim().length < 2 ||
      contact.businessName.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email.trim())
    ) {
      setError("Please fill in your name, business, and a valid email so we can address your results properly.");
      return;
    }

    setSubmitting(true);

    const answers = JSON.parse(
      sessionStorage.getItem(ASSESSMENT_ANSWERS_KEY) ?? "{}",
    ) as Record<string, number>;
    const { total, layers } = computeScores(answers);
    const band = getBand(total);

    sessionStorage.setItem(ASSESSMENT_CONTACT_KEY, JSON.stringify(contact));

    // Best effort: the visitor still gets their score if saving fails.
    try {
      await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: contact.fullName.trim(),
          businessName: contact.businessName.trim(),
          email: contact.email.trim(),
          score: total,
          band: band.name,
          layerScores: layers,
          answers,
        }),
      });
      trackAssessmentComplete(total);
    } catch {
      // Never block the score reveal on a network error.
    }

    router.push("/assessment/score");
  }

  if (answersReady !== true) {
    return (
      <p className="py-12 text-center text-ink/60">Loading your assessment…</p>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="text-center">
        <p className="section-eyebrow">One Last Step</p>
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Your Score Is Ready.
        </h1>
        <p className="mt-4 text-ink/80">
          Tell us who to address it to and we will show your Digital Business
          Readiness Score — with a personalized breakdown.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
        <div>
          <label htmlFor="assess-name" className="mb-1.5 block text-sm font-semibold text-primary">
            Full Name
          </label>
          <input
            id="assess-name"
            type="text"
            autoComplete="name"
            required
            value={contact.fullName}
            onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
            placeholder="Ama Serwaa"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="assess-business" className="mb-1.5 block text-sm font-semibold text-primary">
            Business Name
          </label>
          <input
            id="assess-business"
            type="text"
            autoComplete="organization"
            required
            value={contact.businessName}
            onChange={(e) => setContact({ ...contact, businessName: e.target.value })}
            placeholder="Serwaa's Kitchen"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="assess-email" className="mb-1.5 block text-sm font-semibold text-primary">
            Email Address
          </label>
          <input
            id="assess-email"
            type="email"
            autoComplete="email"
            required
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="you@yourbusiness.com"
            className={inputClasses}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Calculating…" : "Show My Score"}
          {!submitting && <span aria-hidden="true">&rarr;</span>}
        </button>
        <p className="text-center text-xs text-ink/60">
          Your details stay with us. No spam — ever.
        </p>
      </form>
    </div>
  );
}
