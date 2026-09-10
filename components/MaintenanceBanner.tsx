"use client";

import { useEffect, useState } from "react";
import { MAINTENANCE_COPY, MAINTENANCE_UNTIL } from "@/lib/maintenance";
import { site } from "@/lib/site";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingUntil(until: Date, now: Date): Remaining {
  const ms = Math.max(0, until.getTime() - now.getTime());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Full-viewport maintenance banner with animated construction equipment.
 * Covers the public site for five days and still offers email and WhatsApp.
 */
export default function MaintenanceBanner() {
  const [clock, setClock] = useState<Remaining>(() =>
    remainingUntil(MAINTENANCE_UNTIL, new Date()),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(remainingUntil(MAINTENANCE_UNTIL, new Date()));
    }, 1000);
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");
    return () => {
      window.clearInterval(id);
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const units: { label: string; value: string }[] = [
    { label: "Days", value: pad(clock.days) },
    { label: "Hours", value: pad(clock.hours) },
    { label: "Minutes", value: pad(clock.minutes) },
    { label: "Seconds", value: pad(clock.seconds) },
  ];

  return (
    <div
      className="maintenance-banner fixed inset-0 z-[200] flex min-h-[100dvh] flex-col overflow-hidden bg-primary-900 text-white"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      aria-describedby="maintenance-body"
    >
      <div className="maintenance-tape" aria-hidden="true">
        <span>
          UNDER MAINTENANCE — BACK IN 5 DAYS — BUILD WITH INNOCENT — UNDER
          MAINTENANCE — BACK IN 5 DAYS — BUILD WITH INNOCENT —
        </span>
        <span>
          UNDER MAINTENANCE — BACK IN 5 DAYS — BUILD WITH INNOCENT — UNDER
          MAINTENANCE — BACK IN 5 DAYS — BUILD WITH INNOCENT —
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <MaintenanceEquipment />

        <p className="section-eyebrow !text-gold">Please bear with us</p>
        <h1
          id="maintenance-title"
          className="mt-2 max-w-3xl text-center font-display text-3xl font-bold leading-tight sm:text-5xl"
        >
          {MAINTENANCE_COPY.title}
        </h1>
        <p
          id="maintenance-body"
          className="mt-4 max-w-xl text-center text-base leading-relaxed text-white/85 sm:text-lg"
        >
          {MAINTENANCE_COPY.body}
        </p>
        <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Back {MAINTENANCE_COPY.returnLabel}
        </p>

        <div
          className="mt-8 grid grid-cols-4 gap-2 sm:gap-4"
          aria-label="Time remaining until we reopen"
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="min-w-[4.25rem] rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm sm:min-w-[5.5rem] sm:px-4"
            >
              <div className="font-display text-2xl font-bold tabular-nums text-gold sm:text-4xl">
                {unit.value}
              </div>
              <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            className="btn-primary"
            href={`mailto:${site.email}`}
          >
            Email {site.email}
          </a>
          <a className="btn-ghost-light" href={site.whatsappUrl}>
            WhatsApp us
          </a>
        </div>
      </div>

      <div className="maintenance-tape maintenance-tape-bottom" aria-hidden="true">
        <span>
          HARD HATS ON — GEARS TURNING — BACK TUESDAY 15 SEPTEMBER 2026 — HARD
          HATS ON — GEARS TURNING — BACK TUESDAY 15 SEPTEMBER 2026 —
        </span>
        <span>
          HARD HATS ON — GEARS TURNING — BACK TUESDAY 15 SEPTEMBER 2026 — HARD
          HATS ON — GEARS TURNING — BACK TUESDAY 15 SEPTEMBER 2026 —
        </span>
      </div>
    </div>
  );
}

/** Animated crane, gears, wrench, hammer, cones, and hard hat. */
function MaintenanceEquipment() {
  return (
    <svg
      className="maintenance-scene mb-6 h-40 w-full max-w-xl sm:h-52"
      viewBox="0 0 640 220"
      role="img"
      aria-label="Animated maintenance equipment: crane, gears, wrench, hammer, and safety cones"
    >
      <defs>
        <linearGradient id="steel" x1="0" x2="1">
          <stop offset="0%" stopColor="#7FA3CB" />
          <stop offset="100%" stopColor="#D8E3F0" />
        </linearGradient>
      </defs>

      {/* Ground */}
      <rect x="0" y="198" width="640" height="8" fill="#162C4A" />
      <rect x="0" y="206" width="640" height="14" fill="#0E1F35" />

      {/* Crane tower */}
      <g className="crane-tower">
        <rect x="86" y="48" width="10" height="150" fill="#FFC107" />
        <rect x="74" y="48" width="34" height="8" fill="#FFC107" />
        <polygon points="74,56 108,56 91,78" fill="#E0A800" />
        <rect x="90" y="48" width="170" height="6" fill="#FFC107" />
        <line
          x1="91"
          y1="54"
          x2="248"
          y2="118"
          stroke="#AFC6E0"
          strokeWidth="2"
          className="crane-cable"
        />
        <g className="crane-hook">
          <rect x="240" y="118" width="16" height="10" rx="2" fill="#7FA3CB" />
          <path
            d="M244 128 v18 a6 6 0 0 0 12 0"
            fill="none"
            stroke="#FFC107"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Traffic cones */}
      <g transform="translate(40 150)">
        <g className="cone cone-left">
          <polygon points="22,0 36,48 8,48" fill="#E65100" />
          <rect x="6" y="22" width="32" height="7" fill="#FFF8E1" />
          <rect x="4" y="48" width="36" height="6" rx="1" fill="#BF360C" />
        </g>
      </g>
      <g transform="translate(560 150)">
        <g className="cone cone-right">
          <polygon points="22,0 36,48 8,48" fill="#E65100" />
          <rect x="6" y="22" width="32" height="7" fill="#FFF8E1" />
          <rect x="4" y="48" width="36" height="6" rx="1" fill="#BF360C" />
        </g>
      </g>

      {/* Gear cluster */}
      <g transform="translate(320 118)">
        <g className="gear gear-lg">
          <GearTeeth r={42} teeth={10} />
          <circle r="18" fill="#1E3A5F" />
          <circle r="8" fill="#FFC107" />
        </g>
      </g>
      <g transform="translate(392 86)">
        <g className="gear gear-md">
          <GearTeeth r={28} teeth={8} />
          <circle r="12" fill="#1E3A5F" />
          <circle r="5" fill="#FFC107" />
        </g>
      </g>
      <g transform="translate(258 78)">
        <g className="gear gear-sm">
          <GearTeeth r={20} teeth={7} />
          <circle r="9" fill="#1E3A5F" />
          <circle r="4" fill="#FFC107" />
        </g>
      </g>

      {/* Wrench */}
      <g transform="translate(470 70)">
        <g className="wrench">
          <path
            d="M12 8 a14 14 0 1 1 16 16 L78 92 a8 8 0 0 1-12 12 L16 36 A14 14 0 0 1 12 8 Z"
            fill="none"
            stroke="#AFC6E0"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="18" r="7" fill="#0E1F35" />
        </g>
      </g>

      {/* Hammer */}
      <g transform="translate(150 92)">
        <g className="hammer">
          <rect x="28" y="8" width="54" height="16" rx="3" fill="#7FA3CB" />
          <rect x="48" y="24" width="12" height="72" rx="3" fill="#C4A574" />
        </g>
      </g>

      {/* Hard hat */}
      <g transform="translate(500 128)">
        <g className="hardhat">
          <ellipse cx="36" cy="42" rx="36" ry="8" fill="#B38600" />
          <path d="M8 40 Q8 8 36 8 Q64 8 64 40 Z" fill="#FFC107" />
          <rect x="32" y="8" width="8" height="10" fill="#E0A800" />
        </g>
      </g>

      {/* Sparks */}
      <g className="sparks" fill="#FFC107">
        <circle className="spark s1" cx="180" cy="88" r="3" />
        <circle className="spark s2" cx="198" cy="70" r="2" />
        <circle className="spark s3" cx="166" cy="64" r="2.5" />
      </g>
    </svg>
  );
}

function GearTeeth({ r, teeth }: { r: number; teeth: number }) {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i += 1) {
    const a = (i / teeth) * Math.PI * 2;
    const b = ((i + 0.35) / teeth) * Math.PI * 2;
    const c = ((i + 0.65) / teeth) * Math.PI * 2;
    const d = ((i + 1) / teeth) * Math.PI * 2;
    const inner = r * 0.72;
    const outer = r * 1.18;
    pts.push(
      `${Math.cos(a) * inner},${Math.sin(a) * inner}`,
      `${Math.cos(b) * outer},${Math.sin(b) * outer}`,
      `${Math.cos(c) * outer},${Math.sin(c) * outer}`,
      `${Math.cos(d) * inner},${Math.sin(d) * inner}`,
    );
  }
  return <polygon points={pts.join(" ")} fill="url(#steel)" stroke="#4F7EB2" strokeWidth="2" />;
}
