import { COST_ASSUMPTIONS } from "../../config";
import { DAMAGE_LABELS, type CostEstimate, type DamageSeverity, type DamageType, type PropertyType } from "../../types";

const roundTo = (value: number, increment: number): number => Math.round(value / increment) * increment;

export function estimateRepairCost(propertyValue: number, severity: DamageSeverity, damageType: DamageType, propertyType: PropertyType = "RESIDENTIAL"): CostEstimate {
  const severityRange = COST_ASSUMPTIONS.bySeverity[severity];
  const multiplier = COST_ASSUMPTIONS.byDamageType[damageType] * COST_ASSUMPTIONS.byPropertyType[propertyType];
  const rawMin = propertyValue * severityRange.min * multiplier;
  const rawMax = propertyValue * severityRange.max * multiplier;
  const min = Math.min(propertyValue, Math.max(0, roundTo(rawMin, COST_ASSUMPTIONS.roundingIncrement)));
  const roundedMax = Math.min(propertyValue, Math.max(min, roundTo(rawMax, COST_ASSUMPTIONS.roundingIncrement)));
  const max = rawMax > 0 && roundedMax === 0 ? COST_ASSUMPTIONS.roundingIncrement : roundedMax;
  const rangeLabel = `${COST_ASSUMPTIONS.currency} ${min.toLocaleString("en-IN")} – ${max.toLocaleString("en-IN")}`;
  return {
    min,
    max,
    currency: COST_ASSUMPTIONS.currency,
    rangeLabel,
    damagePercentageRange: { min: severityRange.min * multiplier, max: severityRange.max * multiplier },
    assumptions: [
      `${severity} uses ${(severityRange.min * 100).toFixed(1)}%–${(severityRange.max * 100).toFixed(1)}% of property value before multipliers.`,
      `${DAMAGE_LABELS[damageType]} uses a ${multiplier.toFixed(2)}x damage/property-type multiplier.`,
      `Values are rounded to the nearest ${COST_ASSUMPTIONS.roundingIncrement} ${COST_ASSUMPTIONS.currency}.`,
    ],
  };
}

export const calculateRepairCost = estimateRepairCost;
