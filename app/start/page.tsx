import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import RevealOnScroll from "@/components/RevealOnScroll";
import { site } from "@/lib/site";
import {
  ShieldCheckIcon,
  GlobeIcon,
  HeadsetIcon,
  SparkIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Start Your System — Tell Us About Your Project",
  description:
    "Tell us about your project and receive a tailored proposal within 24-48 hours. 10+ leads in 30 days or we work for free.",
  alternates: { canonical: "/start" },
};

const trustSignals = [
  {
    icon: SparkIcon,
    title: "We use what we sell",
    description: "This exact system runs our own business — including this form.",
  },
  {
    icon: GlobeIcon,
    title: "Built for African enterprises",
    description: "Mobile money, WhatsApp flows, and realities we know first-hand.",
  },
  {
    icon: HeadsetIcon,
    title: "1 year launch support",
    description: "We stay with you for 12 months after launch. You are never alone.",
  },
];

/** Service structured data for the flagship offer. */
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Complete Digital Business System",
  serviceType: "Digital business system development",
  provider: { "@type": "Organization", name: site.name, url: site.url },
  areaServed: "Africa",
  description:
    "Professional website, booking, payments, CRM, social integration, automated email, plus one year of hosting and support.",
  offers: [
    {
      "@type": "Offer",
      price: "5400",
      priceCurrency: "GHS",
      description:
        "50% upfront (GHS 2,700) to initiate the project, 50% (GHS 2,700) on delivery",
    },
    {
      "@type": "Offer",
      price: "1000",
      priceCurrency: "GHS",
      description: "GHS 1,000 per month for 6 months",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "1000",
        priceCurrency: "GHS",
        billingDuration: "P6M",
        billingIncrement: 1,
        unitCode: "MON",
      },
    },
  ],
};

export default function StartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <section className="bg-primary py-16 sm:py-20">
        <div className="container-site max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">Start Your System</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Tell Us About Your Project.
          </h1>
          <p
            className="animate-fade-up mt-5 text-lg text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            We will send a tailored proposal within 24-48 hours — what we
            would build, how long it takes, and exactly what it costs.
          </p>
          <p
            className="animate-fade-up mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-sm font-semibold text-gold"
            style={{ animationDelay: "250ms" }}
          >
            <ShieldCheckIcon className="h-5 w-5" />
            {site.promise}
          </p>
        </div>
      </section>

      <section aria-label="Project inquiry form" className="bg-primary-50 py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* Left rail: what happens next + trust */}
          <div className="space-y-8">
            <RevealOnScroll>
              <div className="rounded-3xl bg-white p-8 shadow-card">
                <h2 className="font-display text-xl font-bold text-primary">
                  What Happens After You Hit Send
                </h2>
                <ol className="mt-6 space-y-5">
                  {[
                    {
                      title: "Instant confirmation",
                      description: "You get an email confirming we received your project.",
                    },
                    {
                      title: "We study your business",
                      description: "Innocent personally reviews every submission.",
                    },
                    {
                      title: "Tailored proposal in 24-48 hours",
                      description: "Scope, timeline, and price — clear and in writing.",
                    },
                  ].map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-gold"
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-primary">{step.title}</p>
                        <p className="mt-0.5 text-sm text-ink/70">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 flex items-center gap-2 rounded-xl bg-growth-50 px-4 py-3 text-sm font-semibold text-growth-700">
                  <ClockIcon className="h-5 w-5 shrink-0" />
                  No obligation. The proposal is yours to keep either way.
                </p>
              </div>
            </RevealOnScroll>

            <div className="space-y-4">
              {trustSignals.map((signal, index) => (
                <RevealOnScroll key={signal.title} delay={index * 100}>
                  <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <signal.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-bold text-primary">{signal.title}</p>
                      <p className="mt-0.5 text-sm text-ink/70">{signal.description}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll delay={200}>
              <div className="rounded-3xl border-2 border-gold bg-primary p-8 text-center">
                <ShieldCheckIcon className="mx-auto h-10 w-10 text-gold" />
                <p className="mt-4 font-display text-lg font-bold leading-snug text-white">
                  &ldquo;10+ leads in 30 days or we work for free.&rdquo;
                </p>
                <p className="mt-2 text-sm text-primary-100">
                  The risk is ours. The growth is yours.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          {/* The form */}
          <RevealOnScroll delay={100}>
            <div className="rounded-3xl bg-white p-8 shadow-card sm:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-growth text-white">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-ink/70">
                  Takes about 3 minutes. Every field helps us build a better
                  proposal for you.
                </p>
              </div>
              <LeadForm />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
