import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "You're In — Welcome to the Newsletter",
  description: "Welcome aboard. Your first issue is on its way.",
  robots: { index: false },
};

export default function NewsletterThankYouPage() {
  return (
    <section className="flex min-h-[70vh] items-center bg-primary-50 py-16">
      <div className="container-site max-w-xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-growth text-white">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-primary sm:text-4xl">
          You&rsquo;re in. Welcome.
        </h1>
        <p className="mt-4 text-lg text-ink/80">
          A welcome email is on its way to your inbox — if it plays
          hide-and-seek, check your spam folder and rescue it.
        </p>

        <div className="mt-10 rounded-3xl bg-white p-8 text-left shadow-card">
          <p className="text-sm font-bold uppercase tracking-widest text-growth">
            While you wait, two free things
          </p>
          <div className="mt-4 space-y-3">
            <Link
              href="/assessment"
              className="block rounded-xl border border-primary-50 p-4 transition-colors hover:border-growth hover:bg-growth-50"
            >
              <p className="font-bold text-primary">Get your Readiness Score</p>
              <p className="text-sm text-ink/70">
                8 questions, 2 minutes — see exactly where your business is
                losing customers.
              </p>
            </Link>
            <Link
              href="/demo"
              className="block rounded-xl border border-primary-50 p-4 transition-colors hover:border-growth hover:bg-growth-50"
            >
              <p className="font-bold text-primary">Try the live demo</p>
              <p className="text-sm text-ink/70">
                Click through the booking flow and dashboard we build for
                clients.
              </p>
            </Link>
          </div>
        </div>

        <Link href="/blog" className="mt-8 inline-block font-bold text-primary underline-offset-4 hover:text-growth hover:underline">
          Or start reading the blog &rarr;
        </Link>
      </div>
    </section>
  );
}
