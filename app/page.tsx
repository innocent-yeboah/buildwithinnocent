import type { Metadata } from "next";
import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import FounderPortrait from "@/components/FounderPortrait";
import { measuredPerformance, inspectableWork } from "@/lib/proof";
import { responseTimePhrase, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    "Innocent builds digital systems for owners of established African businesses. The published partnership is GHS 5,400. Book a strategy call.",
  alternates: { canonical: "/" },
};

const included = [
  "A website that asks for the booking, not just applause.",
  "Bookings and Mobile Money, so a sale does not depend on a reply.",
  "A record of every enquiry, and follow-up that sends itself.",
  "A year of hosting and support, already in the price.",
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="bg-primary text-white">
        <div className="container-site grid items-end gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              For owners of established businesses
            </p>
            <h1
              id="hero-title"
              className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.35rem]"
            >
              {site.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-100">
              You already have customers. What is missing is a calm way for
              them to find you, book, and pay when you are with a client, in
              a meeting, or asleep. Innocent builds that system with you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/strategy-call" className="btn-primary">
                Book a strategy call <span aria-hidden="true">&rarr;</span>
              </Link>
              {site.whatsappUrl ? (
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-light"
                >
                  WhatsApp Innocent
                </a>
              ) : (
                <Link href="/demo" className="btn-ghost-light">
                  See the system working
                </Link>
              )}
            </div>
            <p className="mt-5 text-sm text-primary-100">
              Prefer to write it down?{" "}
              <Link href="/start" className="font-semibold text-white underline-offset-4 hover:underline">
                Send a short note
              </Link>
              .
            </p>
          </div>

          <aside className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              The published partnership
            </p>
            <p className="mt-3 font-display text-4xl text-white">{site.offer.total}</p>
            <p className="mt-3 text-sm leading-relaxed text-primary-100">
              {site.offer.split}. Or {site.offer.monthly}.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-primary-100">
              That is the price for the complete system. A larger build is
              scoped on the call, and the number is agreed in writing before
              work starts.
            </p>
            <p className="mt-5 border-t border-white/10 pt-5 text-sm text-gold">
              {site.promise}
            </p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="fit-title" className="bg-white py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="section-eyebrow">Who this is for</p>
            <h2 id="fit-title" className="section-title">
              A business that already works, and a system that should too.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-primary-100 bg-primary-100 sm:grid-cols-3">
            {[
              {
                label: "You",
                text: "An owner in Ghana or elsewhere in Africa, with customers, staff, and a name people already know.",
              },
              {
                label: "The outcome",
                text: "A visitor can understand the offer, book, and pay without you chasing the message.",
              },
              {
                label: "The next step",
                text: "One strategy call. A clear recommendation. A price before anyone starts building.",
              },
            ].map((item) => (
              <div key={item.label} className="bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-growth">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="included-title" className="bg-primary-50 py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow">What you commission</p>
            <h2 id="included-title" className="section-title">
              One partnership. The pieces that earn their place.
            </h2>
            <p className="mt-5 max-w-lg text-ink/75">
              Not a stack of tools you have to wire together. Innocent
              designs and builds the system around how the business already
              takes an order.
            </p>
            <Link
              href="/what-we-build"
              className="mt-6 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              See the full list
            </Link>
          </div>
          <ul className="space-y-3">
            {included.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white bg-white px-5 py-4 text-[15px] leading-relaxed text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="inspect-title" className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <p className="section-eyebrow">Proof you can open</p>
          <h2 id="inspect-title" className="section-title max-w-2xl">
            Judge the craft before you judge a claim.
          </h2>
          <p className="mt-4 max-w-2xl text-ink/75">
            Client results are published only with a name and numbers the
            client has confirmed. Until then, the honest proof is the work
            running on this site.
          </p>
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {inspectableWork.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-3xl border border-primary-100 p-6 transition-colors hover:border-primary"
                >
                  <h3 className="font-display text-xl text-primary">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{item.body}</p>
                  <span className="mt-5 text-sm font-semibold text-primary">Open it</span>
                </Link>
              </li>
            ))}
          </ul>
          {measuredPerformance && (
            <div className="mt-8 rounded-3xl border border-primary-100 bg-primary-50 p-6">
              <p className="text-sm font-semibold text-primary">
                Measured with {measuredPerformance.tool} on {measuredPerformance.measuredOn}
              </p>
              <p className="mt-1 text-xs text-ink/60">{measuredPerformance.notes}</p>
              <dl className="mt-4 flex flex-wrap gap-6">
                {measuredPerformance.scores.map((score) => (
                  <div key={score.label}>
                    <dt className="text-xs uppercase tracking-wider text-ink/60">{score.label}</dt>
                    <dd className="font-display text-2xl text-primary">{score.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      <section aria-labelledby="founder-title" className="bg-primary-50 py-16 sm:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <FounderPortrait />
          <div>
            <p className="section-eyebrow">The person you hire</p>
            <h2 id="founder-title" className="section-title">
              You work with Innocent. Not a desk between you and the build.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">
              The call, the scope, the build, and the year after launch sit
              with the same person. If that is the arrangement you want, the
              about page is the longer version.
            </p>
            <Link href="/about" className="btn-secondary mt-8">
              About Innocent
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="If the business is ready, book the call."
        subtitle={`Tell Innocent who the customers are and what should happen without you in the thread. He replies ${responseTimePhrase}.`}
      />
    </>
  );
}
