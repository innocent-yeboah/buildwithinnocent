import { describe, expect, it } from "vitest";
import {
  recommendationCopy,
  recommendOffer,
  scorecardInterestMessage,
  type RecommendationScores,
} from "@/lib/offers";

function scores(sales: number, ai: number, revenue: number): RecommendationScores {
  return { salesScore: sales, aiScore: ai, revenueScore: revenue, total: sales + ai + revenue };
}

describe("recommendOffer boundaries", () => {
  it("keeps 7 on the Roadmap and moves 8 onto the momentum Roadmap sentence", () => {
    const seven = recommendOffer(scores(6, 1, 0));
    expect(scores(6, 1, 0).total).toBe(7);
    expect(seven.id).toBe("roadmap");
    expect(seven.name).toBe("AI Roadmap");
    expect(seven.sentence).toBe(recommendationCopy.curiousRoadmap);

    const eight = recommendOffer(scores(6, 2, 0));
    expect(scores(6, 2, 0).total).toBe(8);
    expect(eight.id).toBe("roadmap");
    expect(eight.sentence).toBe(recommendationCopy.momentumRoadmap);
  });

  it("keeps 14 on the momentum sentence and 15 on the AI-forward Sprint sentence", () => {
    const fourteen = recommendOffer(scores(6, 6, 2));
    expect(scores(6, 6, 2).total).toBe(14);
    expect(fourteen.sentence).toBe(recommendationCopy.momentumRoadmap);

    const fifteen = recommendOffer(scores(6, 6, 3));
    expect(scores(6, 6, 3).total).toBe(15);
    expect(fifteen.id).toBe("sprint");
    expect(fifteen.name).toBe("AI Implementation Sprint");
    expect(fifteen.sentence).toBe(recommendationCopy.forwardSprint);
  });

  it("uses the Sprint inside 8–14 only when the lowest section is at or above half", () => {
    // Revenue 2 of 8 is below half, and it is the lowest section.
    expect(recommendOffer(scores(6, 6, 2)).id).toBe("roadmap");

    // 3 of 6 is exactly half, so it is not below half. Sales wins the tie.
    const exactHalf = recommendOffer(scores(3, 3, 8));
    expect(scores(3, 3, 8).total).toBe(14);
    expect(exactHalf.id).toBe("sprint");
    expect(exactHalf.sentence).toBe(recommendationCopy.momentumSprint);

    // Every section is above half. Lowest is still revenue, and it is not below half.
    const aboveHalf = recommendOffer(scores(5, 4, 5));
    expect(scores(5, 4, 5).total).toBe(14);
    expect(aboveHalf.id).toBe("sprint");
    expect(aboveHalf.sentence).toBe(recommendationCopy.momentumSprint);
  });

  it("recommends the Sprint at 15 even when a section is below half", () => {
    const result = recommendOffer(scores(6, 6, 3));
    expect(result.id).toBe("sprint");
    expect(result.sentence).toBe(recommendationCopy.forwardSprint);
  });

  it("builds the WhatsApp line with the score and the offer name", () => {
    expect(scorecardInterestMessage(11, "AI Roadmap")).toBe(
      "Hi Innocent, I scored 11/20 on the AI Readiness Scorecard and I'm interested in the AI Roadmap.",
    );
  });
});
