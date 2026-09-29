import type { Metadata } from "next";
import ScorecardForm from "@/components/ScorecardForm";

export const metadata: Metadata = {
  title: "AI Readiness Scorecard for Revenue Growth",
  description:
    "Ten questions on sales, AI adoption, and revenue goals. Get a score out of 20, see the first place to start, and book a strategy call.",
  alternates: { canonical: "/scorecard" },
  openGraph: {
    title: "AI Readiness Scorecard for Revenue Growth",
    description:
      "Ten questions on sales, AI adoption, and revenue goals. Get a score out of 20 and the first place to start.",
    url: "/scorecard",
  },
};

export default function ScorecardPage() {
  return (
    <>
      <section className="bg-primary py-14 text-white sm:py-16">
        <div className="container-site max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Free AI Readiness Scorecard
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            AI Readiness Scorecard for Revenue Growth
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-100">
            Ten questions. Choose No, Partly, or Yes. You get a score out of 20,
            a breakdown of sales, AI adoption, and revenue goals, and the first
            place to start.
          </p>
        </div>
      </section>
      <section className="bg-primary-50 py-12 sm:py-16">
        <div className="container-site max-w-3xl">
          <ScorecardForm />
        </div>
      </section>
    </>
  );
}
