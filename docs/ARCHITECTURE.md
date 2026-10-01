# Domain architecture

The domain layer is transport- and UI-independent. A Next.js route can call
`analyze(requestBody)` from `src/domain`; it accepts unknown request data,
normalizes it, validates it, and returns a complete result. Invalid input
throws `AnalysisInputValidationError` with `issues`; routes that prefer a
non-throwing response can call `analyzeSafe`.

```text
unknown request body
  → preprocessAnalysisInput
  → validateAnalysisInput
  → deriveWeatherFlags
  → evaluateBooleanRules (AND / OR / NOT + trace)
  → assessRisk
  → assessDamage
  → assessSeverity
  → estimateRepairCost
  → generateRecommendations
  → AnalysisResult
```

## Stable entry point

`src/domain/index.ts` re-exports the public types, configuration, orchestration,
and individual modules. The main interfaces are `AnalysisInput`,
`WeatherInput`, `PropertyInput`, `WeatherFlags`, `RuleEvaluation`,
`RiskAssessment`, `DamageAssessment`, `SeverityAssessment`, `CostEstimate`,
`Recommendation`, and `AnalysisResult`.

The output uses stable uppercase unions (`LOW | MEDIUM | HIGH`, etc.) so a
transport adapter can render labels independently. No React, Next.js route, or
browser API is imported by the domain modules.

## Configuration

Thresholds and validation bounds live in `src/config/thresholds.ts`; cost
percentages and multipliers live in `src/config/costAssumptions.ts`. Changing a
threshold or assumption does not require changing UI code.
