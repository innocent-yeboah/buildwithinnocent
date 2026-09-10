import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import {
  ChatIcon,
  PaletteIcon,
  WrenchIcon,
  SparkIcon,
  ChartIcon,
  CheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "How It Works — From First Call to Customers in 5 Weeks",
  description:
    "Our 5-step process: Discovery, Design & Build, Review & Refine, Launch, and 12 months of Growth support. Your digital business system, live in 5 weeks.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    number: 1,
    title: "Discovery",
    timeframe: "Week 1",
    icon: ChatIcon,
    description:
      "We sit down with you — in person or on a call — and learn your business inside out.",
    details: [
      "Understand your business, goals, and customers",
      "Analyze your current online presence",
      "Define your offer and who it is for",
    ],
  },
  {
    number: 2,
    title: "Design & Build",
    timeframe: "Weeks 2-3",
    icon: PaletteIcon,
    description:
      "We design your website and build your custom digital business system around your workflow.",
    details: [
      "Design your website and system flow",
      "Build booking, payments, CRM, and automation",
      "Connect everything into one system",
    ],
  },
  {
    number: 3,
    title: "Review & Refine",
    timeframe: "Week 4",
    icon: WrenchIcon,
    description:
      "You see the full system working with your real content. We adjust until it feels right.",
    details: [
      "You review every page and every flow",
      "We make adjustments based on your feedback",
      "Final polish and quality checks",
    ],
  },
  {
    number: 4,
    title: "Launch",
    timeframe: "Week 5",
    icon: SparkIcon,
    description:
      "Your system goes live — and you learn to run it with confidence in one training session.",
    details: [
      "Deploy your system live on your domain",
      "Train you on the admin dashboard",
      "Switch on lead capture and follow-up automation",
    ],
  },
  {
    number: 5,
    title: "Grow",
    timeframe: "Months 2-12",
    icon: ChartIcon,
    description:
      "We stay with you for a full year — monitoring, supporting, and optimizing as your business grows.",
    details: [
      "Ongoing technical support",
      "System monitoring and optimization",
      "Regular check-ins on your lead flow",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="container-site max-w-3xl">
          <p className="animate-fade-in section-eyebrow !text-gold">How It Works</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            From First Conversation to Customers in 5 Weeks.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            No mystery, no endless meetings, no moving deadlines. A clear
            5-step process — and then a full year of partnership after launch.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="process-title" className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <h2 id="process-title" className="sr-only">
            The 5-step process
          </h2>

          <ol className="relative mx-auto max-w-3xl space-y-10">
            {/* Vertical connector line */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-7 top-8 w-0.5 bg-gradient-to-b from-primary via-growth to-gold sm:left-8"
            />

            {steps.map((step, index) => (
              <li key={step.number} className="relative">
                <RevealOnScroll delay={index * 80}>
                  <div className="flex gap-6">
                    <span
                      aria-hidden="true"
                      className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-gold shadow-md sm:h-16 sm:w-16"
                    >
                      <step.icon className="h-7 w-7" />
                    </span>
                    <article className="flex-1 rounded-2xl border border-primary-50 bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-xl font-bold text-primary sm:text-2xl">
                          <span className="text-gold-600">Step {step.number}.</span>{" "}
                          {step.title}
                        </h3>
                        <p className="rounded-full bg-growth-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-growth-700">
                          {step.timeframe}
                        </p>
                      </div>
                      <p className="mt-3 leading-relaxed text-ink/80">
                        {step.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2.5 text-sm text-ink/80">
                            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-growth" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </RevealOnScroll>
              </li>
            ))}
          </ol>

          {/* Outcome banner */}
          <RevealOnScroll delay={200}>
            <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-primary-50 p-8 text-center">
              <p className="font-display text-xl font-bold text-primary sm:text-2xl">
                Week 5: your system is live. Month 12: it has been working for
                you every single night in between.
              </p>
              <Link href="/start" className="btn-primary mt-6">
                Start Week 1 Now <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CtaBand
        title="Five Weeks From Now, This Could Be Running Your Business."
        subtitle="Tell us about your project today and we will map your 5-week plan in your proposal."
      />
    </>
  );
}
