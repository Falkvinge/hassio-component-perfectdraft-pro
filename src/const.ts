export const DOMAIN = "perfectdraft";
export const KEG_TOTAL_VOLUME_ML = 6000;

export const GLASS_SIZES = [
  { value: 250, label: "250 mL", description: "Small glass" },
  { value: 330, label: "330 mL", description: "Bottle / standard" },
  { value: 500, label: "500 mL", description: "Half litre" },
  { value: 568, label: "568 mL", description: "Pint (UK)" },
  { value: 473, label: "473 mL", description: "Pint (US)" },
] as const;

export const DEFAULT_GLASS_SIZE = 330;
export const DEFAULT_BEER = "stella-artois";

export const FRESHNESS_THRESHOLDS = {
  WARNING: 14,
  URGENT: 7,
  CRITICAL: 3,
  EXPIRED: 0,
} as const;

export type FreshnessTier = "normal" | "warning" | "urgent" | "critical" | "expired";

export function getFreshnessTier(daysRemaining: number | null): FreshnessTier {
  if (daysRemaining === null) return "normal";
  if (daysRemaining <= FRESHNESS_THRESHOLDS.EXPIRED) return "expired";
  if (daysRemaining <= FRESHNESS_THRESHOLDS.CRITICAL) return "critical";
  if (daysRemaining <= FRESHNESS_THRESHOLDS.URGENT) return "urgent";
  if (daysRemaining <= FRESHNESS_THRESHOLDS.WARNING) return "warning";
  return "normal";
}
