import { describe, expect, it } from "vitest";
import { getBotReply } from "@/lib/chatbot";
import { responseTimePhrase } from "@/lib/site";

describe("getBotReply", () => {
  it("treats MoMo as a payment question, not a price question", () => {
    const reply = getBotReply("Can I pay with MoMo?");
    expect(reply.text.toLowerCase()).toContain("mobile money");
    expect(reply.text).not.toContain("GHS 5,400");
    expect(reply.link?.href).toBe("/demo/booking");
  });

  it("does not treat the letters try inside industry or country as a demo request", () => {
    const industry = getBotReply("Which industry do you build for?");
    expect(industry.link?.href).toBe("/industries");

    const country = getBotReply("What country do you work in?");
    expect(country.link?.href).not.toBe("/demo");
    expect(country.offerWhatsApp).toBe(true);
  });

  it("still answers a real demo question and a real price question", () => {
    expect(getBotReply("Can I try the demo?").link?.href).toBe("/demo");
    expect(getBotReply("How much does it cost?").text).toContain("GHS 5,400");
  });

  it("uses the same reply-time phrase as the rest of the site", () => {
    expect(getBotReply("What country do you work in?").text).toContain(responseTimePhrase);
    expect(getBotReply("I want to start").text).toContain(responseTimePhrase);
    expect(getBotReply("hello there").text).not.toContain("within the hour");
  });
});
