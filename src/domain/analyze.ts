import type { AnalysisInput, AnalysisResult } from "../types";
import { assessDamage } from "./damage";
import { estimateRepairCost } from "./cost";
import { preprocessAnalysisInput } from "./preprocessing";
import { generateRecommendations } from "./recommendations";
import { assessRisk } from "./risk";
import { evaluateBooleanRules, deriveWeatherFlags } from "./rules";
import { assessSeverity } from "./severity";
import { AnalysisInputValidationError, validateAnalysisInput } from "./validation";

/**
 * One deterministic domain entry point for a Next.js API route or server
 * action. It accepts unknown transport data, normalizes it, validates it, and
 * returns the complete explainable pipeline result. Invalid data throws
 * AnalysisInputValidationError with field-level issues.
 */
export function analyze(input: unknown): AnalysisResult {
  const preprocessing = preprocessAnalysisInput(input);
  const validation = validateAnalysisInput(preprocessing.input);
  if (!validation.success) throw new AnalysisInputValidationError(validation.issues);

  const normalizedInput: AnalysisInput = validation.data!;
  const flags = deriveWeatherFlags(normalizedInput.weather);
  const ruleTrace = evaluateBooleanRules(flags);
  const risk = assessRisk(flags, ruleTrace);
  const damage = assessDamage(flags, risk.level, normalizedInput.property);
  const severity = assessSeverity(risk.level, damage.type);
  const cost = estimateRepairCost(
    normalizedInput.property.value,
    severity.severity,
    damage.type,
    normalizedInput.property.type,
  );
  const recommendations = generateRecommendations(
    risk.level,
    damage.type,
    severity.severity,
    flags,
  );

  return {
    input: normalizedInput,
    flags,
    ruleTrace,
    risk,
    damage,
    severity,
    cost,
    recommendations,
    disclaimer: "This is a deterministic academic simulation and approximate cost estimate, not an insurance, engineering, or professional assessment.",
    preprocessing: {
      changes: preprocessing.changes,
      warnings: preprocessing.warnings,
    },
  };
}

export interface SafeAnalysisResult {
  success: true;
  data: AnalysisResult;
  issues: [];
}

export interface SafeAnalysisError {
  success: false;
  issues: import("../types").ValidationIssue[];
}

/** Non-throwing adapter for API routes that prefer a 400-style response. */
export function analyzeSafe(input: unknown): SafeAnalysisResult | SafeAnalysisError {
  try {
    return { success: true, data: analyze(input), issues: [] };
  } catch (error) {
    if (error instanceof AnalysisInputValidationError) return { success: false, issues: error.issues };
    throw error;
  }
}
