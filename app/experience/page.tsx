import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "3D Experience — Digital Systems in Motion",
  description:
    "Explore an interactive Three.js scene: rotate and zoom a living model of connected digital business systems.",
  alternates: { canonical: "/experience" },
};

/** Client-only Three.js canvas (WebGL + OrbitControls). */
const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-primary-900 text-sm text-primary-100">
      Loading 3D experience…
    </div>
  ),
});

/**
 * Full-viewport Three.js experience with OrbitControls.
 * Header/footer remain available via the root layout.
 */
export default function ExperiencePage() {
  return (
    <section className="relative h-[calc(100svh-4.5rem)] min-h-[28rem] w-full overflow-hidden bg-primary-900">
      <ThreeCanvas className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-primary-900/80 to-transparent px-4 pb-16 pt-8">
        <div className="container-site pointer-events-auto max-w-2xl">
          <p className="section-eyebrow !text-gold">3D Experience</p>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Your system, connected in every direction.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-primary-100 sm:text-base">
            Drag to rotate. Scroll to zoom. This is a living picture of how
            your website, bookings, payments, and follow-ups work as one.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/start" className="btn-primary !px-5 !py-2.5 !text-sm">
              Start Your System <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/" className="btn-ghost-light !px-5 !py-2.5 !text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 text-center text-xs font-medium uppercase tracking-wider text-white/60">
        {site.name} · Interactive WebGL · Orbit Controls
      </p>
    </section>
  );
}
