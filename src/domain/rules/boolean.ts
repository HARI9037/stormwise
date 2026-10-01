import { WEATHER_THRESHOLDS } from "../../config";
import type { RuleEvaluation, WeatherFlags, WeatherInput } from "../../types";

/** Named operators keep the academic AND/OR/NOT decisions visible and testable. */
export const and = (...values: boolean[]): boolean => values.every(Boolean);
export const or = (...values: boolean[]): boolean => values.some(Boolean);
export const not = (value: boolean): boolean => !value;

export function deriveWeatherFlags(weather: WeatherInput): WeatherFlags {
  const heavyRain = weather.rainfall > WEATHER_THRESHOLDS.rainfall.heavyMm;
  const moderateRain = weather.rainfall >= WEATHER_THRESHOLDS.rainfall.moderateMm;
  const highWind = weather.windSpeed > WEATHER_THRESHOLDS.windSpeed.highKmh;
  const moderateWind = weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.moderateKmh;
  const extremeTemperature = or(
    weather.temperature < WEATHER_THRESHOLDS.temperature.lowC,
    weather.temperature > WEATHER_THRESHOLDS.temperature.highC,
  );
  const highHumidity = weather.humidity > WEATHER_THRESHOLDS.humidity.highPercent;
  const safeWeather = not(or(heavyRain, highWind, extremeTemperature, highHumidity));

  return {
    heavyRain,
    moderateRain,
    highWind,
    moderateWind,
    extremeTemperature,
    highHumidity,
    safeWeather,
  };
}

const thresholdRule = (
  id: string,
  name: string,
  condition: boolean,
  label: string,
  thresholdText: string,
  effect: string,
): RuleEvaluation => ({
  id,
  name,
  expression: label,
  operator: "THRESHOLD",
  inputs: { [label]: condition },
  result: condition,
  effect,
  explanation: condition
    ? `${label} evaluated TRUE (${thresholdText}).`
    : `${label} evaluated FALSE (${thresholdText}).`,
});

