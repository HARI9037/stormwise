import { INPUT_LIMITS } from "../../config";
import type {
  AnalysisInput,
  PropertyType,
  ValidationIssue,
  ValidationResult,
} from "../../types";

const PROPERTY_TYPES: readonly PropertyType[] = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "OTHER",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const issue = (
  path: string,
  code: ValidationIssue["code"],
  message: string,
): ValidationIssue => ({ path, code, message });

function requireFiniteNumber(
  value: unknown,
  path: string,
  label: string,
  minimum: number,
  maximum: number,
  issues: ValidationIssue[],
): value is number {
  if (value === undefined || value === null || value === "") {
    issues.push(issue(path, "required", `${label} is required.`));
    return false;
  }
  if (typeof value !== "number") {
    issues.push(issue(path, "type", `${label} must be a number.`));
    return false;
  }
  if (!Number.isFinite(value)) {
    issues.push(issue(path, "finite", `${label} must be finite.`));
    return false;
  }
  if (value < minimum) {
    issues.push(issue(path, "min", `${label} must be at least ${minimum}.`));
  }
  if (value > maximum) {
    issues.push(issue(path, "max", `${label} must be at most ${maximum}.`));
  }
  return value >= minimum && value <= maximum;
}

/**
 * Validate the canonical, already-preprocessed shape. No browser-only or
 * dependency-specific schema is required, so this function also works in a
 * Next.js route and in a serverless runtime without Zod installed.
 */
export function validateAnalysisInput(input: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      success: false,
      issues: [issue("", "type", "Analysis input must be an object.")],
    };
  }

  const location = input.location;
  if (location === undefined || location === null || location === "") {
    issues.push(issue("location", "required", "Location is required."));
  } else if (typeof location !== "string") {
    issues.push(issue("location", "type", "Location must be a string."));
  } else if (location.trim().length < INPUT_LIMITS.locationLength.min) {
    issues.push(issue("location", "min", "Location cannot be blank."));
  } else if (location.length > INPUT_LIMITS.locationLength.max) {
    issues.push(
      issue(
        "location",
        "max",
        `Location must be at most ${INPUT_LIMITS.locationLength.max} characters.`,
      ),
    );
  }

  const weather = input.weather;
  if (!isRecord(weather)) {
    issues.push(issue("weather", "required", "Weather information is required."));
  }

  const weatherRecord = isRecord(weather) ? weather : {};
  requireFiniteNumber(
    weatherRecord.rainfall,
    "weather.rainfall",
    "Rainfall",
    INPUT_LIMITS.rainfallMm.min,
    INPUT_LIMITS.rainfallMm.max,
    issues,
  );
  requireFiniteNumber(
    weatherRecord.windSpeed,
    "weather.windSpeed",
    "Wind speed",
    INPUT_LIMITS.windSpeedKmh.min,
    INPUT_LIMITS.windSpeedKmh.max,
    issues,
  );
  requireFiniteNumber(
    weatherRecord.temperature,
    "weather.temperature",
    "Temperature",
    INPUT_LIMITS.temperatureC.min,
    INPUT_LIMITS.temperatureC.max,
    issues,
  );
  requireFiniteNumber(
    weatherRecord.humidity,
    "weather.humidity",
    "Humidity",
    INPUT_LIMITS.humidityPercent.min,
    INPUT_LIMITS.humidityPercent.max,
    issues,
  );

  if (weatherRecord.units !== undefined) {
    if (!isRecord(weatherRecord.units)) {
      issues.push(issue("weather.units", "type", "Weather units must be an object."));
    } else {
      const units = weatherRecord.units;
      if (units.rainfall !== "MM") {
        issues.push(issue("weather.units.rainfall", "unit", "Rainfall must be normalized to MM."));
      }
      if (units.windSpeed !== "KMH") {
        issues.push(issue("weather.units.windSpeed", "unit", "Wind speed must be normalized to KMH."));
      }
      if (units.temperature !== "C") {
        issues.push(issue("weather.units.temperature", "unit", "Temperature must be normalized to C."));
      }
    }
  }

  const property = input.property;
  if (!isRecord(property)) {
    issues.push(issue("property", "required", "Property information is required."));
  }
  const propertyRecord = isRecord(property) ? property : {};
  if (!PROPERTY_TYPES.includes(propertyRecord.type as PropertyType)) {
    issues.push(
      issue(
        "property.type",
        propertyRecord.type === undefined || propertyRecord.type === null
          ? "required"
          : "enum",
        `Property type must be one of ${PROPERTY_TYPES.join(", ")}.`,
      ),
    );
  }
  requireFiniteNumber(
    propertyRecord.value,
    "property.value",
    "Property value",
    INPUT_LIMITS.propertyValue.min,
    INPUT_LIMITS.propertyValue.max,
    issues,
  );

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: input as unknown as AnalysisInput,
    issues: [],
  };
}

export class AnalysisInputValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    super(
      issues.length === 1
        ? issues[0].message
        : `Analysis input is invalid (${issues.length} issues).`,
    );
    this.name = "AnalysisInputValidationError";
    this.issues = issues;
  }
}

export function assertValidAnalysisInput(input: unknown): asserts input is AnalysisInput {
  const result = validateAnalysisInput(input);
  if (!result.success) {
    throw new AnalysisInputValidationError(result.issues);
  }
}

export function parseAnalysisInput(input: unknown): AnalysisInput {
  assertValidAnalysisInput(input);
  return input;
}
