"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { CheckIcon } from "@/components/Icons";

const inputClasses =
  "w-full rounded-lg border border-primary-100 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

/**
 * Creates the visitor's personal referral code and shows shareable links.
 */
export default function ReferralSignup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = code ? `${site.url}/referral/${code}` : "";
  const whatsappShare = code
    ? `https://wa.me/?text=${encodeURIComponent(
        `I thought of your business when I saw this. Build With Innocent builds complete digital systems — website, booking, payments, follow-up — with a guarantee of 10+ leads in 30 days or they work for free. Use my link: ${shareUrl}`,
      )}`
    : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setError("Please share your name and a valid email so we can track your rewards.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { code?: string; message?: string };
      if (!response.ok || !payload.code) {
        setError(payload.message ?? "Something interrupted us. Let's try that again together?");
        return;
      }
      setCode(payload.code);
    } catch {
      setError("We could not reach our server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable — the visible URL can be copied manually.
    }
  }

  if (code) {
    return (
      <div role="status" className="rounded-3xl border-2 border-growth bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-growth text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold text-primary">
          Your referral link is live.
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          Share it with any business owner who needs customers. When they
          become a client, you earn GHS 300.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-primary-50 p-3">
          <p className="flex-1 truncate px-2 text-left font-mono text-sm text-primary">
            {shareUrl}
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <a
          href={whatsappShare}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 w-full"
        >
          Share on WhatsApp
        </a>
        <p className="mt-4 text-xs text-ink/60">
          Your code: <span className="font-mono font-bold text-primary">{code}</span> —
          we track every click and every client it brings.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl bg-white p-8 shadow-card">
      <h3 className="font-display text-xl font-bold text-primary">
        Get Your Referral Link
      </h3>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="ref-name" className="mb-1.5 block text-sm font-semibold text-primary">
            Your Name
          </label>
          <input
            id="ref-name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ama Serwaa"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ref-email" className="mb-1.5 block text-sm font-semibold text-primary">
            Email Address
          </label>
          <input
            id="ref-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ref-phone" className="mb-1.5 block text-sm font-semibold text-primary">
            Phone / Mobile Money Number{" "}
            <span className="font-normal text-ink/50">(for payouts)</span>
          </label>
          <input
            id="ref-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+233 20 000 0000"
            className={inputClasses}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating your link…" : "Create My Link"}
        {!submitting && <span aria-hidden="true">&rarr;</span>}
      </button>
    </form>
  );
}
