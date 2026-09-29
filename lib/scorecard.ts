/**
 * AI Readiness Scorecard for Revenue Growth.
 * Shared by the page and the API so the browser and the server use the
 * same points, tiers, and "start here" rule.
 *
 * No = 0, Partly = 1, Yes = 2.
 * Sales process and AI adoption are 0–6. Revenue goals is 0–8. Total is 0–20.
 */
import { isValidEmail } from "@/lib/email";

export const answerChoices = [
  { label: "No", value: 0 },
  { label: "Partly", value: 1 },
  { label: "Yes", value: 2 },
] as const;

export type AnswerValue = (typeof answerChoices)[number]["value"];

export const questionIds = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
] as const;

export type QuestionId = (typeof questionIds)[number];

export type SectionId = "sales" | "ai" | "revenue";

export type ScorecardAnswers = Record<QuestionId, AnswerValue>;

export const scorecardSections: {
  id: SectionId;
  title: string;
  max: number;
  questions: { id: QuestionId; prompt: string }[];
}[] = [
  {
    id: "sales",
    title: "Sales process",
    max: 6,
    questions: [
      { id: "q1", prompt: "Do you track where leads drop off in your funnel?" },
      { id: "q2", prompt: "Do you follow up with a new lead within one hour?" },
      { id: "q3", prompt: "Do you have a documented sales playbook your team follows?" },
    ],
  },
  {
    id: "ai",
    title: "AI adoption",
    max: 6,
    questions: [
      { id: "q4", prompt: "Do you currently use any AI tools in your business?" },
      { id: "q5", prompt: "Is your customer data organised enough to feed an AI tool?" },
      {
        id: "q6",
        prompt: "Have you automated any repetitive tasks (replies, reminders, invoices)?",
      },
    ],
  },
  {
    id: "revenue",
    title: "Revenue goals",
    max: 8,
    questions: [
      { id: "q7", prompt: "Do you have a clear monthly revenue target?" },
      { id: "q8", prompt: "Can you name your top three revenue leaks right now?" },
      { id: "q9", prompt: "Do you measure customer lifetime value?" },
      { id: "q10", prompt: "Is most of your pipeline predictable rather than guesswork?" },
    ],
  },
];

export const sectionLabels: Record<SectionId, string> = {
  sales: "Sales process",
  ai: "AI adoption",
  revenue: "Revenue goals",
};

export const sectionMax: Record<SectionId, number> = {
  sales: 6,
  ai: 6,
  revenue: 8,
};

/** Tier labels, including the comma, exactly as published on the result. */
export const tierLabels = {
  curious: "AI-curious, lots of opportunity",
  momentum: "Building momentum, ready to scale",
  forward: "AI-forward, time to optimize",
} as const;

export type TierId = keyof typeof tierLabels;

export const nextSteps: Record<TierId, readonly [string, string, string]> = {
  curious: [
    "Pick one number to track: write down how many leads you get each week and how many become paying customers.",
    "Fix your follow-up: reply to every new enquiry the same day, using a saved message you can send in seconds.",
    "Automate one repetitive task: start with reminders or confirmations, before anything more advanced.",
  ],
  momentum: [
    "Find your biggest leak: look at your funnel and locate the single step where most leads disappear.",
    "Put your customer data in one place: clean, organised records are what make any AI tool useful.",
    "Automate follow-up and reporting: use AI to draft replies and summarise weekly numbers, and review them yourself.",
  ],
  forward: [
    "Test the details: try different offers, follow-up timing and messages, and keep what wins.",
    "Track lifetime value by customer type: spend more on the customers who stay and buy again.",
    "Set guardrails: decide which tasks AI does alone, and which need a person's approval.",
  ],
};

export type ScorecardResult = {
  salesScore: number;
  aiScore: number;
  revenueScore: number;
  total: number;
  tierId: TierId;
  tier: string;
  startSection: SectionId;
  startHere: string;
  nextSteps: readonly [string, string, string];
};

export type ScorecardContact = {
  fullName: string;
  email: string;
  businessName: string;
  phone: string;
};

export type ScorecardFieldErrors = Partial<
  Record<keyof ScorecardContact, string> & Record<QuestionId, string>
>;

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export function tierForTotal(total: number): TierId {
  if (total <= 7) return "curious";
  if (total <= 14) return "momentum";
  return "forward";
}

