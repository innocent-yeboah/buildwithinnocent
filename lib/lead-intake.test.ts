import { describe, expect, it, vi } from "vitest";
import { intakeLead } from "@/lib/lead-intake";

const contact = { whatsapp: "https://wa.me/233200000000", email: "hello@buildwithinnocent.com" };

describe("intakeLead", () => {
  it("saves first and does not use the failure notifier when the database works", async () => {
    const save = vi.fn(async () => undefined);
    const afterSave = vi.fn(async () => undefined);
    const notifyOwner = vi.fn(async () => true);

    const result = await intakeLead({
      save,
      afterSave,
      notifyOwner,
      successMessage: "saved",
      contact,
    });

    expect(save).toHaveBeenCalledOnce();
    expect(afterSave).toHaveBeenCalledOnce();
    expect(notifyOwner).not.toHaveBeenCalled();
    expect(result).toMatchObject({ httpStatus: 201, saved: true, message: "saved" });
  });

  it("notifies the owner and returns an honest fallback when Supabase is not configured", async () => {
    const notifyOwner = vi.fn(async () => true);
    const afterSave = vi.fn(async () => undefined);

    const result = await intakeLead({
      save: null,
      afterSave,
      notifyOwner,
      successMessage: "saved",
      contact,
    });

    expect(afterSave).not.toHaveBeenCalled();
    expect(notifyOwner).toHaveBeenCalledOnce();
    expect(result.httpStatus).toBe(503);
    expect(result.saved).toBe(false);
    expect(result.notified).toBe(true);
    expect(result.message.toLowerCase()).toContain("could not store");
    expect(result.fallback).toEqual(contact);
  });

  it("still notifies the owner when the insert throws", async () => {
    const notifyOwner = vi.fn(async () => false);
    const result = await intakeLead({
      save: async () => {
        throw new Error("connection refused");
      },
      afterSave: vi.fn(async () => undefined),
      notifyOwner,
      successMessage: "saved",
      contact,
    });

    expect(notifyOwner).toHaveBeenCalledOnce();
    expect(result.saved).toBe(false);
    expect(result.notified).toBe(false);
    expect(result.message.toLowerCase()).toContain("message us directly");
  });
});
