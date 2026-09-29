import { describe, expect, it } from "vitest";
import { getBotReply, quickQuestions } from "@/lib/chatbot";
import { responseTimePhrase, site } from "@/lib/site";

describe("getBotReply", () => {
  it("treats MoMo as a payment question, not a price question", () => {
    const reply = getBotReply("Can I pay with MoMo?");
    expect(reply.text.toLowerCase()).toContain("mobile money");
    expect(reply.text).not.toContain("GHS 5,400");
    expect(reply.link?.href).toBe("/demo/booking");
    expect(reply.confirmsOnCall).toBeUndefined();
  });

  it("answers mobile money and card from the published payment line", () => {
    expect(getBotReply("Do you accept mobile money?").text).toMatch(/MTN, Telecel, and AT/);
    const card = getBotReply("Can customers pay by card?");
    expect(card.text).toMatch(/card/);
    expect(card.confirmsOnCall).toBeUndefined();
  });

  it("does not invent bank transfer", () => {
    const reply = getBotReply("Can I pay by bank transfer?");
    expect(reply.text).toMatch(/does not list bank transfer/);
    expect(reply.text).toMatch(/strategy call/);
    expect(reply.confirmsOnCall).toBe(true);
    expect(reply.link?.href).toBe("/strategy-call");
  });

  it("answers deposit with the published 50% upfront", () => {
    const reply = getBotReply("How much is the deposit?");
    expect(reply.text).toContain(site.offer.upfront);
    expect(reply.text).toContain("upfront");
    expect(reply.confirmsOnCall).toBeUndefined();
  });

  it("answers how long and timeline from the 5-week process", () => {
    for (const question of ["How long does it take?", "What is the timeline?"]) {
      const reply = getBotReply(question);
      expect(reply.text).toMatch(/Five weeks/);
      expect(reply.text).toMatch(/Week 1/);
      expect(reply.link?.href).toBe("/how-it-works");
      expect(reply.confirmsOnCall).toBeUndefined();
    }
  });

  it("answers what is included without inventing extras", () => {
    const reply = getBotReply("What is included?");
    expect(reply.text).toMatch(/first year/);
    expect(reply.text).toMatch(/Mobile Money and card/);
    expect(reply.link?.href).toBe("/what-we-build");
  });

  it("answers the first year after launch", () => {
    const reply = getBotReply("What happens after launch?");
    expect(reply.text).toMatch(/first year/);
    expect(reply.text).toMatch(/not a later invoice/);
    expect(reply.link?.href).toBe("/how-it-works");
  });

  it("explains the strategy call and how to book it", () => {
    const reply = getBotReply("How does the strategy call work?");
    expect(reply.text).toMatch(/recommendation/);
    expect(reply.text).toMatch(/type of business/);
    expect(reply.text).toContain(responseTimePhrase);
    expect(reply.link?.href).toBe("/strategy-call");
    expect(getBotReply("How do I book?").link?.href).toBe("/strategy-call");
  });

  it("says Innocent builds it himself", () => {
    const reply = getBotReply("Who builds it?");
    expect(reply.text).toMatch(/Innocent builds it himself/);
    expect(reply.link?.href).toBe("/about");
  });

  it("does not treat the letters try inside industry or country as a demo request", () => {
    const industry = getBotReply("Which industry do you build for?");
    expect(industry.link?.href).toBe("/industries");

    const country = getBotReply("What country do you work in?");
    expect(country.link?.href).not.toBe("/demo");
    expect(country.text).toMatch(/Ghana/);
    expect(country.text).toMatch(/Africa/);
    expect(country.confirmsOnCall).toBe(true);
    expect(country.text).toContain(responseTimePhrase);
  });

  it("links the guarantee to the terms and does not invent a refund", () => {
    const reply = getBotReply("What is your refund policy?");
    expect(reply.text).toContain(site.promise);
    expect(reply.text).toMatch(/does not set a refund/);
    expect(reply.link?.href).toBe("/terms");
    expect(reply.confirmsOnCall).toBe(true);
  });

  it("gives the published WhatsApp number and email", () => {
    const whatsapp = getBotReply("What is your WhatsApp number?");
    expect(whatsapp.text).toContain(site.phoneDisplay);
    expect(whatsapp.offerWhatsApp).toBe(true);
    expect(whatsapp.confirmsOnCall).toBeUndefined();

    const email = getBotReply("What is your email?");
    expect(email.text).toContain(site.email);
    expect(email.text).toContain(responseTimePhrase);
  });

  it("still answers a real demo question and a real price question", () => {
    expect(getBotReply("Can I try the demo?").link?.href).toBe("/demo");
    expect(getBotReply("How much does it cost?").text).toContain("GHS 5,400");
  });

  it("uses the same reply-time phrase as the rest of the site", () => {
    expect(getBotReply("I want to start").text).toContain(responseTimePhrase);
    expect(getBotReply("hello there").text).not.toContain("within the hour");
  });

  it("maps each opening chip to a published answer", () => {
    const expected: Record<string, string> = {
      "How long does it take?": "/how-it-works",
      "What is included?": "/what-we-build",
      "Can I pay with MoMo?": "/demo/booking",
      "How do I book?": "/strategy-call",
      "Who builds it?": "/about",
    };
    expect(quickQuestions).toEqual(Object.keys(expected));
    for (const question of quickQuestions) {
      const reply = getBotReply(question);
      expect(reply.link?.href).toBe(expected[question]);
      expect(reply.confirmsOnCall).toBeUndefined();
    }
  });
});
