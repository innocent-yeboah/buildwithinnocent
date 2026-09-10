"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  assessmentQuestions,
  layerLabels,
  ASSESSMENT_ANSWERS_KEY,
} from "@/lib/assessment";

/**
 * The interactive question flow. One question at a time, progress bar,
 * answers held in state and persisted to sessionStorage on completion.
 */
export default function AssessmentQuestions() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Restore progress if the visitor navigated away mid-assessment.
  useEffect(() => {
    const saved = sessionStorage.getItem(ASSESSMENT_ANSWERS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, number>;
        setAnswers(parsed);
        // Resume at the first unanswered question.
        const firstUnanswered = assessmentQuestions.findIndex((q) => !(q.id in parsed));
        if (firstUnanswered >= 0) setStep(firstUnanswered);
        else setStep(assessmentQuestions.length - 1);
      } catch {
        sessionStorage.removeItem(ASSESSMENT_ANSWERS_KEY);
      }
    }
  }, []);

  const question = assessmentQuestions[step];
  const total = assessmentQuestions.length;
  const progress = Math.round(((step + 1) / total) * 100);

  function selectAnswer(points: number) {
    const next = { ...answers, [question.id]: points };
    setAnswers(next);
    sessionStorage.setItem(ASSESSMENT_ANSWERS_KEY, JSON.stringify(next));

    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      router.push("/assessment/capture");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-primary">
            Question {step + 1} of {total}
          </span>
          <span className="text-growth">{progress}% complete</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Assessment progress"
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary-50"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-growth to-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div key={question.id} className="animate-fade-up">
        <p className="section-eyebrow">
          Layer: {layerLabels[question.layer]}
        </p>
        <h2 className="font-display text-2xl font-bold leading-snug text-primary sm:text-3xl">
          {question.question}
        </h2>

        <div className="mt-8 space-y-3">
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option.points;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => selectAnswer(option.points)}
                className={`w-full rounded-xl border-2 px-6 py-4 text-left text-base font-medium transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? "border-growth bg-growth-50 text-growth-700"
                    : "border-primary-100 bg-white text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="mt-8 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            &larr; Previous question
          </button>
        )}
      </div>
    </div>
  );
}
