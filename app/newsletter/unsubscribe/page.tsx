import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter Unsubscribe",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: { status?: string };
};

/**
 * Confirmation page after one-click unsubscribe.
 */
export default function NewsletterUnsubscribePage({ searchParams }: Props) {
  const ok = searchParams.status === "ok";

  return (
    <section className="bg-primary-50 py-20 sm:py-28">
      <div className="container-site mx-auto max-w-xl text-center">
        <p className="section-eyebrow">Newsletter</p>
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          {ok ? "You are unsubscribed." : "Let’s sort this out together."}
        </h1>
        <p className="mt-5 text-lg text-ink/80">
          {ok
            ? "You will not receive further newsletter emails from Build With Innocent. No hard feelings — the door stays open."
            : "That unsubscribe link did not work. You may already be off the list, or the link may be incomplete. Message us and we will remove you by hand."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          {!ok && (
            <Link href="/newsletter" className="btn-secondary">
              Try the newsletter again
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
