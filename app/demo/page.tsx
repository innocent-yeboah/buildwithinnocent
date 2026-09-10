import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import CtaBand from "@/components/CtaBand";
import { DashboardIcon, ClockIcon, CardIcon, ChartIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Live Demo — Try the System Before You Buy It",
  description:
    "Play with a real booking flow your customers would use, and the admin dashboard you would manage it from. No signup required.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <section className="bg-primary py-16 sm:py-24">
        <div className="container-site max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">Live Demo</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Don&rsquo;t Take Our Word for It. Click Around.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            This is a working sandbox of the system we build — the booking
            flow your customers would see, and the dashboard you would run
            your business from. No signup, nothing to install.
          </p>
        </div>
      </section>

      <section aria-label="Choose a demo" className="bg-white py-20 sm:py-24">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <RevealOnScroll>
            <Link
              href="/demo/booking"
              className="group block h-full rounded-3xl border border-primary-50 bg-white p-10 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-growth text-white">
                <ClockIcon className="h-8 w-8" />
              </span>
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-growth">
                What your customers see
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary">
                The Booking Experience
              </h2>
              <p className="mt-3 leading-relaxed text-ink/80">
                Book a spa appointment the way your customers would — pick a
                service, choose a time, and pay with mobile money. Notice how
                nothing requires a human on the other end.
              </p>
              <p className="mt-6 font-bold text-primary group-hover:text-growth">
                Try booking &rarr;
              </p>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <Link
              href="/demo/dashboard"
              className="group block h-full rounded-3xl border border-primary-50 bg-white p-10 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-gold">
                <DashboardIcon className="h-8 w-8" />
              </span>
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-growth">
                What you see
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary">
                The Admin Dashboard
              </h2>
              <p className="mt-3 leading-relaxed text-ink/80">
                Step into the owner&rsquo;s seat: today&rsquo;s bookings,
                revenue, leads waiting for follow-up, and the automations
                doing the work — all on one screen.
              </p>
              <p className="mt-6 font-bold text-primary group-hover:text-growth">
                Open the dashboard &rarr;
              </p>
            </Link>
          </RevealOnScroll>
        </div>

        <div className="container-site mt-14">
          <RevealOnScroll>
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-4">
                <CardIcon className="h-6 w-6 shrink-0 text-growth" />
                <p className="text-sm font-medium text-primary">
                  The payment step is simulated — no real money moves.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-4">
                <ChartIcon className="h-6 w-6 shrink-0 text-growth" />
                <p className="text-sm font-medium text-primary">
                  Your real system is customized to your business, not a spa.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CtaBand
        title="Imagine This Running Your Business."
        subtitle="Everything you just clicked is included in the partnership. Tell us about your project and we will build yours in 5 weeks."
      />
    </>
  );
}
