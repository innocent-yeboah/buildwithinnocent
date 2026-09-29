/**
 * Central site configuration for Build With Innocent.
 * Single source of truth for brand copy, contact details, and offer terms
 * used across pages, metadata, and structured data.
 *
 * The public WhatsApp number is NOT hardcoded. Set NEXT_PUBLIC_WHATSAPP_NUMBER
 * (digits only, no +). When it is missing or still the old example value, every
 * WhatsApp link is omitted and structured data does not include a telephone.
 */
import { isValidEmail } from "@/lib/email";

const PLACEHOLDER_WHATSAPP_DIGITS = "233201234567";

const warned = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (warned.has(key) || typeof window !== "undefined") return;
  warned.add(key);
  console.warn(message);
}

function readWhatsAppDigits(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
  const digits = raw.replace(/\D/g, "");

  if (!digits) {
    warnOnce(
      "whatsapp-missing",
      "NEXT_PUBLIC_WHATSAPP_NUMBER is not set. WhatsApp links are hidden and no telephone is included in structured data. Set it in Vercel to turn click-to-chat on.",
    );
    return null;
  }

  if (digits === PLACEHOLDER_WHATSAPP_DIGITS) {
    warnOnce(
      "whatsapp-placeholder",
      "NEXT_PUBLIC_WHATSAPP_NUMBER is the example placeholder (233201234567). Treating it as unset so a fake number is not published.",
    );
    return null;
  }

  if (digits.length < 8 || digits.length > 15) {
    warnOnce(
      "whatsapp-invalid",
      "NEXT_PUBLIC_WHATSAPP_NUMBER is not a usable phone number. Treating it as unset.",
    );
    return null;
  }

  return digits;
}

function formatWhatsAppDisplay(digits: string): string {
  if (digits.startsWith("233") && digits.length === 12) {
    return `+233 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

/** Message prefilled in click-to-chat links. */
export const WHATSAPP_PREFILL =
  "Hi, I found Build With Innocent and I would like to talk about a digital system for my business.";

export function whatsappChatUrl(digits: string, message: string = WHATSAPP_PREFILL): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const whatsappDigits = readWhatsAppDigits();

function readContactEmail(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  // hello@buildwithinnocent.com is the brand address (MX still needs the owner).
  // It is not an example placeholder. An env override that looks fake is ignored.
  const value = fromEnv || "hello@buildwithinnocent.com";
  const looksFake = /example\.(com|org|net)|placeholder|your-email|changeme|email@email/i.test(
    value,
  );
  if (!isValidEmail(value) || looksFake) {
    warnOnce(
      "email-placeholder",
      "Public contact email is missing or looks like a placeholder. Mailto links are omitted.",
    );
    return null;
  }
  return value;
}

/**
 * One reply-time promise for the form, chatbot, emails, and CTAs.
 * Modest on purpose: not "within the hour".
 */
export const responseTimePhrase = "within 1-2 working days";

export const site = {
  name: "Build With Innocent",
  tagline: "Digital systems for established African businesses",
  headline: "Innocent builds the system your business runs on.",
  subheadline:
    "For owners who already have customers and want bookings, payments, and follow-up handled without living in WhatsApp.",
  promise:
    "10+ qualified leads in 30 days, or we work for free until you get them.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithinnocent.com",
  email: readContactEmail(),
  /** E.164 with a leading +, or null when WhatsApp is not configured. */
  phone: whatsappDigits ? `+${whatsappDigits}` : null,
  phoneDisplay: whatsappDigits ? formatWhatsAppDisplay(whatsappDigits) : null,
  /** Click-to-chat URL with a prefilled message, or null when unset. */
  whatsappUrl: whatsappDigits ? whatsappChatUrl(whatsappDigits) : null,
  /**
   * Public name only. Earlier pages used "Innocent Golden"; the owner of
   * this project is Innocent Yeboah. The surname is his decision to confirm.
   * The site does not guess.
   */
  founder: "Innocent",
  /**
   * Set to "/images/founder.jpg" after a real photograph is placed in
   * public/images. Left unset so visitors never see a stand-in face.
   */
  founderPhoto: null as string | null,
  locale: "en_GH",
  offer: {
    /** Full partnership investment. */
    total: "GHS 5,400",
    /** Half to start the project. */
    upfront: "GHS 2,700",
    /** Half when the system is delivered. */
    onDelivery: "GHS 2,700",
    /** Short label for the 50/50 structure. */
    split: "50% upfront to initiate the project, 50% on delivery",
    /** Flexible monthly alternative. */
    monthly: "GHS 1,000/month for 6 months",
    /** One-line summary used in CTAs and footers. */
    summary:
      "GHS 5,400 — 50% upfront, 50% on delivery — or GHS 1,000/month for 6 months",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/buildwithinnocent",
    instagram: "https://www.instagram.com/buildwithinnocent",
    twitter: "https://x.com/buildwithinno",
  },
};

/** Contacts a visitor can use when a backend save fails. Omits anything unset. */
export function publicFallback(): { whatsapp?: string; email?: string } | undefined {
  const fallback: { whatsapp?: string; email?: string } = {};
  if (site.whatsappUrl) fallback.whatsapp = site.whatsappUrl;
  if (site.email) fallback.email = site.email;
  return Object.keys(fallback).length > 0 ? fallback : undefined;
}

export const navLinks = [
  { href: "/what-we-build", label: "The System" },
  { href: "/strategy-call", label: "Working Together" },
  { href: "/case-studies", label: "Proof" },
  { href: "/calculator", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

/** Pages that stay easy to find without crowding the header. */
export const moreLinks = [
  { href: "/how-it-works", label: "The 5-week process" },
  { href: "/industries", label: "Industries" },
  { href: "/blog", label: "Writing" },
  { href: "/start", label: "Short project note" },
] as const;

/** Free tools and secondary destinations, surfaced in the footer. */
export const toolLinks = [
  { href: "/assessment", label: "Free Assessment" },
  { href: "/demo", label: "Live Demo" },
  { href: "/experience", label: "3D Experience" },
  { href: "/calculator", label: "Pricing Calculator" },
  { href: "/resources", label: "Free Resources" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/referral", label: "Referral Program — Earn GHS 300" },
] as const;
