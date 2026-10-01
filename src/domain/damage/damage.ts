import type { DamageAssessment, DamageType, PropertyInput, RiskLevel, WeatherFlags } from "../../types";
import { and } from "../rules";

export function assessDamage(flags: WeatherFlags, risk: RiskLevel, property?: PropertyInput): DamageAssessment {
  const combined = and(flags.heavyRain, flags.highWind);
  if (combined) return { type: "COMBINED_WEATHER", explanation: "Heavy rain and high wind combine into a possible combined-weather damage pattern.", contributingConditions: ["HeavyRain", "HighWind"] };
  if (flags.heavyRain) return { type: "WATER_FLOOD", explanation: "Heavy rainfall can produce water accumulation and possible flood or water damage.", contributingConditions: ["HeavyRain"] };
  if (flags.highWind) return { type: "WIND_ROOF", explanation: "High wind can affect roofs, cladding, and unsecured external items.", contributingConditions: ["HighWind"] };
  if (flags.extremeTemperature && risk === "HIGH") return { type: "STRUCTURAL", explanation: "Extreme temperature combined with high risk is mapped to a possible structural property risk.", contributingConditions: ["ExtremeTemperature", "HIGH risk"] };
  if (flags.extremeTemperature) return { type: "TEMPERATURE_RELATED", explanation: "Extreme temperature may affect temperature-sensitive materials, pipes, or equipment.", contributingConditions: ["ExtremeTemperature"] };
  if (flags.highHumidity) return { type: "OTHER", explanation: "High humidity is treated as a dampness or mould warning rather than a confirmed damage event.", contributingConditions: ["HighHumidity"] };
  return { type: "NONE_MINIMAL", explanation: property ? `No primary weather damage trigger was detected for this ${property.type.toLowerCase()} property.` : "No primary weather damage trigger was detected.", contributingConditions: [] };
}

export const predictDamage = assessDamage;
