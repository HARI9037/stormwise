import { NextResponse } from "next/server";
import { analyze } from "@/domain";
import { normalizeAnalysisInput } from "@/domain/preprocessing";
import { validateAnalysisInput } from "@/domain/validation";
import type { RawAnalysisInput } from "@/types/domain";
import { fetchCurrentWeather } from "@/lib/weather";

export const runtime = "nodejs";

type RequestBody = RawAnalysisInput & { source?: "manual" | "live" };

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Send a valid JSON analysis request." }, { status: 400 });
  }

  const source = body.source ?? "manual";
  let candidate: RawAnalysisInput = body;
  let weatherStatus: { source: "manual" | "live"; provider?: string; fallback?: string } = { source: "manual" };

  if (source === "live") {
    const latitude = Number(body.latitude), longitude = Number(body.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return NextResponse.json({ error: "Valid latitude and longitude are required for live weather." }, { status: 400 });
    const live = await fetchCurrentWeather({ latitude, longitude });
    if (live.ok) {
      candidate = { ...body, weather: live.weather };
      weatherStatus = { source: "live", provider: live.provider };
    } else {
      return NextResponse.json({ error: live.message, weatherStatus: { source: "live", fallback: live.message } }, { status: 502 });
    }
  }

  const normalized = normalizeAnalysisInput(candidate);
  const validation = validateAnalysisInput(normalized);
  if (!validation.success) {
    return NextResponse.json({ error: "Please correct the highlighted fields.", issues: validation.issues }, { status: 422 });
  }

  try {
    const result = analyze(validation.data);
    return NextResponse.json({ result, weatherStatus });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The analysis could not be completed." }, { status: 422 });
  }
}
