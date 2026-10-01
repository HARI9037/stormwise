import "server-only";

import type { WeatherInput } from "@/types/domain";

export type WeatherFetchResult =
  | { ok: true; weather: WeatherInput; provider: string }
  | { ok: false; code: "MISSING_KEY" | "REQUEST_FAILED" | "INVALID_RESPONSE"; message: string };

type ProviderPayload = {
  main?: { temp?: unknown; humidity?: unknown; rain?: unknown };
  wind?: { speed?: unknown };
  rain?: { [key: string]: unknown };
};

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Fetches a single location from the configured provider without exposing the key to the browser. */
export async function fetchCurrentWeather(location: string): Promise<WeatherFetchResult> {
  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    return { ok: false, code: "MISSING_KEY", message: "Live weather is not configured. Your manual values are still ready to analyze." };
  }

  const baseUrl = process.env.WEATHER_API_URL || "https://api.openweathermap.org/data/2.5/weather";
  const url = new URL(baseUrl);
  url.searchParams.set("q", location);
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "metric");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) {
      return { ok: false, code: "REQUEST_FAILED", message: "The live weather provider could not find fresh conditions. Continuing with manual input." };
    }
    const payload = (await response.json()) as ProviderPayload;
    const rain = payload.rain?.["1h"] ?? payload.rain?.["3h"] ?? 0;
    const temperature = payload.main?.temp;
    const humidity = payload.main?.humidity;
    const windSpeed = payload.wind?.speed;
    // OpenWeather reports wind in m/s. Convert to the canonical km/h unit.
    if (!finiteNumber(rain) || !finiteNumber(temperature) || !finiteNumber(humidity) || !finiteNumber(windSpeed)) {
      return { ok: false, code: "INVALID_RESPONSE", message: "The live weather response was incomplete. Continuing with manual input." };
    }
    return { ok: true, provider: "OpenWeather", weather: { rainfall: rain, windSpeed: windSpeed * 3.6, temperature, humidity, units: { rainfall: "MM", windSpeed: "KMH", temperature: "C" } } };
  } catch {
    return { ok: false, code: "REQUEST_FAILED", message: "Live weather timed out or was unreachable. Continuing with manual input." };
  } finally {
    clearTimeout(timeout);
  }
}
