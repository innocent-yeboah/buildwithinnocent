import { describe, expect, it } from "vitest";
import { industries, normalizeLead, validateLead, type LeadInput } from "@/lib/leads";

const valid: LeadInput = {
  fullName: "Ama Serwaa",
  businessName: "",
  email: "",
  phone: "0244000000",
  industry: "Food & Beverage",
  projectDetails: "",
};

describe("validateLead", () => {
  it("accepts name, WhatsApp number, and type of business without email or project details", () => {
    expect(validateLead(valid)).toEqual({});
  });

  it("does not require a 20 character project note", () => {
    expect(validateLead({ ...valid, projectDetails: "Short note" })).toEqual({});
  });

  it("rejects a missing phone number and an unknown industry", () => {
    const errors = validateLead({ ...valid, phone: "12", industry: "Spa" });
    expect(errors.phone).toBeTruthy();
    expect(errors.industry).toBeTruthy();
  });

  it("checks email only when one is provided", () => {
    expect(validateLead({ ...valid, email: "not-an-email" }).email).toBeTruthy();
    expect(validateLead({ ...valid, email: "ama@shop.com" }).email).toBeUndefined();
  });

  it("does not list Spa first", () => {
    expect(industries[0]).not.toMatch(/spa/i);
    expect(industries).toContain("Spa & Wellness");
  });
});

describe("normalizeLead", () => {
  it("trims and lowercases email", () => {
    const lead = normalizeLead({
      ...valid,
      fullName: "  Ama  ",
      email: "  Ama@Shop.com ",
    });
    expect(lead.fullName).toBe("Ama");
    expect(lead.email).toBe("ama@shop.com");
  });
});
