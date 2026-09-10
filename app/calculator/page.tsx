import type { Metadata } from "next";
import PricingCalculator from "@/components/PricingCalculator";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Pricing Calculator — Estimate Your Digital Business System",
  description:
    "Build your own estimate: pick the modules your business needs and see the price instantly. Transparent pricing, no surprises.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container-site max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">Pricing Calculator</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Know the Price Before You Ever Talk to Us.
          </h1>
          <p
            className="animate-fade-up mt-5 text-lg text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            No &ldquo;DM for price.&rdquo; Pick what your business needs and
            see your estimate instantly — the same numbers we would put in
            your proposal.
          </p>
        </div>
      </section>

      <section aria-label="Build your estimate" className="bg-white py-16 sm:py-24">
        <div className="container-site">
          <PricingCalculator />
        </div>
      </section>

      <CtaBand
        title="Your Exact Proposal Is One Message Away."
        subtitle="The calculator gives you a solid estimate. Tell us about your project and we will confirm the exact scope and price within 24-48 hours."
      />
    </>
  );
}
