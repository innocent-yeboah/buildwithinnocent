"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGsap } from "@/lib/gsap";
import HeroMarketingScreen from "@/components/HeroMarketingScreen";
import { site } from "@/lib/site";
import {
  GlobeIcon,
  DashboardIcon,
  CardIcon,
  DatabaseIcon,
  RepeatIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  CheckIcon,
  SparkIcon,
} from "@/components/Icons";

const overnightEvents = [
  { time: "11:42 PM", event: "Someone booked a service while you were asleep." },
  { time: "1:07 AM", event: "A payment came through." },
  { time: "3:15 AM", event: "A lead was captured." },
  { time: "7:00 AM", event: "Follow-ups were already sent." },
];

const deliverables = [
  { label: "A professional website that looks like you.", icon: GlobeIcon },
  { label: "A booking system that works 24/7.", icon: DashboardIcon },
  { label: "A payment system that collects money automatically.", icon: CardIcon },
  { label: "A CRM that tracks every customer.", icon: DatabaseIcon },
  { label: "A system that follows up for you.", icon: RepeatIcon },
  { label: "Support for your first year.", icon: HeadsetIcon },
];

/**
 * Cinematic homepage scrollytelling.
 * Each panel is pinned; GSAP ScrollTrigger timelines scrub strictly
 * against scroll position (not wall-clock timers).
 */
