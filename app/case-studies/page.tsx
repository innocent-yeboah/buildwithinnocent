import { pageMeta } from "@/lib/page-meta";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import { CaseStudyList } from "@/components/ClientStories";
import { inspectableWork, measuredPerformance, publishedCaseStudies, showVisitorPlaceholders } from "@/lib/proof";

export const metadata = pageMeta({
  title: "Proof",
  description:
    "Client case studies are published only with a confirmed name and numbers. Until then, the live booking sandbox and this website are the work you can inspect.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-site max-w-3xl py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Proof</p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">
            Results, when a client is willing to put their name on them.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-primary-100">
            This page will carry case studies with a real client, role,
            business, logo, photograph, verified numbers, and a link. It does
            not carry stories written to fill the space.
          </p>
        </div>
      </section>

      <section aria-labelledby="studies-title" className="bg-white py-16 sm:py-24">
        <div className="container-site">
          <h2 id="studies-title" className="sr-only">
            Client case studies
          </h2>
          <CaseStudyList studies={publishedCaseStudies} />
        </div>
      </section>

      <section aria-labelledby="open-title" className="bg-primary-50 py-16 sm:py-24">
        <div className="container-site">
          <p className="section-eyebrow">What you can inspect today</p>
          <h2 id="open-title" className="section-title max-w-2xl">
            A working sandbox, labelled as a demo.
          </h2>
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {inspectableWork.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-3xl bg-white p-6"
                >
                  <h3 className="font-display text-xl text-primary">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{item.body}</p>
                  <span className="mt-5 text-sm font-semibold text-primary">Open it</span>
                </Link>
              </li>
            ))}
          </ul>
          {showVisitorPlaceholders.labScores && measuredPerformance && (
            <div className="mt-8 rounded-3xl bg-white p-6">
              <p className="text-sm font-semibold text-primary">
                {measuredPerformance.tool}, {measuredPerformance.measuredOn}
              </p>
              <p className="mt-1 text-xs text-ink/60">{measuredPerformance.notes}</p>
              <ul className="mt-4 flex flex-wrap gap-6">
                {measuredPerformance.scores.map((score) => (
                  <li key={score.label}>
                    <span className="block font-display text-2xl text-primary">{score.value}</span>
                    <span className="text-xs text-ink/60">{score.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="If the work holds up, book the conversation."
        subtitle="A strategy call is the next step. A short note is there if you would rather write."
      />
    </>
  );
}
