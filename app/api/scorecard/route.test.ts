import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(() => null),
}));

vi.mock("@/lib/notifications", () => ({
  sendScorecardResultEmail: vi.fn(async () => false),
  sendWhatsAppNotification: vi.fn(async () => false),
  sendOwnerEmail: vi.fn(async () => false),
}));

import { POST } from "@/app/api/scorecard/route";
import { sendOwnerEmail, sendWhatsAppNotification } from "@/lib/notifications";
import { resetRateLimits } from "@/lib/rate-limit";

const contact = {
  fullName: "Ama Serwaa",
  email: "ama@shop.com",
  businessName: "Ama's Shop",
  phone: "",
};

function answers(values: number[]) {
  const record: Record<string, number> = {};
  values.forEach((value, index) => {
    record[`q${index + 1}`] = value;
  });
  return record;
}

function post(body: unknown, ip = "203.0.113.40") {
  return new NextRequest("http://localhost/api/scorecard", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/scorecard", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.clearAllMocks();
  });

  it("returns the score and does not pretend it was saved when Supabase is missing", async () => {
    const response = await POST(post({ ...contact, answers: answers([2, 2, 2, 1, 0, 0, 0, 0, 0, 0]) }));
    const payload = (await response.json()) as {
      saved: boolean;
      message: string;
      result: { total: number; tier: string; startHere: string };
    };

    expect(response.status).toBe(200);
    expect(payload.saved).toBe(false);
    expect(payload.message.toLowerCase()).not.toContain("database");
    expect(payload.message.toLowerCase()).toContain("not saved");
    expect(payload.result.total).toBe(7);
    expect(payload.result.tier).toBe("AI-curious, lots of opportunity");
    expect(payload.result.startHere).toBe("Revenue goals");
    expect(sendOwnerEmail).toHaveBeenCalledOnce();
    expect(sendWhatsAppNotification).toHaveBeenCalledOnce();
  });

  it("scores 8 as Building momentum and 15 as AI-forward on the server", async () => {
    const eight = await POST(
      post({ ...contact, answers: answers([2, 2, 2, 2, 0, 0, 0, 0, 0, 0]) }, "203.0.113.41"),
    );
    const eightBody = (await eight.json()) as { result: { total: number; tier: string } };
    expect(eightBody.result.total).toBe(8);
    expect(eightBody.result.tier).toBe("Building momentum, ready to scale");

    const fifteen = await POST(
      post({ ...contact, answers: answers([2, 2, 2, 2, 2, 2, 2, 1, 0, 0]) }, "203.0.113.42"),
    );
    const fifteenBody = (await fifteen.json()) as { result: { total: number; tier: string } };
    expect(fifteenBody.result.total).toBe(15);
    expect(fifteenBody.result.tier).toBe("AI-forward, time to optimize");
  });

  it("does not notify anyone when the honeypot is filled", async () => {
    const response = await POST(
      post({ ...contact, answers: answers([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), bwi_hp: "spam" }, "203.0.113.43"),
    );
    const payload = (await response.json()) as { ignored?: boolean; result?: unknown };

    expect(response.status).toBe(200);
    expect(payload.ignored).toBe(true);
    expect(payload.result).toBeUndefined();
    expect(sendOwnerEmail).not.toHaveBeenCalled();
    expect(sendWhatsAppNotification).not.toHaveBeenCalled();
  });

  it("rejects a submission that is missing an email", async () => {
    const response = await POST(
      post({ ...contact, email: "", answers: answers([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) }, "203.0.113.44"),
    );
    expect(response.status).toBe(422);
    expect(sendWhatsAppNotification).not.toHaveBeenCalled();
  });
});
