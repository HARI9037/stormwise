import type { DamageSeverity, DamageType, RiskLevel, SeverityAssessment } from "../../types";

export function assessSeverity(risk: RiskLevel, damageType: DamageType): SeverityAssessment {
  if (risk === "HIGH") return { severity: "SEVERE", reason: "HIGH risk maps to SEVERE simulated damage severity." };
  if (risk === "MEDIUM") return { severity: "MODERATE", reason: "MEDIUM risk maps to MODERATE simulated damage severity." };
  return { severity: "MINOR", reason: damageType === "NONE_MINIMAL" ? "LOW risk with no primary damage trigger maps to MINOR severity." : "LOW risk maps to MINOR simulated damage severity." };
}

export function classifySeverity(risk: RiskLevel, damageType: DamageType): DamageSeverity {
  return assessSeverity(risk, damageType).severity;
}
