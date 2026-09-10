"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckIcon, ShieldCheckIcon } from "@/components/Icons";

type Module = {
  id: string;
  name: string;
  description: string;
  price: number;
  core?: boolean;
};

const modules: Module[] = [
  {
    id: "website",
    name: "Professional Website + Admin Dashboard",
    description: "Conversion-focused website with your management dashboard",
    price: 2300,
    core: true,
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Online scheduling with deposits and automatic reminders",
    price: 800,
  },
  {
    id: "payments",
    name: "Payment System",
    description: "Mobile money and card payments on your site",
    price: 600,
  },
  {
    id: "crm",
    name: "CRM Database",
    description: "Every client and inquiry tracked in one place",
    price: 600,
  },
  {
    id: "ecommerce",
    name: "Online Store & Inventory",
    description: "Product catalog, cart, and stock tracking",
    price: 1100,
  },
  {
    id: "email",
    name: "Automated Email System",
    description: "Follow-ups, confirmations, and newsletters on autopilot",
    price: 600,
  },
  {
    id: "social",
    name: "Social Media Integration",
    description: "Instagram, Facebook, and WhatsApp connected to your system",
    price: 500,
  },
];

const COMPLETE_SYSTEM_PRICE = 5400;
const MONTHLY_PAYMENT = 1000;
const MONTHLY_MONTHS = 6;

/**
 * Interactive estimate builder. Selecting most modules nudges toward the
 * Complete System, which bundles everything (plus hosting and support)
 * for less than the itemized total.
 */
