import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  TargetIcon,
  MegaphoneIcon,
  MagnetIcon,
  RepeatIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChartIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Free Assessment — What Is Your Digital Business Readiness Score?",
  description:
    "Answer 8 quick questions and get your Digital Business Readiness Score — plus a personalized breakdown of where your business is losing customers.",
  alternates: { canonical: "/assessment" },
};

const layerPreviews = [
  {
    icon: TargetIcon,
    title: "Offer",
    question: "Is it instantly clear what you sell — and for how much?",
  },
  {
    icon: MegaphoneIcon,
    title: "Attention",
    question: "Do new customers find you, or do you find them?",
  },
  {
    icon: MagnetIcon,
    title: "Capture",
    question: "When someone is interested, does anything catch them?",
  },
  {
    icon: RepeatIcon,
    title: "Follow-Up",
    question: "What happens to the people who almost bought?",
  },
];

export default function AssessmentPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="container-site relative max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">
            Free — Takes About 2 Minutes
          </p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            What Is Your Digital Business Readiness Score?
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            8 questions. No jargon. You get a score out of 100, a breakdown
            across the four growth layers, and a clear picture of exactly
            where your business is losing customers today.
          </p>
          <div
            className="animate-fade-up mt-9"
            style={{ animationDelay: "300ms" }}
          >
            <Link href="/assessment/questions" className="btn-primary text-lg">
              Get My Score <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <p
            className="animate-fade-up mt-6 flex items-center justify-center gap-2 text-sm text-primary-200"
            style={{ animationDelay: "400ms" }}
          >
            <ClockIcon className="h-4 w-4" /> 2 minutes &middot; instant
            results &middot; no payment details asked
          </p>
        </div>
      </section>

      <section aria-labelledby="what-we-measure" className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">What We Measure</p>
            <h2 id="what-we-measure" className="section-title">
              The Four Layers Every Growing Business Needs.
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {layerPreviews.map((layer, index) => (
              <RevealOnScroll key={layer.title} delay={index * 100}>
                <div className="h-full rounded-2xl border border-primary-50 bg-white p-7 text-center shadow-card">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-gold">
                    <layer.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-primary">
                    {layer.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/70">{layer.question}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={200}>
            <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                { icon: ChartIcon, text: "Score out of 100, instantly" },
                { icon: TargetIcon, text: "Your weakest layer identified" },
                { icon: ShieldCheckIcon, text: "Practical next steps — free" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl bg-primary-50 p-4"
                >
                  <item.icon className="h-6 w-6 shrink-0 text-growth" />
                  <p className="text-sm font-semibold text-primary">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/assessment/questions" className="btn-secondary">
                Start the Assessment <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
