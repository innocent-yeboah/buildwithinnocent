import { describe, expect, it } from "vitest";
import {
  DEFAULT_WHATSAPP_DIGITS,
  formatWhatsAppDisplay,
  resolveWhatsAppDigits,
  site,
} from "@/lib/site";

describe("WhatsApp number", () => {
  it("uses the owner's number when the env var is empty or still the old example", () => {
    expect(resolveWhatsAppDigits("")).toBe(DEFAULT_WHATSAPP_DIGITS);
    expect(resolveWhatsAppDigits(undefined)).toBe("233530710628");
    expect(resolveWhatsAppDigits("233201234567")).toBe("233530710628");
    expect(resolveWhatsAppDigits("+233 20 123 4567")).toBe("233530710628");
  });

  it("lets NEXT_PUBLIC_WHATSAPP_NUMBER override the default", () => {
    expect(resolveWhatsAppDigits("+44 7700 900123")).toBe("447700900123");
  });

  it("uses the public contact email, not the website domain", () => {
    expect(site.email).toBe("hello@offervaluewithinnocent.com");
    expect(site.url).toBe("https://buildwithinnocent.com");
  });

  it("shows +233 53 071 0628 and links to wa.me/233530710628", () => {
    expect(formatWhatsAppDisplay("233530710628")).toBe("+233 53 071 0628");
    expect(site.phoneDisplay).toBe("+233 53 071 0628");
    expect(site.phone).toBe("+233530710628");
    expect(site.whatsappUrl?.startsWith("https://wa.me/233530710628?")).toBe(true);
  });
});