export default function PricingCalculator() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["website", "booking", "payments"]),
  );
  const [plan, setPlan] = useState<"once" | "monthly">("once");

  function toggle(id: string) {
    if (id === "website") return; // The website is the foundation of every system.
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const itemizedTotal = useMemo(
    () =>
      modules
        .filter((m) => selected.has(m.id))
        .reduce((sum, m) => sum + m.price, 0),
    [selected],
  );

  const completeIsBetter = itemizedTotal >= COMPLETE_SYSTEM_PRICE - 1000;
  const displayTotal = Math.min(itemizedTotal, COMPLETE_SYSTEM_PRICE);
  const upfront = Math.round(displayTotal / 2);
  const onDelivery = displayTotal - upfront;
  // Partnership monthly plan is GHS 1,000 × 6 for the complete system;
  // partial estimates split evenly across 6 months.
  const monthly =
    displayTotal >= COMPLETE_SYSTEM_PRICE
      ? MONTHLY_PAYMENT
      : Math.ceil(displayTotal / MONTHLY_MONTHS / 10) * 10;

  const selectedNames = modules
    .filter((m) => selected.has(m.id))
    .map((m) => m.name)
    .join(", ");

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      {/* Module picker */}
      <div>
        <h2 className="font-display text-xl font-bold text-primary">
          1. Choose what your system needs
        </h2>
        <div className="mt-5 space-y-3">
          {modules.map((module) => {
            const isSelected = selected.has(module.id);
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => toggle(module.id)}
                disabled={module.core}
                aria-pressed={isSelected}
                className={`flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                  isSelected
                    ? "border-growth bg-growth-50"
                    : "border-primary-100 bg-white hover:border-primary"
                } ${module.core ? "cursor-default" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                    isSelected
                      ? "border-growth bg-growth text-white"
                      : "border-primary-200 bg-white"
                  }`}
                >
                  {isSelected && <CheckIcon className="h-4 w-4" />}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-primary">
                    {module.name}
                    {module.core && (
                      <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                        Always included
                      </span>
                    )}
                  </span>
                  <span className="block text-sm text-ink/70">{module.description}</span>
                </span>
                <span className="font-display font-bold text-primary">
                  GHS {module.price}
                </span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-10 font-display text-xl font-bold text-primary">
          2. Choose how you want to pay
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Payment plan">
          <button
            type="button"
            role="radio"
            aria-checked={plan === "once"}
            onClick={() => setPlan("once")}
            className={`rounded-xl border-2 px-5 py-4 text-center font-semibold transition-colors ${
              plan === "once"
                ? "border-growth bg-growth-50 text-growth-700"
                : "border-primary-100 text-primary hover:border-primary"
            }`}
          >
            One-time — 50% now, 50% on delivery
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={plan === "monthly"}
            onClick={() => setPlan("monthly")}
            className={`rounded-xl border-2 px-5 py-4 text-center font-semibold transition-colors ${
              plan === "monthly"
                ? "border-growth bg-growth-50 text-growth-700"
                : "border-primary-100 text-primary hover:border-primary"
            }`}
          >
            GHS {MONTHLY_PAYMENT.toLocaleString()}/month × {MONTHLY_MONTHS}
          </button>
        </div>
      </div>

      {/* Estimate panel */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-primary p-8 text-white shadow-card-hover">
          <p className="text-xs font-bold uppercase tracking-widest text-gold">
            Your Estimate
          </p>

          <div className="mt-4">
            {plan === "once" ? (
              <>
                <p className="font-display text-4xl font-bold">
                  GHS {displayTotal.toLocaleString()}
                  <span className="ml-2 text-base font-medium text-primary-200">
                    total
                  </span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-primary-100">
                  <li className="flex justify-between gap-3 rounded-lg bg-white/10 px-3 py-2">
                    <span>50% upfront to start</span>
                    <span className="font-bold text-gold">
                      GHS {upfront.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between gap-3 rounded-lg bg-white/10 px-3 py-2">
                    <span>50% on delivery</span>
                    <span className="font-bold text-white">
                      GHS {onDelivery.toLocaleString()}
                    </span>
                  </li>
                </ul>
              </>
            ) : (
              <p className="font-display text-4xl font-bold">
                GHS {monthly.toLocaleString()}
                <span className="ml-2 text-base font-medium text-primary-200">
                  /month × {MONTHLY_MONTHS}
                </span>
              </p>
            )}
          </div>

          {completeIsBetter && (
            <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-4">
              <p className="text-sm font-bold text-gold">
                You have selected most of the system.
              </p>
              <p className="mt-1 text-sm text-primary-100">
                The Complete Digital Business System bundles{" "}
                <strong className="text-white">everything</strong> — including
                1 year of domain, hosting, and support — at GHS{" "}
                {COMPLETE_SYSTEM_PRICE.toLocaleString()}. Your estimate is
                capped there automatically.
              </p>
            </div>
          )}

          <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-sm">
            {modules
              .filter((m) => selected.has(m.id))
              .map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-primary-100">
                    <CheckIcon className="h-4 w-4 shrink-0 text-growth-300" />
                    {m.name}
                  </span>
                  <span className="shrink-0 font-semibold">GHS {m.price}</span>
                </li>
              ))}
            <li className="flex items-center justify-between gap-3 border-t border-white/15 pt-3">
              <span className="flex items-center gap-2 text-primary-100">
                <CheckIcon className="h-4 w-4 shrink-0 text-gold" />
                1 year domain, hosting & support
              </span>
              <span className="shrink-0 font-bold text-gold">Free</span>
            </li>
          </ul>

          <p className="mt-5 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-semibold text-gold">
            <ShieldCheckIcon className="h-5 w-5 shrink-0" />
            Every estimate includes the guarantee: 10+ leads in 30 days or we
            work for free.
          </p>

          <Link
            href={`/start?estimate=${plan === "monthly" ? monthly : displayTotal}&plan=${plan}&modules=${encodeURIComponent(selectedNames)}`}
            className="btn-primary mt-6 w-full"
          >
            Get My Exact Proposal <span aria-hidden="true">&rarr;</span>
          </Link>
          <p className="mt-3 text-center text-xs text-primary-200">
            This is an estimate. Your proposal is exact, in writing, and free.
          </p>
        </div>
      </div>
    </div>
  );
}
