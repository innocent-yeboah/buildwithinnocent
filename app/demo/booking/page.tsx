import type { Metadata } from "next";
import Link from "next/link";
import DemoBooking from "@/components/DemoBooking";

export const metadata: Metadata = {
  title: "Demo — The Booking Flow Your Customers Would Use",
  description:
    "Try a live simulation of the booking and payment experience we build: choose a service, pick a time, pay with mobile money.",
  alternates: { canonical: "/demo/booking" },
};

export default function DemoBookingPage() {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="section-eyebrow">Live Demo — Customer View</p>
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
            Book Like One of Your Customers.
          </h1>
          <p className="mt-3 text-ink/80">
            This is Serenity Demo Spa — a sample business running our system.
            Complete a booking and watch what the system does for the owner.
          </p>
        </div>
        <DemoBooking />
        <p className="mt-10 text-center text-sm text-ink/70">
          Prefer the owner&rsquo;s seat?{" "}
          <Link
            href="/demo/dashboard"
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            Open the admin dashboard demo &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
