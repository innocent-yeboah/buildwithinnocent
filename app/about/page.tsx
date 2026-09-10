import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";
import { SparkIcon, ChartIcon, GlobeIcon, ShieldCheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About — Innocent Golden and the Story Behind the System",
  description:
    "From Uber driver to full-stack developer to building digital business systems for African enterprises. I don't build tutorials — I build systems that grow businesses.",
  alternates: { canonical: "/about" },
};

const journey = [
  {
    period: "The Starting Point",
    title: "Behind the Wheel",
    description:
      "I drove Uber to pay the bills. Long shifts, long nights — and in between rides, I taught myself to code. Every red light was a flashcard. Every slow afternoon was a lesson.",
    icon: GlobeIcon,
  },
  {
    period: "The Turn",
    title: "Full-Stack Developer",
    description:
      "I went all-in on software: Next.js, TypeScript, databases, payments, automation. Not to collect certificates — to build things real businesses could actually use.",
    icon: SparkIcon,
  },
  {
    period: "The Proof",
    title: "4 Products in 6 Months",
    description:
      "I shipped four complete products in six months. Each one taught me the same lesson: African businesses do not need more apps. They need systems that bring in customers.",
    icon: ChartIcon,
  },
  {
    period: "Today",
    title: "Build With Innocent",
    description:
      "Now I build digital business systems for African enterprises — websites, booking, payments, CRM, and automation working as one. And I run my own business on the exact system I sell.",
    icon: ShieldCheckIcon,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Story hero */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="animate-fade-in section-eyebrow !text-gold">About</p>
            <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Hi, I am Innocent Golden.
            </h1>
            <p
              className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
              style={{ animationDelay: "150ms" }}
            >
              I built this system because I was tired of seeing African
              businesses struggle to get online. Brilliant food, skilled
              hands, beautiful work — and websites that did nothing, or no
              website at all. Talent was never the problem. The system was.
            </p>
            <p
              className="animate-fade-up mt-4 text-lg leading-relaxed text-primary-100"
              style={{ animationDelay: "250ms" }}
            >
              So I decided to build the thing I kept wishing existed: not
              another website, but a complete digital business system — one
              that captures customers, follows up, and grows the business
              while the owner does what they do best.
            </p>
          </div>

          {/* Founder card */}
          <div className="animate-fade-in" aria-hidden="true">
            <div className="mx-auto max-w-sm rounded-3xl border border-white/15 bg-white/[0.07] p-8 text-center backdrop-blur">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gold font-display text-3xl font-bold text-primary-900">
                IG
              </span>
              <p className="mt-5 font-display text-xl font-bold text-white">
                {site.founder}
              </p>
              <p className="mt-1 text-sm text-gold">
                Founder & Chief System Builder
              </p>
              <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm italic leading-relaxed text-primary-100">
                &ldquo;I don&rsquo;t build tutorials. I build systems that
                grow businesses.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section aria-labelledby="journey-title" className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">The Journey</p>
            <h2 id="journey-title" className="section-title">
              From Uber to Building Business Systems.
            </h2>
          </RevealOnScroll>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {journey.map((stop, index) => (
              <RevealOnScroll key={stop.title} delay={index * 110}>
                <article className="relative h-full rounded-2xl border border-primary-50 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-gold">
                    <stop.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-growth">
                    {stop.period}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-primary">
                    {stop.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">
                    {stop.description}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy + promise */}
      <section aria-labelledby="philosophy-title" className="bg-primary-50 py-20 sm:py-28">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="h-full rounded-3xl bg-white p-10 shadow-card">
              <p className="section-eyebrow">My Philosophy</p>
              <h2
                id="philosophy-title"
                className="font-display text-2xl font-bold text-primary sm:text-3xl"
              >
                &ldquo;I don&rsquo;t build tutorials. I build systems that
                grow businesses.&rdquo;
              </h2>
              <p className="mt-5 leading-relaxed text-ink/80">
                There is no shortage of advice online — courses, threads,
                gurus. What is missing is execution. Your business does not
                need another lecture about digital marketing. It needs a
                working system: a website that converts, payments that clear,
                follow-ups that send themselves. That is what I build. That
                is all I build.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <div className="flex h-full flex-col rounded-3xl bg-primary p-10">
              <p className="section-eyebrow !text-gold">My Promise</p>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                &ldquo;I use what I sell. This system rebuilt my own
                business.&rdquo;
              </h2>
              <p className="mt-5 leading-relaxed text-primary-100">
                This website is not a brochure — it is a live demonstration.
                The booking, the follow-ups, the CRM behind this form: it is
                the exact system I deliver to you. When I promise 10+ leads
                in 30 days or we work for free, it is because I have watched
                this system deliver for the business I care about most — my
                own.
              </p>
              <Link href="/start" className="btn-primary mt-auto w-fit pt-3.5">
                Work With Me <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CtaBand
        title="Let's Build Your System Together."
        subtitle="Tell me about your business. I will personally review it and send you a tailored proposal within 24-48 hours."
      />
    </>
  );
}
