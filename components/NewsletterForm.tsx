"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { trackNewsletterSignup } from "@/lib/pixels";

type NewsletterFormProps = {
  /** Recorded in Supabase so you know which page converts subscribers. */
  source?: string;
};

/**
 * Newsletter signup form. On success, routes to the thank-you page.
 */
export default function NewsletterForm({ source = "newsletter_page" }: NewsletterFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("That email does not look right — mind checking it?");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, source }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? "Something interrupted us. Let's try that again together?");
        return;
      }
      trackNewsletterSignup();
      router.push("/newsletter/thank-you");
    } catch {
      setError("We could not reach our server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="nl-name" className="mb-1.5 block text-sm font-semibold text-primary">
          First Name <span className="font-normal text-ink/50">(optional)</span>
        </label>
        <input
          id="nl-name"
          type="text"
          autoComplete="given-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ama"
          className="w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label htmlFor="nl-email" className="mb-1.5 block text-sm font-semibold text-primary">
          Email Address
        </label>
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourbusiness.com"
          className="w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing you up…" : "Get the Newsletter"}
        {!submitting && <span aria-hidden="true">&rarr;</span>}
      </button>
      <p className="text-center text-xs text-ink/60">
        One email every two weeks. Unsubscribe anytime with one click.
      </p>
    </form>
  );
}
