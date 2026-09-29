import { describe, expect, it } from "vitest";
import { composeQualification } from "@/lib/engagement";
import { publishedCaseStudies, publishedTestimonials } from "@/lib/proof";

describe("composeQualification", () => {
  it("leaves an ordinary project note alone", () => {
    expect(
      composeQualification({
        budgetRange: "",
        timeline: "",
        note: "A short note",
        strategyCall: false,
      }),
    ).toBeNull();
  });

  it("records budget and timeline when they are chosen, and keeps both optional", () => {
    const result = composeQualification({
      budgetRange: "GHS 15,000-50,000",
      timeline: "",
      note: "Two branches in Accra.",
      strategyCall: true,
    });
    expect(result?.errors).toEqual({});
    expect(result?.projectDetails).toContain("Budget range: GHS 15,000-50,000");
    expect(result?.projectDetails).toContain("Two branches in Accra.");
    expect(result?.projectDetails).not.toContain("Timeline:");
  });

  it("rejects a budget that is not one of the published ranges", () => {
    const result = composeQualification({
      budgetRange: "GHS 999999",
      timeline: "Whenever",
      note: "",
      strategyCall: true,
    });
    expect(result?.errors.budgetRange).toBeTruthy();
    expect(result?.errors.timeline).toBeTruthy();
  });
});

describe("published proof", () => {
  it("does not ship unverified client names or quotes", () => {
    const blob = JSON.stringify({ publishedCaseStudies, publishedTestimonials });
    expect(blob).not.toMatch(/Ebenezer|Akosua|LensCraft|TasteBuds|Stanley|Benizer/i);
    expect(publishedCaseStudies).toEqual([]);
    expect(publishedTestimonials).toEqual([]);
  });
});
