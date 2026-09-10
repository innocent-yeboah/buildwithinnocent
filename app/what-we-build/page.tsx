import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";
import {
  GlobeIcon,
  DashboardIcon,
  CardIcon,
  DatabaseIcon,
  ShareIcon,
  MailIcon,
  ServerIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  MagnetIcon,
  RepeatIcon,
  ChatIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "What We Build — The Complete Digital Business System",
  description:
    "Professional website, admin dashboard, payments, CRM, social integration, automated email, and a full year of hosting and support. One partnership, everything included.",
  alternates: { canonical: "/what-we-build" },
};

const deliverables = [
  {
    title: "Professional Website",
    description:
      "A conversion-focused website designed to turn visitors into leads — not just look pretty. Every page has one job: move people toward becoming your customer.",
    icon: GlobeIcon,
  },
  {
    title: "Admin Dashboard",
    description:
      "One simple screen to manage everything — bookings, orders, clients, and content. If you can use WhatsApp, you can run your dashboard.",
    icon: DashboardIcon,
  },
  {
    title: "Payment System",
    description:
      "Accept mobile money and card payments directly on your website. Your customers pay the way they already pay — no friction, no lost sales.",
    icon: CardIcon,
  },
  {
    title: "CRM Database",
    description:
      "Every client, every inquiry, every conversation — tracked in one place. Know who your customers are, what they bought, and when to follow up.",
    icon: DatabaseIcon,
  },
  {
    title: "Social Media Integration",
    description:
      "Your website, Instagram, Facebook, and WhatsApp connected into one flow. A DM becomes a lead. A lead becomes a booking. Automatically.",
    icon: ShareIcon,
  },
  {
    title: "Automated Email System",
    description:
      "Follow-ups, confirmations, reminders, and newsletters that send themselves. Your leads hear from you consistently — without you lifting a finger.",
    icon: MailIcon,
  },
  {
    title: "1 Year Domain & Hosting — Free",
    description:
      "Your domain name and fast, secure hosting are covered for the first year. No surprise bills, no technical headaches.",
    icon: ServerIcon,
  },
  {
    title: "1 Year System Management & Support",
    description:
      "We monitor, update, and optimize your system for a full year. Something breaks at midnight? That is our problem, not yours.",
    icon: HeadsetIcon,
  },
];

/** Nodes in the architecture diagram, grouped by system stage. */
const architectureStages = [
  {
    stage: "Attract",
    color: "border-growth bg-growth-50 text-growth-700",
    nodes: ["Social Media", "Google Search", "WhatsApp"],
  },
  {
    stage: "Convert",
    color: "border-primary bg-primary-50 text-primary",
    nodes: ["Your Website", "Booking System", "Payments"],
  },
  {
    stage: "Grow",
    color: "border-gold-600 bg-gold-50 text-gold-800",
    nodes: ["CRM Database", "Email Automation", "Admin Dashboard"],
  },
];

export default function WhatWeBuildPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="container-site max-w-3xl">
          <p className="animate-fade-in section-eyebrow !text-gold">What We Build</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Not a Website. A Complete Digital Business System.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            A website alone does not bring customers. A system does. Here is
            everything included in the partnership — built, connected, and
            managed for you.
          </p>
        </div>
      </section>

      {/* Deliverables grid */}
      <section aria-labelledby="deliverables-title" className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <h2 id="deliverables-title" className="section-title">
              Everything Included. Nothing Extra to Buy.
            </h2>
            <p className="mt-4 text-lg text-ink/80">
              {site.offer.total} total — {site.offer.split}.
            </p>
            <p className="mt-2 text-base font-medium text-growth">
              Or {site.offer.monthly}.
            </p>
          </RevealOnScroll>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((item, index) => (
              <RevealOnScroll key={item.title} delay={(index % 4) * 100}>
                <article className="h-full rounded-2xl border border-primary-50 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-gold">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">
                    {item.description}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture diagram */}
      <section aria-labelledby="architecture-title" className="bg-primary-50 py-20 sm:py-28">
        <div className="container-site">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">How the Pieces Connect</p>
            <h2 id="architecture-title" className="section-title">
              One System. Every Piece Talking to Each Other.
            </h2>
            <p className="mt-4 text-lg text-ink/80">
              A customer finds you, books you, pays you, and hears from you
              again — without a single manual step in between.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
              {architectureStages.map((stage, index) => (
                <div key={stage.stage} className="contents">
                  <div className="rounded-2xl bg-white p-6 shadow-card">
                    <p
                      className={`inline-block rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-widest ${stage.color}`}
                    >
                      {index + 1}. {stage.stage}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {stage.nodes.map((node) => (
                        <li
                          key={node}
                          className="rounded-xl border border-primary-50 bg-primary-50/50 px-4 py-3 text-center text-sm font-semibold text-primary"
                        >
                          {node}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < architectureStages.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="flex items-center justify-center text-3xl font-bold text-gold"
                    >
                      <span className="rotate-90 lg:rotate-0">&rarr;</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={250}>
            <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-4 rounded-2xl bg-primary p-6 text-center">
              <RepeatIcon className="h-8 w-8 shrink-0 text-gold" />
              <p className="text-sm font-medium leading-relaxed text-white sm:text-base">
                Then the loop restarts: every customer is followed up
                automatically, so one sale becomes repeat business.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* The guarantee */}
      <section aria-labelledby="guarantee-title" className="bg-white py-20 sm:py-28">
        <div className="container-site">
          <RevealOnScroll>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-gold bg-primary p-10 text-center sm:p-14">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-2xl"
              />
              <ShieldCheckIcon className="mx-auto h-14 w-14 text-gold" />
              <h2
                id="guarantee-title"
                className="mt-6 font-display text-2xl font-bold text-white sm:text-4xl"
              >
                &ldquo;10+ qualified leads in 30 days or we work for free
                until we deliver.&rdquo;
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-primary-100">
                We can make this promise because we use this exact system to
                run our own business. If it does not perform, the risk is
                ours — not yours.
              </p>
              <Link href="/start" className="btn-primary mt-8">
                Start Your System <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>

          {/* Supporting micro-trust row */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              { icon: MagnetIcon, label: "Leads captured automatically" },
              { icon: ChatIcon, label: "Follow-up runs on autopilot" },
              { icon: HeadsetIcon, label: "We stay with you for 1 year" },
            ].map((item, index) => (
              <RevealOnScroll key={item.label} delay={index * 100}>
                <div className="flex items-center gap-3 rounded-xl border border-primary-50 p-4">
                  <item.icon className="h-6 w-6 shrink-0 text-growth" />
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Your Complete System Starts With One Conversation."
        subtitle="Tell us about your project and get a tailored proposal within 24-48 hours."
      />
    </>
  );
}
