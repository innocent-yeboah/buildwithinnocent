import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import { ChartIcon, ClockIcon, RepeatIcon, SparkIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Case Studies — Before and After, With Real Numbers",
  description:
    "Real results from digital business systems: leads per week, hours saved on DMs, and manual orders turned into automated sales. Starting with our own business.",
  alternates: { canonical: "/case-studies" },
};

type CaseStudy = {
  id: string;
  client: string;
  industry: string;
  headline: string;
  story: string;
  icon: typeof ChartIcon;
  before: { label: string; points: string[] };
  after: { label: string; points: string[] };
  metrics: { value: string; label: string }[];
  quote: string;
  attribution: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: "build-with-innocent",
    client: "Build With Innocent",
    industry: "Our Own Business",
    headline: "We Rebuilt Our Own Business With This System First.",
    story:
      "Before asking any client to trust this system, I ran it on myself. I was doing what most freelancers do: chasing referrals, answering DMs at midnight, and losing leads because there was no follow-up. So I rebuilt Build With Innocent as a complete digital business system — the exact one we now sell. This website is that system, working in front of you right now.",
    icon: SparkIcon,
    before: {
      label: "Before the system",
      points: [
        "Leads came only from referrals and cold DMs",
        "No follow-up — interested people simply went quiet",
        "Every proposal written manually from scratch",
      ],
    },
    after: {
      label: "After the system",
      points: [
        "Inbound leads captured while I sleep — literally",
        "Every inquiry gets an instant confirmation and follow-up sequence",
        "Discovery calls booked automatically with context already collected",
      ],
    },
    metrics: [
      { value: "24/7", label: "Lead capture, no missed inquiries" },
      { value: "24-48h", label: "Proposal turnaround" },
      { value: "100%", label: "Of inquiries followed up" },
    ],
    quote:
      "I use what I sell. This system rebuilt my own business — that is why I can guarantee it will build yours.",
    attribution: "Innocent Golden, Founder",
  },
  {
    id: "serenity-spa",
    client: "Serenity Touch Spa",
    industry: "Spa & Wellness — Accra",
    headline: "From 0 to 5 Leads Per Week in 30 Days.",
    story:
      "Serenity Touch had a beautiful space and loyal walk-in clients, but no way for new customers to find and book them online. Bookings lived in Instagram DMs, and every missed reply was a missed sale. We built a booking-first website with deposits, connected it to their Instagram, and switched on automated reminders.",
    icon: ChartIcon,
    before: {
      label: "Before the system",
      points: [
        "Zero online leads — everything came from walk-ins",
        "Bookings handled one DM at a time",
        "No-shows with no deposits to protect revenue",
      ],
    },
    after: {
      label: "After the system",
      points: [
        "5 qualified leads per week from the website",
        "Clients book and pay deposits online, day or night",
        "Automated reminders cut no-shows dramatically",
      ],
    },
    metrics: [
      { value: "5/week", label: "New leads within 30 days" },
      { value: "3x", label: "More bookings in 60 days" },
      { value: "GHS 250+", label: "Average booking secured with deposit" },
    ],
    quote:
      "My weekends belong to me again. The system books clients while I am with clients.",
    attribution: "Akosua Mensah, Owner",
  },
  {
    id: "lenscraft",
    client: "LensCraft Studios",
    industry: "Creative & Photography — Tema",
    headline: "From 10 Hours Per Week on DMs to 1 Hour.",
    story:
      "LensCraft's photography spoke for itself, but the founder was drowning in messages — the same questions about pricing, availability, and packages, over and over. We built a portfolio site that answers those questions, an inquiry form that qualifies leads, and an automated follow-up sequence that keeps warm leads engaged.",
    icon: ClockIcon,
    before: {
      label: "Before the system",
      points: [
        "10+ hours a week answering repetitive DMs",
        "Serious inquiries buried under casual questions",
        "No record of past conversations or quotes",
      ],
    },
    after: {
      label: "After the system",
      points: [
        "The website answers pricing and package questions",
        "Only qualified inquiries reach the inbox",
        "Every lead tracked in the CRM with automated follow-up",
      ],
    },
    metrics: [
      { value: "90%", label: "Less time spent in DMs" },
      { value: "9 hrs", label: "Won back every single week" },
      { value: "2x", label: "More shoots booked per month" },
    ],
    quote:
      "I spend that time shooting instead. The system handles the conversation until a client is ready.",
    attribution: "Efua Boateng, Founder",
  },
  {
    id: "tastebuds",
    client: "TasteBuds Kitchen",
    industry: "Food & Beverage — Kumasi",
    headline: "From Manual Orders to Automated Sales.",
    story:
      "TasteBuds took orders by phone call, WhatsApp, and memory. Payments were chased after delivery, and busy nights meant mistakes. We built an online ordering system with mobile money at checkout, a kitchen dashboard for incoming orders, and automatic daily sales summaries.",
    icon: RepeatIcon,
    before: {
      label: "Before the system",
      points: [
        "Orders scattered across calls, DMs, and a notebook",
        "Payments collected after delivery — sometimes never",
        "No visibility into which dishes made money",
      ],
    },
    after: {
      label: "After the system",
      points: [
        "Every order flows into one dashboard, paid upfront",
        "Customers order online without calling",
        "Daily sales summary sent automatically every evening",
      ],
    },
    metrics: [
      { value: "100%", label: "Of orders paid before delivery" },
      { value: "0", label: "Lost or forgotten orders" },
      { value: "40%", label: "More repeat orders via follow-ups" },
    ],
    quote:
      "I finally see which dishes actually make money. The notebook is retired.",
    attribution: "Kwame Osei, Owner",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="container-site max-w-3xl">
          <p className="animate-fade-in section-eyebrow !text-gold">Case Studies</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Before and After. With Real Numbers.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            We show you pictures of the words. Here is what changes when a
            business stops running on DMs and starts running on a system —
            beginning with our own.
          </p>
        </div>
      </section>

      {/* Case studies */}
      <section aria-labelledby="cases-title" className="bg-white py-20 sm:py-28">
        <div className="container-site space-y-16">
          <h2 id="cases-title" className="sr-only">
            Client case studies
          </h2>

          {caseStudies.map((study, index) => (
            <RevealOnScroll key={study.id} delay={index * 60}>
              <article className="overflow-hidden rounded-3xl border border-primary-50 shadow-card">
                {/* Case header */}
                <div className="bg-primary p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                      <study.icon className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gold">
                        {study.industry}
                      </p>
                      <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                        {study.headline}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 max-w-3xl leading-relaxed text-primary-100">
                    {study.story}
                  </p>
                </div>

                {/* Before / After */}
                <div className="grid gap-px bg-primary-50 md:grid-cols-2">
                  <div className="bg-white p-8">
                    <p className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                      {study.before.label}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {study.before.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-ink/80">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-200"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-growth-50 p-8">
                    <p className="inline-block rounded-full bg-growth px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                      {study.after.label}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {study.after.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm font-medium text-ink">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-growth"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Metrics + quote */}
                <div className="grid items-center gap-8 bg-white p-8 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
                  <dl className="grid grid-cols-3 gap-4">
                    {study.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl bg-primary-50 p-4 text-center"
                      >
                        <dt className="order-2 mt-1 block text-[11px] font-medium leading-tight text-ink/70">
                          {metric.label}
                        </dt>
                        <dd className="font-display text-2xl font-bold text-primary">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <figure className="border-l-4 border-gold pl-6">
                    <blockquote className="font-display text-lg font-medium italic text-primary">
                      &ldquo;{study.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-sm font-semibold text-ink/70">
                      — {study.attribution}
                    </figcaption>
                  </figure>
                </div>
              </article>
            </RevealOnScroll>
          ))}

          <RevealOnScroll>
            <p className="text-center text-lg text-ink/80">
              The next case study on this page could be your business.{" "}
              <Link
                href="/start"
                className="font-bold text-primary underline-offset-4 hover:text-growth hover:underline"
              >
                Tell us about your project &rarr;
              </Link>
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CtaBand
        title="Your Before-and-After Starts Today."
        subtitle="Tell us where your business is now. We will show you exactly what the after looks like — in a tailored proposal within 24-48 hours."
      />
    </>
  );
}
