import { describe, expect, it } from "vitest";
import { estimateBreakdown } from "@/lib/pricing";

describe("estimateBreakdown", () => {
  it("splits an uncapped estimate into two halves that add up", () => {
    const estimate = estimateBreakdown(2300 + 800 + 600);
    expect(estimate.displayTotal).toBe(3700);
    expect(estimate.upfront).toBe(1850);
    expect(estimate.onDelivery).toBe(1850);
    expect(estimate.upfront + estimate.onDelivery).toBe(estimate.displayTotal);
    expect(estimate.bundleAdjustment).toBe(0);
  });

  it("caps the itemized modules at the published partnership price", () => {
    const itemized = 2300 + 800 + 600 + 600 + 1100 + 600 + 500;
    expect(itemized).toBe(6500);
    const estimate = estimateBreakdown(itemized);
    expect(estimate.displayTotal).toBe(5400);
    expect(estimate.upfront).toBe(2700);
    expect(estimate.onDelivery).toBe(2700);
    expect(estimate.bundleAdjustment).toBe(-1100);
    expect(itemized + estimate.bundleAdjustment).toBe(estimate.displayTotal);
  });
});
