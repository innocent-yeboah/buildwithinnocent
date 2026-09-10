/**
 * Central site configuration for Build With Innocent.
 * Single source of truth for brand copy, contact details, and offer terms
 * used across pages, metadata, and structured data.
 */
export const site = {
  name: "Build With Innocent",
  tagline: "Digital Business Systems for African Enterprises",
  headline: "Your business should work while you sleep.",
  subheadline:
    "A digital system that brings you customers, bookings, and payments — automatically. No more late nights. No more manual work. Just results.",
  promise:
    "10+ qualified leads in 30 days, or we work for free until you get them.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithinnocent.com",
  email: "hello@buildwithinnocent.com",
  phone: "+233201234567",
  phoneDisplay: "+233 20 123 4567",
  whatsappUrl: "https://wa.me/233201234567",
  founder: "Innocent Golden",
  locale: "en_GH",
  offer: {
    /** Full partnership investment. */
    total: "GHS 5,400",
    /** Half to start the project. */
    upfront: "GHS 2,700",
    /** Half when the system is delivered. */
    onDelivery: "GHS 2,700",
    /** Short label for the 50/50 structure. */
    split:
      "50% upfront to initiate the project, 50% on delivery",
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
} as const;

export const navLinks = [
  { href: "/what-we-build", label: "What We Build" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/calculator", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
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
