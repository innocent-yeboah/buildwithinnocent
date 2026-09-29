import { describe, expect, it } from "vitest";
import {
  nextSteps,
  parseAnswers,
  scoreAnswers,
  startSectionFor,
  tierForTotal,
  tierLabels,
  validateScorecard,
  type QuestionId,
  type ScorecardAnswers,
} from "@/lib/scorecard";

function answers(values: number[]): ScorecardAnswers {
  const ids: QuestionId[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];
  const record = {} as ScorecardAnswers;
  ids.forEach((id, index) => {
    const value = values[index];
    if (value !== 0 && value !== 1 && value !== 2) {
      throw new Error(`Bad fixture at ${id}`);
    }
    record[id] = value;
  });
  return record;
}

describe("tier boundaries", () => {
  it("keeps 7 in AI-curious and 8 in Building momentum", () => {
    expect(tierForTotal(7)).toBe("curious");
    expect(tierForTotal(8)).toBe("momentum");
    expect(tierLabels.curious).toBe("AI-curious, lots of opportunity");
    expect(tierLabels.momentum).toBe("Building momentum, ready to scale");
  });

  it("keeps 14 in Building momentum and 15 in AI-forward", () => {
    expect(tierForTotal(14)).toBe("momentum");
    expect(tierForTotal(15)).toBe("forward");
    expect(tierLabels.forward).toBe("AI-forward, time to optimize");
  });

  it("scores a total of 7 and 8 from the ten answers", () => {
    const seven = scoreAnswers(answers([2, 2, 2, 1, 0, 0, 0, 0, 0, 0]));
    expect(seven.salesScore).toBe(6);
    expect(seven.aiScore).toBe(1);
    expect(seven.revenueScore).toBe(0);
    expect(seven.total).toBe(7);
    expect(seven.tier).toBe("AI-curious, lots of opportunity");

    const eight = scoreAnswers(answers([2, 2, 2, 2, 0, 0, 0, 0, 0, 0]));
    expect(eight.total).toBe(8);
    expect(eight.tier).toBe("Building momentum, ready to scale");
  });

  it("scores a total of 14 and 15 from the ten answers", () => {
    const fourteen = scoreAnswers(answers([2, 2, 2, 2, 2, 2, 2, 0, 0, 0]));
    expect(fourteen.salesScore).toBe(6);
    expect(fourteen.aiScore).toBe(6);
    expect(fourteen.revenueScore).toBe(2);
    expect(fourteen.total).toBe(14);
    expect(fourteen.tier).toBe("Building momentum, ready to scale");
    expect(fourteen.nextSteps).toEqual(nextSteps.momentum);

    const fifteen = scoreAnswers(answers([2, 2, 2, 2, 2, 2, 2, 1, 0, 0]));
    expect(fifteen.total).toBe(15);
    expect(fifteen.tier).toBe("AI-forward, time to optimize");
    expect(fifteen.nextSteps).toEqual(nextSteps.forward);
  });
});

describe("start here", () => {
  it("names the lowest section by proportion, with revenue scaled to its max of 8", () => {
    expect(startSectionFor({ sales: 0, ai: 6, revenue: 8 })).toBe("sales");
    expect(startSectionFor({ sales: 6, ai: 0, revenue: 8 })).toBe("ai");
    expect(startSectionFor({ sales: 6, ai: 6, revenue: 0 })).toBe("revenue");
    // 1/8 is under 1/6. 2/8 is over 1/6, so sales at 1 of 6 wins.
    expect(startSectionFor({ sales: 2, ai: 2, revenue: 1 })).toBe("revenue");
    expect(startSectionFor({ sales: 1, ai: 6, revenue: 2 })).toBe("sales");
  });

  it("breaks equal proportions in section order", () => {
    expect(startSectionFor({ sales: 0, ai: 0, revenue: 0 })).toBe("sales");
    expect(startSectionFor({ sales: 6, ai: 6, revenue: 8 })).toBe("sales");
    expect(startSectionFor({ sales: 1, ai: 1, revenue: 2 })).toBe("sales");
  });

  it("labels that section on the result", () => {
    const result = scoreAnswers(answers([0, 0, 0, 2, 2, 2, 2, 2, 2, 2]));
    expect(result.salesScore).toBe(0);
    expect(result.startHere).toBe("Sales process");
  });
});

describe("validateScorecard", () => {
  const contact = {
    fullName: "Ama Serwaa",
    email: "ama@shop.com",
    businessName: "Ama's Shop",
    phone: "",
  };

  it("requires name, email, and business name, and allows a blank phone", () => {
    const errors = validateScorecard(
      { ...contact, fullName: "A", email: "nope", businessName: "" },
      answers([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    );
    expect(errors.fullName).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.businessName).toBeTruthy();
    expect(errors.phone).toBeUndefined();
  });

  it("rejects a phone that is present but not a number", () => {
    expect(validateScorecard({ ...contact, phone: "call me" }, answers([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])).phone).toBeTruthy();
  });

  it("rejects a missing answer", () => {
    const partial = { ...answers([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]) };
    delete (partial as Partial<ScorecardAnswers>).q4;
    expect(validateScorecard(contact, partial).q4).toBeTruthy();
  });

  it("rejects string answers", () => {
    expect(parseAnswers({ q1: "2" })).toBeNull();
  });
});