/**
 * The place to start is the section with the lowest score as a share of its
 * maximum. Sales and AI are already out of 6, so 0 or 1 is the weak band.
 * Revenue is out of 8, so it is compared on the same proportion (score / 8
 * against score / 6). A revenue score of 0 or 1 sits at or under 1/6; a
 * score of 2 does not. Equal proportions keep section order: Sales, then
 * AI adoption, then Revenue goals.
 */
export function startSectionFor(scores: {
  sales: number;
  ai: number;
  revenue: number;
}): SectionId {
  const ranked: { id: SectionId; ratio: number }[] = [
    { id: "sales", ratio: scores.sales / sectionMax.sales },
    { id: "ai", ratio: scores.ai / sectionMax.ai },
    { id: "revenue", ratio: scores.revenue / sectionMax.revenue },
  ];
  let lowest = ranked[0];
  for (const section of ranked.slice(1)) {
    if (section.ratio < lowest.ratio) lowest = section;
  }
  return lowest.id;
}

export function isAnswerValue(value: unknown): value is AnswerValue {
  return value === 0 || value === 1 || value === 2;
}

export function parseAnswers(input: unknown): ScorecardAnswers | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;
  const answers = {} as ScorecardAnswers;
  for (const id of questionIds) {
    if (!isAnswerValue(record[id])) return null;
    answers[id] = record[id];
  }
  return answers;
}

export function scoreAnswers(answers: ScorecardAnswers): ScorecardResult {
  const salesScore = answers.q1 + answers.q2 + answers.q3;
  const aiScore = answers.q4 + answers.q5 + answers.q6;
  const revenueScore = answers.q7 + answers.q8 + answers.q9 + answers.q10;
  const total = salesScore + aiScore + revenueScore;
  const tierId = tierForTotal(total);
  const startSection = startSectionFor({
    sales: salesScore,
    ai: aiScore,
    revenue: revenueScore,
  });
  return {
    salesScore,
    aiScore,
    revenueScore,
    total,
    tierId,
    tier: tierLabels[tierId],
    startSection,
    startHere: sectionLabels[startSection],
    nextSteps: nextSteps[tierId],
  };
}

export function normalizeScorecardContact(input: ScorecardContact): ScorecardContact {
  return {
    fullName: input.fullName.trim().slice(0, 120),
    email: input.email.trim().toLowerCase().slice(0, 200),
    businessName: input.businessName.trim().slice(0, 160),
    phone: input.phone.trim().slice(0, 30),
  };
}

/** Same rules on the form and the API. An empty map means the submission is valid. */
export function validateScorecard(
  contact: ScorecardContact,
  answers: Partial<Record<QuestionId, unknown>>,
): ScorecardFieldErrors {
  const errors: ScorecardFieldErrors = {};

  if (contact.fullName.trim().length < 2) {
    errors.fullName = "Please share your name so we know who to greet.";
  }
  if (contact.businessName.trim().length < 2) {
    errors.businessName = "Please add your business name.";
  }
  if (!isValidEmail(contact.email)) {
    errors.email = "That email does not look right — mind checking it?";
  }
  if (contact.phone.trim().length > 0 && !PHONE_PATTERN.test(contact.phone.trim())) {
    errors.phone = "That number does not look right — or leave it blank.";
  }

  for (const section of scorecardSections) {
    for (const question of section.questions) {
      if (!isAnswerValue(answers[question.id])) {
        errors[question.id] = "Please choose No, Partly, or Yes.";
      }
    }
  }

  return errors;
}

export function resultPlainText(
  fullName: string,
  result: ScorecardResult,
  bookingUrl: string,
): string {
  const first = fullName.split(" ")[0] || fullName;
  const steps = result.nextSteps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return [
    `Hello ${first},`,
    "",
    `Your AI Readiness Score is ${result.total} out of 20.`,
    result.tier,
    "",
    `Sales process: ${result.salesScore}/6`,
    `AI adoption: ${result.aiScore}/6`,
    `Revenue goals: ${result.revenueScore}/8`,
    "",
    `Start here: ${result.startHere}`,
    "",
    "Next steps:",
    steps,
    "",
    `Book a strategy call: ${bookingUrl}`,
    "",
    "Powered by Offer Value With Innocent",
  ].join("\n");
}
