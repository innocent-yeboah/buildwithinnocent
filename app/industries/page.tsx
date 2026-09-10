import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import {
  LeafIcon,
  ForkIcon,
  PaletteIcon,
  StoreIcon,
  WrenchIcon,
  CheckIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Industries — Systems Built for How Your Business Actually Works",
  description:
    "Digital business systems for spas and wellness, food and beverage, creatives, retail and e-commerce, and service providers across Africa.",
  alternates: { canonical: "/industries" },
};

const industries = [
  {
    name: "Spas & Wellness",
    icon: LeafIcon,
    accent: "bg-growth text-white",
    whatWeBuild: "Booking system + client management + automated reminders",
    pain: "Clients book through DMs, forget appointments, and slip through the cracks.",
    outcome:
      "Clients book and pay online, get automatic reminders, and come back because your system follows up for you.",
    features: ["Online booking with deposits", "Client history & preferences", "Automated appointment reminders"],
  },
  {
    name: "Food & Beverage",
    icon: ForkIcon,
    accent: "bg-gold text-primary-900",
    whatWeBuild: "Online ordering + payment + delivery tracking",
    pain: "Orders come from every direction — calls, DMs, walk-ins — and mistakes cost you money.",
    outcome:
      "Orders arrive in one dashboard, payments are collected upfront, and customers track their own delivery.",
    features: ["Online menu & ordering", "Mobile money at checkout", "Delivery status updates"],
  },
  {
    name: "Creatives & Artists",
    icon: PaletteIcon,
    accent: "bg-primary text-gold",
    whatWeBuild: "Portfolio + booking + client inquiries",
    pain: "Your work is brilliant, but inquiries get buried in DMs and pricing conversations repeat forever.",
    outcome:
      "Your portfolio sells for you, serious clients book through a form, and your rates are communicated before the first call.",
    features: ["Portfolio that converts", "Inquiry & booking forms", "Automated project follow-ups"],
  },
  {
    name: "Retail & E-commerce",
    icon: StoreIcon,
    accent: "bg-growth-700 text-white",
    whatWeBuild: "Online store + inventory + payments",
    pain: "Selling through WhatsApp means counting stock by memory and chasing payments one by one.",
    outcome:
      "A real online store with live inventory, instant payments, and customers who reorder without messaging you.",
    features: ["Product catalog & cart", "Inventory tracking", "Mobile money + card payments"],
  },
  {
    name: "Service Providers",
    icon: WrenchIcon,
    accent: "bg-primary-900 text-gold",
    whatWeBuild: "Booking + CRM + automated follow-ups",
    pain: "Quotes go out, then silence. You never know which leads to chase or when.",
    outcome:
      "Every inquiry lands in your CRM, follow-ups send themselves, and no lead ever goes cold by accident.",
    features: ["Service booking & quotes", "Full client CRM", "Email & WhatsApp follow-up sequences"],
  },
];

export default function IndustriesPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="container-site max-w-3xl">
          <p className="animate-fade-in section-eyebrow !text-gold">Industries We Serve</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Built Around How Your Business Actually Works.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            A spa does not need what a restaurant needs. We build your system
            around your industry, your customers, and your daily reality.
          </p>
        </div>
      </section>

      {/* Industry cards */}
      <section aria-labelledby="industries-title" className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <h2 id="industries-title" className="sr-only">
            What we build for each industry
          </h2>
          <div className="space-y-8">
            {industries.map((industry, index) => (
              <RevealOnScroll key={industry.name} delay={index * 60}>
                <article className="grid gap-8 rounded-3xl border border-primary-50 bg-white p-8 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-10 lg:grid-cols-[1.1fr_1fr]">
                  <div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${industry.accent}`}
                      >
                        <industry.icon className="h-7 w-7" />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-primary">
                          {industry.name}
                        </h3>
                        <p className="mt-0.5 text-sm font-semibold text-growth">
                          {industry.whatWeBuild}
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 text-ink/80">
                      <span className="font-bold text-primary">The problem:</span>{" "}
                      {industry.pain}
                    </p>
                    <p className="mt-3 text-ink/80">
                      <span className="font-bold text-growth">With your system:</span>{" "}
                      {industry.outcome}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl bg-primary-50 p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Your System Includes
                    </p>
                    <ul className="mt-4 space-y-3">
                      {industry.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-sm font-medium text-ink"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-growth text-white">
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/start"
                      className="mt-6 text-sm font-bold text-primary underline-offset-4 hover:text-growth hover:underline"
                    >
                      Build this for my business &rarr;
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Every Business is Different. Let Us Build Yours."
        subtitle="Do not see your industry? That is exactly why we start every project with discovery. Tell us what you do — we will design the system around it."
      />
    </>
  );
}