export default function ScrollStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      // Global scroll progress bar
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      }

      // ------- Panel 1: Opening -------
      const panel1 = root.querySelector<HTMLElement>("[data-panel='opening']");
      if (panel1) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel1,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          panel1.querySelectorAll("[data-anim='open-copy']"),
          { y: 64, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, ease: "none" },
          0,
        )
          .fromTo(
            panel1.querySelector("[data-anim='open-image']"),
            { scale: 1.25, opacity: 0.35 },
            { scale: 1, opacity: 1, ease: "none" },
            0,
          )
          .fromTo(
            panel1.querySelector("[data-anim='open-screen']"),
            { y: 80, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, ease: "none" },
            0.15,
          )
          .to(panel1.querySelectorAll("[data-anim='open-copy']"), {
            y: -40,
            opacity: 0.35,
            ease: "none",
          });
      }

      // ------- Panel 2: Overnight -------
      const panel2 = root.querySelector<HTMLElement>("[data-panel='overnight']");
      if (panel2) {
        const cards = panel2.querySelectorAll("[data-anim='night-card']");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel2,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          panel2.querySelector("[data-anim='night-title']"),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0,
        )
          .fromTo(
            cards,
            { x: 80, opacity: 0, scale: 0.94 },
            { x: 0, opacity: 1, scale: 1, stagger: 0.15, ease: "none" },
            0.1,
          )
          .fromTo(
            panel2.querySelector("[data-anim='night-punch']"),
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, ease: "none" },
            0.55,
          );
      }

      // ------- Panel 3: Desire -------
      const panel3 = root.querySelector<HTMLElement>("[data-panel='desire']");
      if (panel3) {
        const blocks = panel3.querySelectorAll("[data-anim='desire-block']");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel3,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          panel3.querySelector("[data-anim='desire-title']"),
          { scale: 0.88, opacity: 0 },
          { scale: 1, opacity: 1, ease: "none" },
          0,
        )
          .fromTo(
            blocks,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.18, ease: "none" },
            0.15,
          )
          .fromTo(
            panel3.querySelector("[data-anim='desire-cta']"),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: "none" },
            0.55,
          );
      }

      // ------- Panel 4: What you get -------
      const panel4 = root.querySelector<HTMLElement>("[data-panel='system']");
      if (panel4) {
        const items = panel4.querySelectorAll("[data-anim='system-item']");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel4,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          panel4.querySelector("[data-anim='system-title']"),
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, ease: "none" },
          0,
        )
          .fromTo(
            items,
            { x: (i) => (i % 2 === 0 ? -70 : 70), opacity: 0, scale: 0.96 },
            { x: 0, opacity: 1, scale: 1, stagger: 0.1, ease: "none" },
            0.12,
          )
          .fromTo(
            panel4.querySelector("[data-anim='system-price']"),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: "none" },
            0.6,
          );
      }

      // ------- Panel 5: Proof / screen -------
      const panel5 = root.querySelector<HTMLElement>("[data-panel='proof']");
      if (panel5) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel5,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          panel5.querySelector("[data-anim='proof-title']"),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0,
        )
          .fromTo(
            panel5.querySelector("[data-anim='proof-screen']"),
            { scale: 0.75, opacity: 0, rotate: -4 },
            { scale: 1, opacity: 1, rotate: 0, ease: "none" },
            0.1,
          )
          .fromTo(
            panel5.querySelectorAll("[data-anim='proof-quote']"),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, ease: "none" },
            0.35,
          );
      }

      // ------- Panel 6: Closing -------
      const panel6 = root.querySelector<HTMLElement>("[data-panel='close']");
      if (panel6) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel6,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          panel6.querySelector("[data-anim='close-title']"),
          { scale: 1.12, opacity: 0 },
          { scale: 1, opacity: 1, ease: "none" },
          0,
        )
          .fromTo(
            panel6.querySelector("[data-anim='close-body']"),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: "none" },
            0.2,
          )
          .fromTo(
            panel6.querySelector("[data-anim='close-cta']"),
            { y: 30, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, ease: "none" },
            0.4,
          );
      }

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* Scroll progress — driven by ScrollTrigger scrub */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] h-1 w-full origin-left scale-x-0 bg-gold"
        ref={progressRef}
      />

      {/* ========== 1. OPENING ========== */}
      <section
        data-panel="opening"
        aria-labelledby="hero-title"
        className="relative flex min-h-[100svh] items-center overflow-hidden"
      >
        <div data-anim="open-image" className="absolute inset-0">
          <Image
            src="/images/hero-team.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary-900/90" />
        </div>

        <div className="container-site relative z-10 grid w-full items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p
              data-anim="open-copy"
              className="font-display text-2xl font-bold text-gold sm:text-3xl"
            >
              Build With Innocent
            </p>
            <p
              data-anim="open-copy"
              className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90"
            >
              {site.tagline}
            </p>
            <h1
              id="hero-title"
              data-anim="open-copy"
              className="mt-7 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]"
            >
              Your business should work{" "}
              <span className="text-gold">while you sleep.</span>
            </h1>
            <p
              data-anim="open-copy"
              className="mx-auto mt-6 max-w-xl text-lg text-white/95 lg:mx-0 sm:text-xl"
            >
              A digital system that brings you customers, bookings, and
              payments — automatically. No more late nights. No more manual
              work. Just results.
            </p>
            <div
              data-anim="open-copy"
              className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link href="/start" className="btn-primary text-lg">
                Start Your System <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/how-it-works" className="btn-ghost-light">
                See How It Works
              </Link>
            </div>
            <p
              data-anim="open-copy"
              className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-gold lg:justify-start"
            >
              <ShieldCheckIcon className="h-5 w-5 shrink-0" />
              {site.promise}
            </p>
          </div>

          <div data-anim="open-screen" className="mx-auto hidden lg:block">
            <HeroMarketingScreen />
          </div>
        </div>
      </section>

      {/* ========== 2. OVERNIGHT ========== */}
      <section
        data-panel="overnight"
        aria-labelledby="overnight-title"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary-900"
      >
        <div className="container-site grid w-full items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow !text-gold">While You Rest</p>
            <h2
              id="overnight-title"
              data-anim="night-title"
              className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              Imagine waking up to customers you did not chase.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-primary-100">
              You did not send a single message. You did not make a single
              call. You did not chase anyone. Your business worked for you.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md space-y-3.5">
            {overnightEvents.map((item) => (
              <div
                key={item.time}
                data-anim="night-card"
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/10 p-3.5"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-growth text-white">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-gold">
                    {item.time}
                  </span>
                  <span className="block text-sm text-white">{item.event}</span>
                </span>
              </div>
            ))}
            <p
              data-anim="night-punch"
              className="rounded-xl bg-gold px-4 py-3 text-center text-sm font-bold text-primary-900"
            >
              You were asleep. Your business was not.
            </p>
          </div>
        </div>
      </section>

      {/* ========== 3. DESIRE ========== */}
      <section
        data-panel="desire"
        aria-labelledby="desire-title"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-white/90"
      >
        <div className="container-site mx-auto max-w-3xl py-20 text-center">
          <h2
            id="desire-title"
            data-anim="desire-title"
            className="section-title"
          >
            This is what you have been looking for.
          </h2>
          <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/80 sm:text-xl">
            <p data-anim="desire-block">
              You have been running your business manually for too long.
              Answering the same DMs. Sending the same prices. Chasing the same
              payments.
            </p>
            <p data-anim="desire-block">
              You know there is a better way. You have just not found it yet.
            </p>
            <p
              data-anim="desire-block"
              className="font-semibold text-primary"
            >
              This is it. A complete digital system that brings you customers
              while you sleep.
            </p>
          </div>
          <div data-anim="desire-cta" className="mt-10">
            <Link href="/how-it-works" className="btn-primary">
              See How It Works <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 4. SYSTEM ========== */}
      <section
        data-panel="system"
        aria-labelledby="system-title"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary-50/90"
      >
        <div className="container-site w-full py-20">
          <h2
            id="system-title"
            data-anim="system-title"
            className="mx-auto max-w-2xl text-center section-title"
          >
            Everything you need to run your business online.
          </h2>
          <ul className="mx-auto mt-12 max-w-2xl space-y-4">
            {deliverables.map((item) => (
              <li
                key={item.label}
                data-anim="system-item"
                className="flex items-center gap-4 rounded-2xl bg-white/95 px-5 py-4 shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-gold">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-base font-medium text-primary sm:text-lg">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <div data-anim="system-price" className="mt-10 text-center">
            <p className="text-lg font-semibold text-growth">
              All in one partnership.
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">
              {site.offer.total} total
            </p>
            <p className="mt-1 text-sm text-ink/70">
              {site.offer.split} — or {site.offer.monthly}.
            </p>
            <Link
              href="/what-we-build"
              className="mt-4 inline-block text-sm font-bold text-primary underline-offset-4 hover:text-growth hover:underline"
            >
              See everything included &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 5. PROOF ========== */}
      <section
        data-panel="proof"
        aria-labelledby="proof-title"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary"
      >
        <div
          aria-hidden="true"
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
        />
        <div className="container-site relative z-10 grid w-full items-center gap-12 py-20 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="section-eyebrow !text-gold">
              <SparkIcon className="mr-2 inline h-4 w-4" />
              Proof
            </p>
            <h2
              id="proof-title"
              data-anim="proof-title"
              className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              Real business owners. Real results.
            </h2>
            <blockquote
              data-anim="proof-quote"
              className="mt-8 border-l-4 border-gold pl-5 text-left"
            >
              <p className="font-display text-xl italic text-white">
                &ldquo;I went from 0 inquiries to 5 per week in the first
                month. The system works.&rdquo;
              </p>
              <footer className="mt-3 text-sm font-semibold text-gold">
                — Mr. Ebenezer, Benizer Green Shop
              </footer>
            </blockquote>
            <blockquote
              data-anim="proof-quote"
              className="mt-6 border-l-4 border-gold pl-5 text-left"
            >
              <p className="font-display text-xl italic text-white">
                &ldquo;I stopped answering DMs all day. Now I just wake up to
                orders.&rdquo;
              </p>
              <footer className="mt-3 text-sm font-semibold text-gold">
                — Mr. Stanley, Perfume Business
              </footer>
            </blockquote>
          </div>
          <div data-anim="proof-screen" className="mx-auto">
            <HeroMarketingScreen />
          </div>
        </div>
      </section>

      {/* ========== 6. CLOSE ========== */}
      <section
        data-panel="close"
        aria-labelledby="close-title"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary-900"
      >
        <div
          aria-hidden="true"
          className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-growth/20 blur-3xl"
        />
        <div className="container-site relative z-10 max-w-3xl py-20 text-center">
          <h2
            id="close-title"
            data-anim="close-title"
            className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            You have been waiting for something to change.
          </h2>
          <p
            data-anim="close-body"
            className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl"
          >
            What if today was the day you stopped working harder and started
            working smarter? Let us build a system that works for you. Not the
            other way around.
          </p>
          <div data-anim="close-cta" className="mt-10">
            <Link href="/start" className="btn-primary text-lg">
              Tell Us About Your Project <span aria-hidden="true">&rarr;</span>
            </Link>
            <p className="mt-6 text-sm font-medium text-gold">{site.promise}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
