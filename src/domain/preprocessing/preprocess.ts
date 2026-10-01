import { CANONICAL_WEATHER_UNITS } from "../../config";
import type {
  AnalysisInput,
  PreprocessingChange,
  PreprocessingResult,
  PropertyType,
  RawAnalysisInput,
} from "../../types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function numericValue(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed === "") return value;
  const parsed = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : value;
}

function canonicalPropertyType(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const normalized = value.trim().toUpperCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, PropertyType> = {
    RESIDENTIAL: "RESIDENTIAL",
    HOME: "RESIDENTIAL",
    HOUSE: "RESIDENTIAL",
    COMMERCIAL: "COMMERCIAL",
    BUSINESS: "COMMERCIAL",
    OTHER: "OTHER",
  };
  return aliases[normalized] ?? value;
}

function unitValue(value: unknown, defaultUnit: string): string {
  if (typeof value !== "string" || value.trim() === "") return defaultUnit;
  return value.trim().toUpperCase().replace(/[\s\/_-]+/g, "");
}

function convertLength(value: unknown, unit: string, factor: number): unknown {
  return typeof value === "number" && Number.isFinite(value) && unit === "IN"
    ? value * factor
    : value;
}

function convertWind(value: unknown, unit: string): unknown {
  if (typeof value !== "number" || !Number.isFinite(value)) return value;
  if (unit === "MPH") return value * 1.609344;
  if (unit === "MS") return value * 3.6;
  return value;
}

function convertTemperature(value: unknown, unit: string): unknown {
  return typeof value === "number" && Number.isFinite(value) && unit === "F"
    ? (value - 32) * (5 / 9)
    : value;
}

function recordChange(
  changes: PreprocessingChange[],
  path: string,
  before: unknown,
  after: unknown,
  reason: string,
): void {
  if (Object.is(before, after)) return;
  changes.push({ path, before, after, reason });
}

/**
 * Normalize API/form payloads without filling missing required values. Missing
 * values remain missing so validation can return a useful field-level error.
 */
export function preprocessAnalysisInput(raw: unknown): PreprocessingResult {
  const changes: PreprocessingChange[] = [];
  const warnings: string[] = [];
  const source = isRecord(raw) ? raw : {};
  const rawWeather = isRecord(source.weather) ? source.weather : {};
  const rawUnits = isRecord(rawWeather.units) ? rawWeather.units : {};

  const rainfallUnit = unitValue(
    rawWeather.rainfallUnit ?? rawUnits.rainfall,
    CANONICAL_WEATHER_UNITS.rainfall,
  );
  const windUnit = unitValue(
    rawWeather.windSpeedUnit ?? rawUnits.windSpeed,
    CANONICAL_WEATHER_UNITS.windSpeed,
  );
  const temperatureUnit = unitValue(
    rawWeather.temperatureUnit ?? rawUnits.temperature,
    CANONICAL_WEATHER_UNITS.temperature,
  );

  const rainfallBefore = numericValue(rawWeather.rainfall);
  const windBefore = numericValue(rawWeather.windSpeed);
  const temperatureBefore = numericValue(rawWeather.temperature);
  const humidityBefore = numericValue(rawWeather.humidity);
  const propertyRecord = isRecord(source.property) ? source.property : {};
  const propertyValueBefore = numericValue(propertyRecord.value);
  const locationBefore = source.location;
  const locationAfter = typeof locationBefore === "string" ? locationBefore.trim() : locationBefore;
  const propertyTypeAfter = canonicalPropertyType(propertyRecord.type);

  const rainfallAfter = convertLength(rainfallBefore, rainfallUnit, 25.4);
  const windAfter = convertWind(windBefore, windUnit);
  const temperatureAfter = convertTemperature(temperatureBefore, temperatureUnit);

  recordChange(changes, "location", locationBefore, locationAfter, "Trimmed surrounding whitespace.");
  recordChange(changes, "weather.rainfall", rawWeather.rainfall, rainfallAfter, "Converted to millimetres and numeric form.");
  recordChange(changes, "weather.windSpeed", rawWeather.windSpeed, windAfter, "Converted to kilometres per hour and numeric form.");
  recordChange(changes, "weather.temperature", rawWeather.temperature, temperatureAfter, "Converted to degrees Celsius and numeric form.");
  recordChange(changes, "weather.humidity", rawWeather.humidity, humidityBefore, "Converted numeric text to a number.");
  recordChange(changes, "property.type", propertyRecord.type, propertyTypeAfter, "Normalized property category.");
  recordChange(changes, "property.value", propertyRecord.value, propertyValueBefore, "Converted numeric text to a number.");

  if (!["MM", "IN"].includes(rainfallUnit)) {
    warnings.push(`Unsupported rainfall unit '${rainfallUnit}'. Validation will reject it if conversion was required.`);
  }
  if (!["KMH", "MPH", "MS"].includes(windUnit)) {
    warnings.push(`Unsupported wind speed unit '${windUnit}'. Validation will reject it if conversion was required.`);
  }
  if (!["C", "F"].includes(temperatureUnit)) {
    warnings.push(`Unsupported temperature unit '${temperatureUnit}'. Validation will reject it if conversion was required.`);
  }

  // Preserve an unsupported unit in the normalized payload so the validator
  // can reject it instead of silently treating the value as metric.
  const normalizedUnits = {
    rainfall: ["MM", "IN"].includes(rainfallUnit) ? "MM" : rainfallUnit,
    windSpeed: ["KMH", "MPH", "MS"].includes(windUnit) ? "KMH" : windUnit,
    temperature: ["C", "F"].includes(temperatureUnit) ? "C" : temperatureUnit,
  } as unknown as NonNullable<AnalysisInput["weather"]["units"]>;

  const input: AnalysisInput = {
    location: locationAfter as string,
    weather: {
      rainfall: rainfallAfter as number,
      windSpeed: windAfter as number,
      temperature: temperatureAfter as number,
      humidity: humidityBefore as number,
      units: normalizedUnits,
    },
    property: {
      type: propertyTypeAfter as PropertyType,
      value: propertyValueBefore as number,
    },
  };

  return { input, changes, warnings };
}

export function normalizeAnalysisInput(raw: RawAnalysisInput | unknown): AnalysisInput {
  return preprocessAnalysisInput(raw).input as AnalysisInput;
}
