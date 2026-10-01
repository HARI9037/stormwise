import { describe, expect, it } from "vitest";
import { preprocessAnalysisInput } from "../../src/domain/preprocessing";
import { validateAnalysisInput } from "../../src/domain/validation";

describe("validation and preprocessing", () => {
  it("normalizes numeric text, aliases, whitespace, and units", () => {
    const result = preprocessAnalysisInput({
      location: "  Kochi ",
      weather: { rainfall: "4", rainfallUnit: "IN", windSpeed: "10", windSpeedUnit: "MPH", temperature: "77", temperatureUnit: "F", humidity: "80" },
      property: { type: "Home", value: "5,000,000" },
    });
    expect(result.input).toMatchObject({ location: "Kochi", property: { type: "RESIDENTIAL", value: 5_000_000 } });
    expect((result.input as any).weather.rainfall).toBeCloseTo(101.6);
    expect((result.input as any).weather.windSpeed).toBeCloseTo(16.09344);
    expect((result.input as any).weather.temperature).toBeCloseTo(25);
    expect(validateAnalysisInput(result.input).success).toBe(true);
  });

  it("returns field-level errors without throwing", () => {
    const result = validateAnalysisInput({ location: "", weather: { rainfall: -1 }, property: { type: "INVALID", value: 0 } });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues.map((entry) => entry.path)).toEqual(expect.arrayContaining(["location", "weather.rainfall", "weather.windSpeed", "property.type", "property.value"]));
    }
  });
});
