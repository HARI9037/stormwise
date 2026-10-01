import { describe, expect, it } from "vitest";
import { analyze, analyzeSafe } from "../../src/domain";

const input = (rainfall: number, windSpeed: number) => ({
  location: "Kochi",
  weather: { rainfall, windSpeed, temperature: 29, humidity: 80 },
  property: { type: "RESIDENTIAL", value: 5_000_000 },
});

describe("complete analysis pipeline", () => {
  it("normalizes string form values and returns every result stage", () => {
    const result = analyze({
      location: "Kochi",
      weather: { rainfall: "120", windSpeed: "75", temperature: "29", humidity: "88" },
      property: { type: "Residential", value: "5000000" },
    });
    expect(result.input.weather).toMatchObject({ rainfall: 120, windSpeed: 75, temperature: 29, humidity: 88 });
    expect(result.flags).toMatchObject({ heavyRain: true, highWind: true, extremeTemperature: false, highHumidity: true });
    expect(result.risk.level).toBe("HIGH");
    expect(result.damage.type).toBe("COMBINED_WEATHER");
    expect(result.severity.severity).toBe("SEVERE");
    expect(result.cost.min).toBeGreaterThan(0);
    expect(result.ruleTrace.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("produces a deterministic low-risk result", () => {
    const result = analyze(input(10, 10));
    expect(result.risk.level).toBe("LOW");
    expect(result.damage.type).toBe("NONE_MINIMAL");
    expect(result.severity.severity).toBe("MINOR");
    expect(result.cost.min).toBeLessThanOrEqual(result.cost.max);
    expect(result.ruleTrace.some((rule) => rule.expression.includes("AND"))).toBe(true);
  });

  it("shows the combined Boolean rule for high risk", () => {
    const result = analyze(input(120, 80));
    expect(result.risk.level).toBe("HIGH");
    expect(result.damage.type).toBe("COMBINED_WEATHER");
    expect(result.severity.severity).toBe("SEVERE");
    expect(result.ruleTrace.find((rule) => rule.id === "R5")?.result).toBe(true);
    expect(result.ruleTrace.find((rule) => rule.id === "R7")?.result).toBe(false);
  });

  it("offers a non-throwing adapter for API responses", () => {
    const response = analyzeSafe({ weather: {}, property: {} });
    expect(response.success).toBe(false);
    if (!response.success) expect(response.issues.length).toBeGreaterThan(0);
  });
});
