import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(() => null),
}));

vi.mock("@/lib/notifications", () => ({
  sendLeadConfirmationEmail: vi.fn(async () => true),
  sendWhatsAppNotification: vi.fn(async () => true),
  sendOwnerLeadAlert: vi.fn(async () => true),
}));

import { POST } from "@/app/api/leads/route";
import { sendOwnerLeadAlert, sendWhatsAppNotification, sendLeadConfirmationEmail } from "@/lib/notifications";
import { resetRateLimits } from "@/lib/rate-limit";

const validBody = {
  fullName: "Ama Serwaa",
  phone: "0244000000",
  industry: "Food & Beverage",
  email: "",
  businessName: "",
  projectDetails: "",
};

function post(body: unknown, ip = "203.0.113.10") {
  return new NextRequest("http://localhost/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.clearAllMocks();
  });

  it("attempts owner notification and does not pretend the lead was saved when Supabase is missing", async () => {
    const response = await POST(post(validBody));
    const payload = (await response.json()) as {
      saved: boolean;
      notified: boolean;
      message: string;
    };

    expect(response.status).toBe(503);
    expect(payload.saved).toBe(false);
    expect(payload.notified).toBe(true);
    expect(payload.message.toLowerCase()).toContain("could not store");
    expect(sendOwnerLeadAlert).toHaveBeenCalledOnce();
    expect(sendWhatsAppNotification).toHaveBeenCalledOnce();
    expect(sendLeadConfirmationEmail).not.toHaveBeenCalled();
  });

  it("does not notify anyone when the honeypot is filled", async () => {
    const response = await POST(post({ ...validBody, bwi_hp: "https://spam.example" }, "203.0.113.11"));
    const payload = (await response.json()) as { ignored?: boolean };

    expect(response.status).toBe(200);
    expect(payload.ignored).toBe(true);
    expect(sendOwnerLeadAlert).not.toHaveBeenCalled();
    expect(sendWhatsAppNotification).not.toHaveBeenCalled();
  });

  it("keeps a strategy-call budget in the enquiry sent to the owner", async () => {
    const response = await POST(
      post(
        {
          ...validBody,
          source: "strategy-call",
          budgetRange: "GHS 15,000-50,000",
          timeline: "In 1-3 months",
          projectDetails: "Two branches.",
        },
        "203.0.113.13",
      ),
    );
    expect(response.status).toBe(503);
    expect(sendOwnerLeadAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        projectDetails: expect.stringContaining("Budget range: GHS 15,000-50,000"),
      }),
      expect.any(String),
    );
    const lead = vi.mocked(sendOwnerLeadAlert).mock.calls[0][0];
    expect(lead.projectDetails).toContain("Timeline: In 1-3 months");
    expect(lead.projectDetails).toContain("Two branches.");
  });

  it("rejects a budget that is not one of the published ranges", async () => {
    const response = await POST(
      post({ ...validBody, source: "strategy-call", budgetRange: "a million" }, "203.0.113.14"),
    );
    expect(response.status).toBe(422);
    expect(sendOwnerLeadAlert).not.toHaveBeenCalled();
  });

  it("rejects a lead that is missing a phone number", async () => {
    const response = await POST(post({ ...validBody, phone: "" }, "203.0.113.12"));
    expect(response.status).toBe(422);
    expect(sendOwnerLeadAlert).not.toHaveBeenCalled();
  });
});
