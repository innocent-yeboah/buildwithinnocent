/**
 * The Digital Business Readiness Assessment.
 * Eight questions, two per growth layer (Offer, Attention, Capture,
 * Follow-Up). Each answer scores 0-3; results are normalized to 0-100.
 */
export type LayerKey = "offer" | "attention" | "capture" | "followUp";

export type AssessmentOption = {
  label: string;
  points: 0 | 1 | 2 | 3;
};

export type AssessmentQuestion = {
  id: string;
  layer: LayerKey;
  question: string;
  options: AssessmentOption[];
};

export const layerLabels: Record<LayerKey, string> = {
  offer: "Offer",
  attention: "Attention",
  capture: "Capture",
  followUp: "Follow-Up",
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "offer-clarity",
    layer: "offer",
    question:
      "If a stranger found your business online right now, could they tell what you sell within 10 seconds?",
    options: [
      { label: "Yes — it is clear immediately", points: 3 },
      { label: "Mostly, but they might have to dig a little", points: 2 },
      { label: "Honestly, it is not that clear", points: 1 },
      { label: "We are barely online at all", points: 0 },
    ],
  },
  {
    id: "offer-pricing",
    layer: "offer",
    question:
      "Can a customer see your prices or packages without having to message you first?",
    options: [
      { label: "Yes — prices and packages are public", points: 3 },
      { label: "Some prices are visible, some are on request", points: 2 },
      { label: "No — everyone has to ask", points: 1 },
      { label: "We do not have fixed prices or packages yet", points: 0 },
    ],
  },
  {
    id: "attention-discovery",
    layer: "attention",
    question: "Where do most of your new customers find you today?",
    options: [
      { label: "They find us — website, Google, or social media", points: 3 },
      { label: "A mix of referrals and some online discovery", points: 2 },
      { label: "Almost entirely word of mouth and referrals", points: 1 },
      { label: "New customers are rare right now", points: 0 },
    ],
  },
  {
    id: "attention-consistency",
    layer: "attention",
    question:
      "How consistently does your business show up online (posts, updates, content)?",
    options: [
      { label: "Weekly or more — we are always visible", points: 3 },
      { label: "A few times a month", points: 2 },
      { label: "Only when we remember or have time", points: 1 },
      { label: "Almost never", points: 0 },
    ],
  },
  {
    id: "capture-action",
    layer: "capture",
    question:
      "When someone is interested in buying, what do they actually do next?",
    options: [
      { label: "Book, order, or pay directly online", points: 3 },
      { label: "Fill a form or send a structured inquiry", points: 2 },
      { label: "DM or call us and we take it from there", points: 1 },
      { label: "It depends — there is no set path", points: 0 },
    ],
  },
  {
    id: "capture-contacts",
    layer: "capture",
    question:
      "Do you collect the contact details of people who showed interest but did not buy?",
    options: [
      { label: "Yes — automatically, into one organized list", points: 3 },
      { label: "Yes, but manually and not always", points: 2 },
      { label: "They are scattered across chats and notes", points: 1 },
      { label: "No — if they do not buy, they are gone", points: 0 },
    ],
  },
  {
    id: "followup-lost",
    layer: "followUp",
    question:
      "What happens to someone who asked about your price last month but never bought?",
    options: [
      { label: "They get automatic follow-ups until they decide", points: 3 },
      { label: "We follow up manually when we remember", points: 2 },
      { label: "Nothing — unless they come back on their own", points: 1 },
      { label: "We would not even know who they are", points: 0 },
    ],
  },
  {
    id: "followup-repeat",
    layer: "followUp",
    question:
      "Do past customers hear from you again (reminders, offers, news)?",
    options: [
      { label: "Yes — automated emails or messages go out regularly", points: 3 },
      { label: "Occasionally, when we run a promotion", points: 2 },
      { label: "Rarely — only if they contact us", points: 1 },
      { label: "Never", points: 0 },
    ],
  },
];

export const MAX_POINTS = assessmentQuestions.length * 3;

export type ScoreBand = {
  name: string;
  range: string;
  headline: string;
  description: string;
};

export function getBand(score: number): ScoreBand {
  if (score <= 40) {
    return {
      name: "Manual Mode",
      range: "0-40",
      headline: "Your business runs entirely on your own hands and memory.",
      description:
        "Every sale depends on you being awake, online, and available. The good news: businesses in this band see the biggest jump when a system takes over — because right now, every lead you are losing is invisible.",
    };
  }
  if (score <= 70) {
    return {
      name: "Growing but Leaky",
      range: "41-70",
      headline: "You are attracting interest — and quietly losing a lot of it.",
      description:
        "People find you and some buy, but there are holes in the bucket: inquiries that go cold, contacts that never get followed up, sales that depend on you replying fast enough. Sealing those leaks is usually worth more than finding new customers.",
    };
  }
  return {
    name: "System Ready",
    range: "71-100",
    headline: "You have strong foundations — now it is about compounding.",
    description:
      "Most of the pieces are in place. The opportunity now is connecting them into one system and automating the follow-up, so growth stops depending on your personal effort every single day.",
  };
}

export type LayerScores = Record<LayerKey, number>;

/** Computes the 0-100 total and per-layer percentages from answers. */
export function computeScores(answers: Record<string, number>): {
  total: number;
  layers: LayerScores;
} {
  const layerPoints: Record<LayerKey, { earned: number; possible: number }> = {
    offer: { earned: 0, possible: 0 },
    attention: { earned: 0, possible: 0 },
    capture: { earned: 0, possible: 0 },
    followUp: { earned: 0, possible: 0 },
  };

  let earnedTotal = 0;
  for (const question of assessmentQuestions) {
    const points = answers[question.id] ?? 0;
    earnedTotal += points;
    layerPoints[question.layer].earned += points;
    layerPoints[question.layer].possible += 3;
  }

  const layers = Object.fromEntries(
    (Object.keys(layerPoints) as LayerKey[]).map((key) => [
      key,
      Math.round((layerPoints[key].earned / layerPoints[key].possible) * 100),
    ]),
  ) as LayerScores;

  return {
    total: Math.round((earnedTotal / MAX_POINTS) * 100),
    layers,
  };
}

/** Advice shown on the score page for the weakest layers. */
export const layerAdvice: Record<LayerKey, string> = {
  offer:
    "Sharpen your offer first: clear packages, public prices, and a 10-second answer to 'what do you sell?'. Everything else multiplies from here.",
  attention:
    "You need consistent visibility that does not depend on your energy. A website that ranks and content that posts on schedule beats sporadic bursts.",
  capture:
    "Interest is arriving and evaporating. Give every interested person one obvious action — book, order, or leave their details — and store every contact automatically.",
  followUp:
    "Most sales happen in the follow-up, and yours is manual or missing. Automated email and WhatsApp sequences will recover revenue you are currently losing silently.",
};

/** Session storage keys shared across the funnel pages. */
export const ASSESSMENT_ANSWERS_KEY = "bwi_assessment_answers";
export const ASSESSMENT_CONTACT_KEY = "bwi_assessment_contact";
