import type { DamageType, DamageSeverity, Recommendation, RiskLevel, WeatherFlags } from "../../types";

export function generateRecommendations(risk: RiskLevel, damageType: DamageType, severity: DamageSeverity, flags: WeatherFlags): Recommendation[] {
  const recommendations: Recommendation[] = [
    { id: "GENERAL-SIMULATION", priority: "LOW", message: "Use this output as an informational simulation, not an insurance or engineering assessment.", rationale: "The rule engine provides approximate decision support from manually entered conditions." },
  ];
  if (flags.heavyRain) recommendations.push({ id: "WEATHER-WATER", priority: risk === "HIGH" ? "HIGH" : "MEDIUM", message: "Check drainage paths and protect exposed electrical equipment from water accumulation.", rationale: "HeavyRain evaluated TRUE." });
  if (flags.highWind) recommendations.push({ id: "WEATHER-WIND", priority: risk === "HIGH" ? "HIGH" : "MEDIUM", message: "Secure loose outdoor objects and avoid exposed areas during strong wind.", rationale: "HighWind evaluated TRUE." });
  if (flags.extremeTemperature) recommendations.push({ id: "WEATHER-TEMPERATURE", priority: "MEDIUM", message: "Monitor temperature-sensitive equipment, pipes, and building materials.", rationale: "ExtremeTemperature evaluated TRUE." });
  if (flags.highHumidity) recommendations.push({ id: "WEATHER-HUMIDITY", priority: "LOW", message: "Monitor damp areas and ventilation to reduce mould or moisture-related issues.", rationale: "HighHumidity evaluated TRUE." });
  if (risk === "HIGH") recommendations.push({ id: "RISK-HIGH", priority: "HIGH", message: "Prioritise preventive measures and follow official local weather guidance before property checks.", rationale: "Multiple critical weather conditions combined." });
  else if (risk === "MEDIUM") recommendations.push({ id: "RISK-MEDIUM", priority: "MEDIUM", message: "Monitor changing conditions and review the relevant precautions.", rationale: "A notable condition is present without a high-risk combination." });
  else recommendations.push({ id: "RISK-LOW", priority: "LOW", message: "Continue monitoring local conditions and schedule routine property maintenance.", rationale: "No notable weather condition was detected." });
  if (damageType === "STRUCTURAL" || severity === "SEVERE") recommendations.push({ id: "SAFETY-SEVERE", priority: "HIGH", message: "Do not enter visibly damaged areas; seek qualified local assistance if damage is suspected.", rationale: "The simulated severity is SEVERE." });
  return recommendations;
}

export const getRecommendations = generateRecommendations;
