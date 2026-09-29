/** Published partnership figures. Module prices live in the calculator. */
export const COMPLETE_SYSTEM_PRICE = 5400;
export const MONTHLY_PAYMENT = 1000;
export const MONTHLY_MONTHS = 6;

export type EstimateBreakdown = {
  displayTotal: number;
  upfront: number;
  onDelivery: number;
  /** Negative when the itemized modules are capped at the partnership price. */
  bundleAdjustment: number;
};

/**
 * The figure shown is the itemized module total, capped at the published
 * partnership price. The two halves always add back to that figure.
 */
export function estimateBreakdown(itemizedTotal: number): EstimateBreakdown {
  const displayTotal = Math.min(itemizedTotal, COMPLETE_SYSTEM_PRICE);
  const upfront = Math.round(displayTotal / 2);
  return {
    displayTotal,
    upfront,
    onDelivery: displayTotal - upfront,
    bundleAdjustment: displayTotal - itemizedTotal,
  };
}
