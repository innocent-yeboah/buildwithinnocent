import type { Metadata } from "next";
import ScrollStory from "@/components/ScrollStory";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    "Your business should work while you sleep. A digital system that brings you customers, bookings, and payments — automatically. 10+ qualified leads in 30 days, or we work for free until you get them.",
  alternates: { canonical: "/" },
};

/**
 * Homepage — cinematic scrollytelling driven by GSAP ScrollTrigger,
 * followed by social proof and a final CTA landing.
 */
export default function HomePage() {
  return (
    <>
      <ScrollStory />
      <Testimonials />
      <CtaBand
        title="You have been waiting for something to change."
        subtitle="What if today was the day you stopped working harder and started working smarter? Let us build a system that works for you. Not the other way around."
        buttonLabel="Tell Us About Your Project"
      />
    </>
  );
}
