/**
 * Offer ladder for the AI Readiness Scorecard.
 * Edit names, prices, and the included lines here. The page and the API
 * both read this object.
 */
import { sectionMax, startSectionFor, type SectionId } from "@/lib/scorecard";

export type OfferId = "scorecard" | "roadmap" | "sprint";

export type OfferTier = {
  id: OfferId;
  step: 1 | 2 | 3;
  name: string;
  price: string;
  /** Omitted on the free scorecard. The five minutes are already in the first line. */
  length: string | null;
  gets: readonly string[];
  leadsLabel: string;
  leadsWhen: string;
};

export const offers = {
  footnote:
    "Prices are indicative ranges in Ghana cedis; the exact figure is agreed before any work starts.",
  tiers: [
    {
      id: "scorecard",
      step: 1,
      name: "Free AI Readiness Scorecard",
      price: "Free",
      length: null,
      gets: [
        "A 10-question self-assessment (about 5 minutes).",
        "A score out of 20 and your readiness tier.",
        "Three next steps matched to your score.",
      ],
      leadsLabel: "Leads to next when",
      leadsWhen: "Your score shows clear gaps, or you can name a leak but not the fix.",
    },
    {
      id: "roadmap",
      step: 2,
      name: "AI Roadmap",
      price: "GHS 1,500 - 3,500",
      length: "1 to 2 weeks",
      gets: [
        "A short working session on your sales and operations.",
        "Your scorecard gaps turned into a ranked list of AI opportunities.",
        "A written plan of what to do first, what it costs and what it should return.",
      ],
      leadsLabel: "Leads to next when",
      leadsWhen: "You have a plan you believe in and want it built, not just written down.",
    },
    {
      id: "sprint",
      step: 3,
      name: "AI Implementation Sprint",
      price: "GHS 6,000 - 15,000",
      length: "4 to 6 weeks, done with you",
      gets: [
        "We build and switch on the first one to three AI use cases from your roadmap.",
        "Set up alongside your team so they can run it.",
        "A simple measure of results reviewed at the end.",
      ],
      leadsLabel: "Leads onward when",
      leadsWhen: "First results are in and you want more use cases or ongoing support.",
    },
  ] as const satisfies readonly OfferTier[],
};

export const recommendationCopy = {
  curiousRoadmap:
    "Start with the Roadmap: it turns your gaps into a clear, ranked plan before you spend on tools.",
  momentumRoadmap:
    "Your basics work, but one area is holding you back. A Roadmap will pick the fix that pays off first.",
  momentumSprint:
    "Your basics are in place. A Sprint builds and switches on your first AI use cases.",
  forwardSprint:
    "You are ready to build. A Sprint puts your first AI use cases live and measures the result.",
} as const;

export type OfferRecommendation = {
  id: OfferId;
  name: string;
  sentence: string;
};

export type RecommendationScores = {
  total: number;
  salesScore: number;
  aiScore: number;
  revenueScore: number;
};

function offerNamed(id: OfferId): OfferTier {
  const tier = offers.tiers.find((item) => item.id === id);
  if (!tier) throw new Error(`Missing offer ${id}`);
  return tier;
}

function sectionScore(scores: RecommendationScores, section: SectionId): number {
  if (section === "sales") return scores.salesScore;
  if (section === "ai") return scores.aiScore;
  return scores.revenueScore;
}

/**
 * 0–7 always recommends the Roadmap.
 * 8–14 recommends the Roadmap when the lowest section is below half its
 * maximum, and the Sprint when that section is at or above half.
 * 15–20 always recommends the Sprint.
 * Half is exact: 3 of 6 and 4 of 8 are not "below half".
 */
export function recommendOffer(scores: RecommendationScores): OfferRecommendation {
  if (scores.total <= 7) {
    const offer = offerNamed("roadmap");
    return { id: offer.id, name: offer.name, sentence: recommendationCopy.curiousRoadmap };
  }

  if (scores.total <= 14) {
    const lowest = startSectionFor({
      sales: scores.salesScore,
      ai: scores.aiScore,
      revenue: scores.revenueScore,
    });
    const belowHalf = sectionScore(scores, lowest) < sectionMax[lowest] / 2;
    const offer = offerNamed(belowHalf ? "roadmap" : "sprint");
    return {
      id: offer.id,
      name: offer.name,
      sentence: belowHalf ? recommendationCopy.momentumRoadmap : recommendationCopy.momentumSprint,
    };
  }

  const offer = offerNamed("sprint");
  return { id: offer.id, name: offer.name, sentence: recommendationCopy.forwardSprint };
}

export function offerIdForName(name: string): OfferId | null {
  const tier = offers.tiers.find((item) => item.name === name);
  return tier ? tier.id : null;
}

export function scorecardInterestMessage(total: number, offerName: string): string {
  return `Hi Innocent, I scored ${total}/20 on the AI Readiness Scorecard and I'm interested in the ${offerName}.`;
}
