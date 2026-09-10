/**
 * Site-wide maintenance window for Build With Innocent.
 * Active from 10 September 2026 through the end of 15 September 2026 (5 days).
 */
export const MAINTENANCE_UNTIL = new Date("2026-09-16T00:00:00+00:00");

export const MAINTENANCE_COPY = {
  title: "This page is under maintenance",
  days: 5,
  returnLabel: "Tuesday, 15 September 2026",
  body: "We are upgrading Build With Innocent so the next visit is faster, clearer, and ready for new work. The site will be back in 5 days.",
} as const;

/** True while the public site should show the full-page maintenance banner. */
export function isSiteUnderMaintenance(now: Date = new Date()): boolean {
  return now.getTime() < MAINTENANCE_UNTIL.getTime();
}
