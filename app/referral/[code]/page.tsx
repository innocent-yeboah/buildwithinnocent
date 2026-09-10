import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import ReferralTracker from "@/components/ReferralTracker";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  ShieldCheckIcon,
  GlobeIcon,
  MagnetIcon,
  RepeatIcon,
  CheckIcon,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

type PageProps = { params: { code: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: "You Were Recommended — Digital Business Systems",
    description:
      "Someone who knows your business thought of us. See what a complete digital business system could do for you — 10+ leads in 30 days or we work for free.",
    robots: { index: false },
    alternates: { canonical: `/referral/${params.code}` },
  };
}

/** Fetches the referrer's first name and counts the click, best effort. */
async function getReferrerName(code: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data } = await supabase
      .from("referrals")
      .select("referrer_name")
      .eq("code", code)
      .maybeSingle();

    if (!data) return null;

    // Fire-and-forget click counter; a failure here is invisible.
    void supabase.rpc("increment_referral_clicks", { ref_code: code });

    return (data.referrer_name as string).split(" ")[0];
  } catch {
    return null;
  }
}

export default async function ReferralLandingPage({ params }: PageProps) {
  const code = params.code.slice(0, 40);
  const referrerName = await getReferrerName(code);

  return (
    <>
      <ReferralTracker code={code} />

      <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-growth/20 blur-3xl"
        />
        <div className="container-site relative max-w-3xl text-center">
          <p className="animate-fade-in inline-block rounded-full border border-gold/40 bg-gold/10 px-5 py-1.5 text-sm font-semibold text-gold">
            {referrerName
              ? `${referrerName} thought your business should see this`
              : "Someone who knows your business sent you here"}
          </p>
          <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            A Complete Digital Business System — Recommended to You Personally.
          </h1>
          <p
            className="animate-fade-up mt-6 text-lg leading-relaxed text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            We build websites, booking, payments, CRM, and automated
            follow-up as one system that brings you customers while you
            sleep. And because you came recommended, you already know we
            deliver.
          </p>
          <div className="animate-fade-up mt-9" style={{ animationDelay: "300ms" }}>
            <Link href="/start" className="btn-primary text-lg">
              Tell Us About Your Project <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <p
            className="animate-fade-up mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gold"
            style={{ animationDelay: "400ms" }}
          >
            <ShieldCheckIcon className="h-5 w-5" />
            10+ leads in 30 days or we work for free.
          </p>
        </div>
      </section>

      <section aria-label="What you get" className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GlobeIcon,
                title: "One complete system",
                text: "Website, booking, payments, CRM, email — built and connected for you.",
              },
              {
                icon: MagnetIcon,
                title: "Leads on autopilot",
                text: "Interested people are captured and followed up automatically.",
              },
              {
                icon: RepeatIcon,
                title: "A partner for 1 year",
                text: "Hosting, support, and optimization included for 12 months.",
              },
            ].map((item, index) => (
              <RevealOnScroll key={item.title} delay={index * 100}>
                <div className="h-full rounded-2xl border border-primary-50 p-7 text-center shadow-card">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-gold">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 font-display text-lg font-bold text-primary">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink/80">{item.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={150}>
            <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-primary-50 p-8 text-center">
              <p className="font-display text-xl font-bold text-primary">
                Not sure where your business stands?
              </p>
              <p className="mt-2 text-sm text-ink/80">
                Take the free 2-minute assessment and get your Digital
                Business Readiness Score first.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/assessment" className="btn-secondary !px-6 !py-3 !text-sm">
                  Get My Free Score
                </Link>
                <Link href="/demo" className="btn-secondary !px-6 !py-3 !text-sm">
                  Try the Live Demo
                </Link>
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/60">
                <CheckIcon className="h-4 w-4 text-growth" />
                Your recommendation from {referrerName ?? "your friend"} is
                already linked — nothing extra to do.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