/** Return an ordered explainable trace of all threshold and Boolean rules. */
export function evaluateBooleanRules(flags: WeatherFlags): RuleEvaluation[] {
  const combinedWeatherRisk = and(flags.heavyRain, flags.highWind);
  const warning = or(
    flags.heavyRain,
    flags.highWind,
    flags.extremeTemperature,
    flags.highHumidity,
  );
  const highWeatherRisk = or(
    combinedWeatherRisk,
    and(flags.heavyRain, flags.extremeTemperature),
    and(flags.highWind, flags.extremeTemperature),
    and(flags.extremeTemperature, flags.highHumidity),
  );
  const moderateWeatherRisk = and(
    not(highWeatherRisk),
    or(
      flags.moderateRain,
      flags.moderateWind,
      flags.highHumidity,
      flags.extremeTemperature,
    ),
  );
  const lowWeatherRisk = not(or(highWeatherRisk, moderateWeatherRisk));

  return [
    thresholdRule("R1", "Heavy rainfall", flags.heavyRain, "HeavyRain", `rainfall > ${WEATHER_THRESHOLDS.rainfall.heavyMm} mm`, "Contributes to water/flood damage."),
    thresholdRule("R2", "High wind", flags.highWind, "HighWind", `wind speed > ${WEATHER_THRESHOLDS.windSpeed.highKmh} km/h`, "Contributes to wind/roof damage."),
    thresholdRule("R3", "Extreme temperature", flags.extremeTemperature, "ExtremeTemperature", `temperature < ${WEATHER_THRESHOLDS.temperature.lowC}°C OR > ${WEATHER_THRESHOLDS.temperature.highC}°C`, "Contributes to temperature-related property risk."),
    thresholdRule("R4", "High humidity", flags.highHumidity, "HighHumidity", `humidity > ${WEATHER_THRESHOLDS.humidity.highPercent}%`, "Adds a dampness/mould warning factor."),
    {
      id: "R5",
      name: "Combined weather condition",
      expression: "HeavyRain AND HighWind",
      operator: "AND",
      inputs: { HeavyRain: flags.heavyRain, HighWind: flags.highWind },
      result: combinedWeatherRisk,
      effect: "A combined-weather condition is present.",
      explanation: combinedWeatherRisk ? "Heavy rainfall and high wind were detected together." : "Heavy rainfall and high wind were not both detected.",
    },
    {
      id: "R6",
      name: "Weather damage warning",
      expression: "HeavyRain OR HighWind OR ExtremeTemperature OR HighHumidity",
      operator: "OR",
      inputs: { HeavyRain: flags.heavyRain, HighWind: flags.highWind, ExtremeTemperature: flags.extremeTemperature, HighHumidity: flags.highHumidity },
      result: warning,
      effect: "At least one notable weather warning is present.",
      explanation: warning ? "At least one notable weather condition was detected." : "No notable weather warning condition was detected.",
    },
    {
      id: "R7",
      name: "Safe weather baseline",
      expression: "NOT (HeavyRain OR HighWind OR ExtremeTemperature OR HighHumidity)",
      operator: "NOT",
      inputs: { HeavyRain: flags.heavyRain, HighWind: flags.highWind, ExtremeTemperature: flags.extremeTemperature, HighHumidity: flags.highHumidity },
      result: flags.safeWeather,
      effect: "Provides the low-risk baseline when no warning is active.",
      explanation: flags.safeWeather ? "No critical weather flag is active, so NOT(warning) is TRUE." : "At least one critical weather flag is active, so NOT(warning) is FALSE.",
    },
    {
      id: "R8",
      name: "High weather risk",
      expression: "(HeavyRain AND HighWind) OR (HeavyRain AND ExtremeTemperature) OR (HighWind AND ExtremeTemperature) OR (ExtremeTemperature AND HighHumidity)",
      operator: "OR",
      inputs: { "HeavyRain AND HighWind": combinedWeatherRisk, "HeavyRain AND ExtremeTemperature": and(flags.heavyRain, flags.extremeTemperature), "HighWind AND ExtremeTemperature": and(flags.highWind, flags.extremeTemperature), "ExtremeTemperature AND HighHumidity": and(flags.extremeTemperature, flags.highHumidity) },
      result: highWeatherRisk,
      effect: "Classifies the weather as HIGH risk when multiple critical hazards combine.",
      explanation: highWeatherRisk ? "Multiple critical weather hazards combined." : "No high-risk combination was detected.",
    },
    {
      id: "R9",
      name: "Medium weather risk",
      expression: "NOT HighWeatherRisk AND (ModerateRain OR ModerateWind OR HighHumidity OR ExtremeTemperature)",
      operator: "AND",
      inputs: { HighWeatherRisk: highWeatherRisk, "ModerateRain OR ModerateWind OR HighHumidity OR ExtremeTemperature": or(flags.moderateRain, flags.moderateWind, flags.highHumidity, flags.extremeTemperature) },
      result: moderateWeatherRisk,
      effect: "Classifies a single or moderate warning as MEDIUM risk.",
      explanation: moderateWeatherRisk ? "A warning is present without a high-risk combination." : "No medium-risk condition was detected after excluding high risk.",
    },
    {
      id: "R10",
      name: "Low weather risk",
      expression: "NOT HighWeatherRisk AND NOT MediumWeatherRisk",
      operator: "NOT",
      inputs: { HighWeatherRisk: highWeatherRisk, MediumWeatherRisk: moderateWeatherRisk },
      result: lowWeatherRisk,
      effect: "Selects LOW risk when neither medium nor high risk applies.",
      explanation: lowWeatherRisk ? "Neither high-risk nor medium-risk conditions were found." : "A medium or high-risk condition takes precedence over the low baseline.",
    },
  ];
}

export const evaluateRules = evaluateBooleanRules;
