"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

/** Visually hidden field. Leave it empty. Filled values are discarded server-side. */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Leave this empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

/**
 * Renders nothing unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * The server ignores Turnstile unless the secret is set as well.
 */
export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!turnstileSiteKey || !ref.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    function render() {
      if (cancelled || !ref.current || !window.turnstile) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => onTokenRef.current(token),
      });
    }

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      const onLoad = () => render();
      if (existing) {
        existing.addEventListener("load", onLoad);
      } else {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.dataset.turnstile = "true";
        script.addEventListener("load", onLoad);
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  if (!turnstileSiteKey) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}

export function FormLegalNote() {
  return (
    <p className="text-center text-xs text-ink/60">
      By sending this you agree to our{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
        privacy policy
      </Link>{" "}
      and{" "}
      <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
        terms
      </Link>
      .
    </p>
  );
}
