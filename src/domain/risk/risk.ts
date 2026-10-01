import type { RiskAssessment, RiskLevel, RuleEvaluation, WeatherFlags } from "../../types";
import { evaluateBooleanRules } from "../rules";

function resultOf(trace: RuleEvaluation[], id: string): boolean {
  return trace.find((rule) => rule.id === id)?.result ?? false;
}

export function assessRisk(flags: WeatherFlags, trace: RuleEvaluation[] = evaluateBooleanRules(flags)): RiskAssessment {
  if (resultOf(trace, "R8")) return { level: "HIGH", ruleId: "R8", reason: "Multiple critical weather conditions combined." };
  if (resultOf(trace, "R9")) return { level: "MEDIUM", ruleId: "R9", reason: "A notable weather condition is present without a high-risk combination." };
  return { level: "LOW", ruleId: "R10", reason: "No notable or combined critical weather condition was detected." };
}

export function classifyRisk(flags: WeatherFlags, trace?: RuleEvaluation[]): RiskLevel {
  return assessRisk(flags, trace).level;
}

export const calculateRisk = classifyRisk;
