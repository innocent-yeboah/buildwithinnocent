/**
 * Proof that is allowed on the public site.
 *
 * Client names, quotes, logos, photos, and metrics belong in the arrays
 * below only after the owner has the real material and permission to
 * publish it. Empty arrays render a quiet "not yet" state — never a
 * borrowed story.
 */

export type VerifiedMetric = {
  value: string;
  label: string;
};

export type CaseStudyRecord = {
  id: string;
  clientName: string;
  role: string;
  business: string;
  summary: string;
  quote?: string;
  logoSrc?: string;
  photoSrc?: string;
  metrics: VerifiedMetric[];
  href?: string;
};

export type TestimonialRecord = {
  id: string;
  clientName: string;
  role: string;
  business: string;
  quote: string;
  logoSrc?: string;
  photoSrc?: string;
  metric?: VerifiedMetric;
  href?: string;
};

/** Real client case studies. Leave empty until the owner supplies them. */
export const publishedCaseStudies: CaseStudyRecord[] = [];

/** Real testimonials. Leave empty until the owner supplies them. */
export const publishedTestimonials: TestimonialRecord[] = [];

/**
 * Lab measurements from a local production build. Fill only after a real
 * Lighthouse run in this environment. Do not estimate.
 */
export type MeasuredPerformance = {
  measuredOn: string;
  tool: string;
  url: string;
  notes: string;
  scores: { label: string; value: number }[];
};

export const measuredPerformance: MeasuredPerformance | null = {
  measuredOn: "29 September 2026",
  tool: "Lighthouse 12.8.2",
  url: "http://localhost:3000/",
  notes:
    "Homepage, local production build, mobile form factor. Lab data, not a field test on a phone. Largest contentful paint in that run was 2.4s.",
  scores: [
    { label: "Performance", value: 98 },
    { label: "Accessibility", value: 100 },
    { label: "Best practices", value: 96 },
    { label: "SEO", value: 100 },
  ],
};

/** Things a buyer can open and judge, with no invented client attached. */
export const inspectableWork = [
  {
    href: "/demo/booking",
    title: "Booking sandbox, with Mobile Money",
    body: "Serenity Demo Spa is a sample business, labelled as a demo. Pick a service, choose a time, and pay with mobile money. Nothing is charged. The point is to see the flow before a proposal.",
  },
  {
    href: "/demo/dashboard",
    title: "The owner’s screen",
    body: "The same sandbox opens the dashboard an owner would use for bookings and follow-up. The figures on that screen are sample data, not a client’s results.",
  },
  {
    href: "/demo",
    title: "Try both sides",
    body: "Customer view and owner view, on this domain, with no signup. This website is the piece of work you can inspect today.",
  },
] as const;
