/**
 * Optional qualification for a strategy-call enquiry.
 * Budget and timeline are never required. Unknown values are rejected
 * so a free-text budget cannot masquerade as a chosen range.
 */

export const budgetRanges = [
  "Under GHS 5,000",
  "GHS 5,000-15,000",
  "GHS 15,000-50,000",
  "Above GHS 50,000",
  "Not sure yet",
] as const;

export const timelines = [
  "This month",
  "In 1-3 months",
  "Later this year",
  "Just exploring",
] as const;

export type QualificationInput = {
  budgetRange: string;
  timeline: string;
  note: string;
  /** True when the visitor used the strategy-call form. */
  strategyCall: boolean;
};

export type QualificationErrors = {
  budgetRange?: string;
  timeline?: string;
};

function allowed(value: string, options: readonly string[]): boolean {
  return (options as readonly string[]).includes(value);
}

/**
 * Folds an optional budget and timeline into the project note the owner
 * already receives. Returns null when this is an ordinary project note
 * with neither field set.
 */
export function composeQualification(
  input: QualificationInput,
): { projectDetails: string; errors: QualificationErrors } | null {
  const budget = input.budgetRange.trim();
  const timeline = input.timeline.trim();
  const note = input.note.trim();

  if (!input.strategyCall && !budget && !timeline) return null;

  const errors: QualificationErrors = {};
  if (budget && !allowed(budget, budgetRanges)) {
    errors.budgetRange = "Choose a budget range, or leave it blank.";
  }
  if (timeline && !allowed(timeline, timelines)) {
    errors.timeline = "Choose a timeline, or leave it blank.";
  }

  const lines = ["Strategy call request."];
  if (budget && !errors.budgetRange) lines.push(`Budget range: ${budget}`);
  if (timeline && !errors.timeline) lines.push(`Timeline: ${timeline}`);
  if (note) lines.push(note);

  return { projectDetails: lines.join("\n"), errors };
}
