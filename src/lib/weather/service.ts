import "server-only";
import type { WeatherInput } from "@/types/domain";

export type Coordinates = { latitude: number; longitude: number };
export type WeatherFetchResult =
  | { ok: true; weather: WeatherInput; provider: string }
  | { ok: false; code: "REQUEST_FAILED" | "INVALID_RESPONSE"; message: string };

function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }

export async function fetchCurrentWeather({ latitude, longitude }: Coordinates): Promise<WeatherFetchResult> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) return { ok: false, code: "REQUEST_FAILED", message: "The live weather provider could not find fresh conditions." };
    const current = ((await response.json()) as { current?: Record<string, unknown> }).current;
    const rainfall = current?.precipitation, temperature = current?.temperature_2m;
    const humidity = current?.relative_humidity_2m, windSpeed = current?.wind_speed_10m;
    if (![rainfall, temperature, humidity, windSpeed].every(finite)) return { ok: false, code: "INVALID_RESPONSE", message: "The live weather response was incomplete." };
    return { ok: true, provider: "Open-Meteo", weather: { rainfall: rainfall as number, windSpeed: windSpeed as number, temperature: temperature as number, humidity: humidity as number, units: { rainfall: "MM", windSpeed: "KMH", temperature: "C" } } };
  } catch { return { ok: false, code: "REQUEST_FAILED", message: "Live weather timed out or was unreachable." }; }
  finally { clearTimeout(timeout); }
}
