"use client";

import { useEffect } from "react";

export const REFERRAL_STORAGE_KEY = "bwi_referral_code";

/**
 * Invisible helper on referral landing pages: remembers the code so the
 * lead form can attribute the referral even if the visitor browses
 * around before starting their project.
 */
export default function ReferralTracker({ code }: { code: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(REFERRAL_STORAGE_KEY, code);
    } catch {
      // Storage unavailable (private mode) — attribution simply degrades.
    }
  }, [code]);

  return null;
}
