import type { Metadata } from "next";
import Link from "next/link";
import DemoDashboard from "@/components/DemoDashboard";

export const metadata: Metadata = {
  title: "Demo — The Admin Dashboard You Would Run Your Business From",
  description:
    "Explore a live simulation of the owner's dashboard: bookings, revenue, leads, and the automations working in the background.",
  alternates: { canonical: "/demo/dashboard" },
};

export default function DemoDashboardPage() {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <div className="container-site max-w-5xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="section-eyebrow">Live Demo — Owner View</p>
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
            This Is Your Morning Coffee View.
          </h1>
          <p className="mt-3 text-ink/80">
            Everything that happened overnight — bookings, payments, leads,
            follow-ups — on one screen. Click through the tabs.
          </p>
        </div>
        <DemoDashboard />
        <p className="mt-10 text-center text-sm text-ink/70">
          Want to see what your customers experience?{" "}
          <Link
            href="/demo/booking"
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            Try the booking demo &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
