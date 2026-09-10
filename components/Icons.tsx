/**
 * Brand icon set: consistent 24px stroke icons used across the site.
 * Kept inline (no icon library) for zero extra bundle weight.
 */
type IconProps = {
  className?: string;
};

function base(className?: string) {
  return {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 11v3l3 1 3 5 2-1-2-4h1l9 3V4L10 7H4a1 1 0 0 0-1 1v3Z" />
    </svg>
  );
}

export function MagnetIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M6 3v8a6 6 0 0 0 12 0V3" />
      <path d="M6 3h4v5H6zM14 3h4v5h-4z" />
    </svg>
  );
}

export function RepeatIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="3" width="8" height="10" rx="1.5" />
      <rect x="13" y="3" width="8" height="6" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="15" width="8" height="6" rx="1.5" />
    </svg>
  );
}

export function CardIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  );
}

export function DatabaseIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7L22 7" />
    </svg>
  );
}

export function ServerIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  );
}

export function HeadsetIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19a4 4 0 0 1-4 3h-2" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m11 17 2 2a2 2 0 0 0 2.8-2.8" />
      <path d="m15.8 16.2 2 2a2 2 0 0 0 2.8-2.9l-5.4-5.2a3 3 0 0 0-4.3 0L9.5 11.4a2 2 0 0 1-2.9-2.9L10 5.2a5 5 0 0 1 7 0l4.6 4.5" />
      <path d="m2.4 9.7 5.4 5.3a2 2 0 0 0 2.9-2.9" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12Z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 7 5.5 3h13L20 7" />
      <path d="M4 7h16v3a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0v0a2.5 2.5 0 0 1-5 0" />
      <path d="M5 12.5V21h14v-8.5M9 21v-5h6v5" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M6 21c0-9 4-15 14-17-1 10-5 15-14 15" />
      <path d="M6 21c1-5 4-9 9-12" />
    </svg>
  );
}

export function PaletteIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h6a3 3 0 0 0 3-3c0-4-4-7-9-7Z" />
      <path d="M7.5 10.5h.01M11 7h.01M16 7.5h.01" />
    </svg>
  );
}

export function ForkIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M7 3v6a4 4 0 0 0 4 4v8M17 3v6a4 4 0 0 1-4 4" />
      <circle cx="11" cy="21" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.3L3 17.3a2 2 0 1 0 2.8 2.8l5.6-5.6a4.5 4.5 0 0 0 5.3-6.1l-2.7 2.7-2.8-2.8 2.7-2.7a4.5 4.5 0 0 0 .8.7Z" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 3 3 6-7" />
    </svg>
  );
}
