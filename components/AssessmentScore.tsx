"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  computeScores,
  getBand,
  layerAdvice,
  layerLabels,
  type LayerKey,
  type LayerScores,
  ASSESSMENT_ANSWERS_KEY,
  ASSESSMENT_CONTACT_KEY,
} from "@/lib/assessment";

type Result = {
  firstName: string;
  businessName: string;
  total: number;
  layers: LayerScores;
};

/**
 * The score reveal: animated gauge, per-layer breakdown, and advice
 * focused on the weakest layers — ending in the /start CTA.
 */
export default function AssessmentScore() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const answersRaw = sessionStorage.getItem(ASSESSMENT_ANSWERS_KEY);
    const contactRaw = sessionStorage.getItem(ASSESSMENT_CONTACT_KEY);
    if (!answersRaw || !contactRaw) {
      router.replace("/assessment");
      return;
    }
    try {
      const answers = JSON.parse(answersRaw) as Record<string, number>;
      const contact = JSON.parse(contactRaw) as {
        fullName: string;
        businessName: string;
      };
      const { total, layers } = computeScores(answers);
      setResult({
        firstName: contact.fullName.split(" ")[0],
        businessName: contact.businessName,
        total,
        layers,
      });
    } catch {
      router.replace("/assessment");
    }
  }, [router]);

  // Count the score up from zero (respecting reduced motion).
  useEffect(() => {
    if (!result) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplayScore(result.total);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round(result.total * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [result]);

  if (!result) {
    return <p className="py-12 text-center text-ink/60">Preparing your results…</p>;
  }

  const band = getBand(result.total);
  const sortedLayers = (Object.keys(result.layers) as LayerKey[]).sort(
    (a, b) => result.layers[a] - result.layers[b],
  );
  const weakest = sortedLayers.slice(0, 2);
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <p className="section-eyebrow">
          {result.firstName}, here is where {result.businessName} stands
        </p>
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Your Digital Business Readiness Score
        </h1>
      </div>

      {/* Gauge */}
      <div className="mx-auto mt-10 w-56">
        <svg viewBox="0 0 120 120" role="img" aria-label={`Score: ${result.total} out of 100`}>
          <circle cx="60" cy="60" r="54" fill="none" stroke="#EEF3F9" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={result.total <= 40 ? "#FF6B6B" : result.total <= 70 ? "#FFC107" : "#2E7D32"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - displayScore / 100)}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
          <text
            x="60"
            y="58"
            textAnchor="middle"
            fontSize="30"
            fontWeight="bold"
            fill="#1E3A5F"
          >
            {displayScore}
          </text>
          <text x="60" y="76" textAnchor="middle" fontSize="10" fill="#333333">
            out of 100
          </text>
        </svg>
      </div>

      <div className="mt-8 rounded-3xl border border-primary-50 bg-white p-8 text-center shadow-card">
        <p className="inline-block rounded-full bg-primary px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-gold">
          {band.name} &middot; {band.range}
        </p>
        <h2 className="mt-5 font-display text-2xl font-bold text-primary">
          {band.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/80">
          {band.description}
        </p>
      </div>

      {/* Layer breakdown */}
      <div className="mt-10 rounded-3xl border border-primary-50 bg-white p-8 shadow-card">
        <h2 className="font-display text-xl font-bold text-primary">
          Your Four Layers, Broken Down
        </h2>
        <div className="mt-6 space-y-5">
          {(Object.keys(result.layers) as LayerKey[]).map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-primary">{layerLabels[key]}</span>
                <span className={result.layers[key] < 50 ? "text-red-600" : "text-growth"}>
                  {result.layers[key]}%
                </span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-primary-50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.layers[key] < 50 ? "bg-[#FF6B6B]" : "bg-growth"
                  }`}
                  style={{ width: `${Math.max(result.layers[key], 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advice for weakest layers */}
      <div className="mt-10 space-y-4">
        <h2 className="font-display text-xl font-bold text-primary">
          Where to Start First
        </h2>
        {weakest.map((key, index) => (
          <div
            key={key}
            className="flex gap-4 rounded-2xl border-l-4 border-gold bg-gold-50 p-6"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-gold">
              {index + 1}
            </span>
            <div>
              <p className="font-bold text-primary">
                Fix your {layerLabels[key]} layer ({result.layers[key]}%)
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink/80">
                {layerAdvice[key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-3xl bg-primary p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl font-bold text-white">
          Want Us to Fix All Four Layers for You?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-primary-100">
          This is exactly what the Complete Digital Business System does —
          and it comes with our guarantee: 10+ leads in 30 days or we work
          for free.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/start" className="btn-primary">
            Tell Us About Your Project <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link href="/what-we-build" className="btn-ghost-light">
            See What We Build
          </Link>
        </div>
      </div>
    </div>
  );
}
