import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/health/route";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

function get(token?: string) {
  return GET(
    new NextRequest("http://localhost/api/health", {
      headers: token ? { "x-health-token": token } : {},
    }),
  );
}

describe("GET /api/health", () => {
  it("returns ok or degraded without naming integrations", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.HEALTH_DETAIL_TOKEN;

    const response = await get();
    const body = (await response.json()) as { status: string; integrations?: unknown };

    expect(response.status).toBe(503);
    expect(body.status).toBe("degraded");
    expect(body.integrations).toBeUndefined();
    expect(JSON.stringify(body)).not.toMatch(/supabase|resend|whatsapp/i);
  });

  it("includes integration details only with the matching token", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
    process.env.HEALTH_DETAIL_TOKEN = "health-secret";

    const hidden = await get("wrong");
    const hiddenBody = (await hidden.json()) as { integrations?: unknown };
    expect(hidden.status).toBe(200);
    expect(hiddenBody.integrations).toBeUndefined();

    const shown = await get("health-secret");
    const shownBody = (await shown.json()) as { status: string; integrations: { supabase: boolean } };
    expect(shownBody.status).toBe("ok");
    expect(shownBody.integrations.supabase).toBe(true);
  });
});
