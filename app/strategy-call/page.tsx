import type { Metadata } from "next";
import Link from "next/link";
import StrategyCallForm from "@/components/StrategyCallForm";
import { responseTimePhrase, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Strategy Call",
  description:
    "Book a strategy call with Innocent. Optional budget and timeline. The published partnership is GHS 5,400, with scope, deliverables, and a five-week path explained.",
  alternates: { canonical: "/strategy-call" },
};

const weeks = [
  {
    when: "The call",
    title: "A recommendation, not a pitch",
    text: "Who the customer is, what they do today, and whether a system is the right spend. If it is not, Innocent says so.",
  },
  {
    when: "Week 1",
    title: "Discovery, written down",
    text: "The offer, the customers, and the current way enquiries arrive. You leave with a scope and a price before design starts.",
  },
  {
    when: "Weeks 2–4",
    title: "Build, then your review",
    text: "Website, booking, payments, and follow-up, connected. You review it with your own content and ask for the changes that matter.",
  },
  {
    when: "Week 5, then a year",
    title: "Launch and the included support",
    text: "The system goes on your domain. You are shown how to run it. Hosting and support for the first year are part of the partnership.",
  },
];

const deliverables = [
  "A website with one job: turn a visitor into an enquiry or a booking.",
  "Booking that does not wait for someone to be free.",
  "Mobile Money and card payments on the site.",
  "A record of every customer and enquiry.",
  "Follow-up that sends without you writing it each time.",
  "Domain, hosting, and support for the first year.",
];

export default function StrategyCallPage() {
  return (
    <>
      <section className="border-b border-primary-100 bg-white">
        <div className="container-site grid gap-10 py-12 lg:grid-cols-2 lg:items-start lg:py-16">
          <div>
            <p className="section-eyebrow">Strategy call</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] text-primary sm:text-5xl">
              Book a strategy call with Innocent.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">
              One conversation about the business you already run. You leave
              with a recommendation: build, wait, or do something smaller —
              and, if you build, a price agreed before the work.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-primary-50 p-4">
                <dt className="text-xs uppercase tracking-wider text-ink/50">From</dt>
                <dd className="mt-1 font-display text-lg text-primary">{site.offer.total}</dd>
              </div>
              <div className="rounded-2xl bg-primary-50 p-4">
                <dt className="text-xs uppercase tracking-wider text-ink/50">Or</dt>
                <dd className="mt-1 font-display text-lg text-primary">GHS 1,000</dd>
              </div>
              <div className="rounded-2xl bg-primary-50 p-4">
                <dt className="text-xs uppercase tracking-wider text-ink/50">Reply</dt>
                <dd className="mt-1 font-display text-lg leading-tight text-primary">1–2 days</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              {site.offer.split}. The monthly alternative is {site.offer.monthly}.
              Larger work is quoted separately, in writing.
            </p>
            {site.whatsappUrl && (
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-6"
              >
                Or WhatsApp Innocent
              </a>
            )}
            <p className="mt-4 text-sm text-ink/70">
              A lighter path, if you would rather not book a call yet:{" "}
              <Link href="/start" className="font-semibold text-primary underline-offset-4 hover:underline">
                send a short note
              </Link>
              . Same reply window — {responseTimePhrase}.
            </p>
          </div>
          <StrategyCallForm />
        </div>
      </section>

      <section aria-labelledby="together-title" className="bg-primary-50 py-16 sm:py-24">
        <div className="container-site">
          <p className="section-eyebrow">Working together</p>
          <h2 id="together-title" className="section-title max-w-2xl">
            What the weeks look like after you say yes.
          </h2>
          <ol className="mt-12 grid gap-4 lg:grid-cols-4">
            {weeks.map((week) => (
              <li key={week.title} className="rounded-3xl bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-growth">{week.when}</p>
                <h3 className="mt-3 font-display text-xl text-primary">{week.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{week.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-ink/60">
            A longer walk through the same five weeks is on{" "}
            <Link href="/how-it-works" className="font-semibold text-primary underline-offset-4 hover:underline">
              the process page
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="deliverables-title" className="bg-white py-16 sm:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-eyebrow">Deliverables</p>
            <h2 id="deliverables-title" className="font-display text-3xl text-primary sm:text-4xl">
              What the {site.offer.total} partnership includes.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              Module prices in the calculator are for choosing a smaller
              starting point. They are not a second price for this list. The
              complete partnership remains {site.offer.total}.
            </p>
            <Link href="/calculator" className="mt-5 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Open the calculator
            </Link>
          </div>
          <ul className="divide-y divide-primary-100 border-y border-primary-100">
            {deliverables.map((item) => (
              <li key={item} className="py-4 text-[15px] leading-relaxed text-ink/85">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
