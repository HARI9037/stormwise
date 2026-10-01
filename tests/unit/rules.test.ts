import { describe, expect, it } from "vitest";
import { WEATHER_THRESHOLDS } from "../../src/config";
import { and, deriveWeatherFlags, evaluateBooleanRules, not, or } from "../../src/domain/rules";
import { classifyRisk } from "../../src/domain/risk";

const weather = (overrides: Partial<{ rainfall: number; windSpeed: number; temperature: number; humidity: number }> = {}) => ({
  rainfall: 10,
  windSpeed: 10,
  temperature: 25,
  humidity: 50,
  ...overrides,
});

describe("Boolean operators", () => {
  it("evaluates AND, OR, and NOT truth tables", () => {
    expect(and(true, true)).toBe(true);
    expect(and(true, false)).toBe(false);
    expect(or(false, true)).toBe(true);
    expect(or(false, false)).toBe(false);
    expect(not(true)).toBe(false);
    expect(not(false)).toBe(true);
  });
});

describe("weather flags and boundaries", () => {
  it("does not classify exact high thresholds as high", () => {
    const flags = deriveWeatherFlags(weather({
      rainfall: WEATHER_THRESHOLDS.rainfall.heavyMm,
      windSpeed: WEATHER_THRESHOLDS.windSpeed.highKmh,
      humidity: WEATHER_THRESHOLDS.humidity.highPercent,
      temperature: WEATHER_THRESHOLDS.temperature.highC,
    }));
    expect(flags.heavyRain).toBe(false);
    expect(flags.highWind).toBe(false);
    expect(flags.highHumidity).toBe(false);
    expect(flags.extremeTemperature).toBe(false);
    expect(flags.safeWeather).toBe(true);
  });

  it.each([
    [false, false, "LOW"],
    [true, false, "MEDIUM"],
    [false, true, "MEDIUM"],
    [true, true, "HIGH"],
  ] as const)("maps heavy rain=%s and high wind=%s to %s", (rain, wind, expected) => {
    const flags = deriveWeatherFlags(weather({ rainfall: rain ? 101 : 0, windSpeed: wind ? 71 : 0 }));
    expect(classifyRisk(flags)).toBe(expected);
    expect(evaluateBooleanRules(flags).find((rule) => rule.id === "R5")?.result).toBe(rain && wind);
  });

  it("uses the documented extreme-temperature and humidity AND rule", () => {
    const flags = deriveWeatherFlags(weather({ temperature: 45, humidity: 90 }));
    expect(classifyRisk(flags)).toBe("HIGH");
    expect(evaluateBooleanRules(flags).find((rule) => rule.id === "R8")?.inputs["ExtremeTemperature AND HighHumidity"]).toBe(true);
  });
});
