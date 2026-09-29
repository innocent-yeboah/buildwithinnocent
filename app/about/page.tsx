import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import CtaBand from "@/components/CtaBand";
import FounderPortrait from "@/components/FounderPortrait";
import { responseTimePhrase, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Innocent",
  description:
    "Innocent builds digital systems with owners of established African businesses. How he works, what the partnership includes, and how to book a strategy call.",
  path: "/about",
});

const approach = [
  {
    title: "You speak with the person who builds it",
    text: "There is no account manager translating your business into a brief. The strategy call, the scope, and the build are with Innocent.",
  },
  {
    title: "The price is written down first",
    text: `The published partnership is ${site.offer.total} — ${site.offer.split.toLowerCase()} — or ${site.offer.monthly}. A larger system is priced in writing before work starts.`,
  },
  {
    title: "You see it with your own content",
    text: "Before anything goes live, you review the pages and the flows with the words and prices your customers will actually see.",
  },
  {
    title: "The first year stays included",
    text: "Hosting and support for the first year are part of the partnership, not a surprise invoice after launch.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-site grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.7fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">About</p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">
              Innocent builds this with you.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-100">
              I work with owners of established businesses — people who
              already have customers, staff, and a reputation — when a
              brochure site or a busy WhatsApp thread is no longer how the
              business should run.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-100">
              The work is a system: a site that converts, bookings, Mobile
              Money, and follow-up. I build it with you, and I stay for the
              first year.
            </p>
            <Link href="/strategy-call" className="btn-primary mt-8">
              Book a strategy call <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <FounderPortrait
            priority
            sizes="(min-width: 1024px) 480px, calc(100vw - 2rem)"
          />
        </div>
      </section>

      <section aria-labelledby="story-title" className="bg-white py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="story-title" className="font-display text-3xl text-primary sm:text-4xl">
            The short story.
          </h2>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink/85">
            <p>
              I drove Uber and taught myself to code between rides. The stack
              I still use is the one I learned then: Next.js, TypeScript,
              databases, payments, automation.
            </p>
            <p>
              I was not looking for another thing to sell. I kept seeing
              businesses with real skill and real customers, and no reliable
              way for a new customer to book or pay. Talent was not the gap.
              The system was.
            </p>
            <p>
              So the practice is narrow on purpose. I build that system, I
              use the same kind of system to run this practice, and I do the
              work with the owner rather than handing it to a team the owner
              never meets.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="bg-primary-50 py-16 sm:py-24">
        <div className="container-site">
          <p className="section-eyebrow">How the work feels</p>
          <h2 id="approach-title" className="section-title max-w-2xl">
            A direct engagement, with the commercial terms in the open.
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {approach.map((item, index) => (
              <li key={item.title} className="rounded-3xl bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-growth">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-xl text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-ink/70">
            The process, the weeks, and the call itself are on{" "}
            <Link href="/strategy-call" className="font-semibold text-primary underline-offset-4 hover:underline">
              Working together
            </Link>
            . A reply takes {responseTimePhrase}.
          </p>
        </div>
      </section>

      <CtaBand
        title="If this is the person you want to build with, start with the call."
        subtitle="Bring the business as it is. Leave with a recommendation and a number, or a clear no."
      />
    </>
  );
}
