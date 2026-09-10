"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { site } from "@/lib/site";
import { MailIcon, CheckIcon } from "@/components/Icons";

type State = "idle" | "sending" | "sent" | "error" | "unconfigured";

/**
 * Passwordless client portal login: the client enters the email we set
 * their project up with, and Supabase sends a magic sign-in link.
 */
export default function ClientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  // Already signed in? Straight to the dashboard.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      setState("error");
      setMessage(
        "That sign-in link expired or was already used. Request a fresh one below.",
      );
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setState("unconfigured");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/client/dashboard");
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      setMessage("That email does not look right — mind checking it?");
      return;
    }

    setState("sending");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        // Exchange happens at /auth/callback, then redirects into the portal.
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/client/dashboard`,
        // Only pre-provisioned client emails (with a client_projects row) should sign in.
        // Creating Auth users for strangers would open the portal to anyone.
        shouldCreateUser: false,
      },
    });

    if (error) {
      setState("error");
      setMessage(
        error.message.toLowerCase().includes("signups not allowed") ||
          error.message.toLowerCase().includes("user not found")
          ? "We do not have a portal account for that email yet. If you are an active client, message us and we will link your project."
          : "We could not send your sign-in link just now. Please try again in a moment, or message us on WhatsApp.",
      );
      return;
    }

    setState("sent");
  }

  if (state === "unconfigured") {
    return (
      <div className="rounded-2xl border border-gold bg-gold-50 p-8 text-center">
        <p className="font-display text-lg font-bold text-primary">
          The portal is warming up.
        </p>
        <p className="mt-2 text-sm text-ink/80">
          Client sign-in is not switched on for this deployment yet. If you
          are an active client, reach us directly and we will sort you out.
        </p>
        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 !px-6 !py-2.5 !text-sm"
        >
          Message Us on WhatsApp
        </a>
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-2xl border-2 border-growth bg-growth-50 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-growth text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <p className="mt-5 font-display text-xl font-bold text-primary">
          Check your inbox.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">
          We sent a secure sign-in link to{" "}
          <span className="font-semibold text-primary">{email}</span>. Click
          it and you will land straight in your project dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="portal-email" className="mb-1.5 block text-sm font-semibold text-primary">
          Your Email Address
        </label>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-300" />
          <input
            id="portal-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="The email your project is registered with"
            className="w-full rounded-lg border border-primary-100 bg-white py-3 pl-12 pr-4 text-base text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {state === "error" && message && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Sending your link…" : "Email Me a Sign-In Link"}
      </button>
      <p className="text-center text-xs text-ink/60">
        No passwords to remember. We email you a secure one-time link.
      </p>
    </form>
  );
}
