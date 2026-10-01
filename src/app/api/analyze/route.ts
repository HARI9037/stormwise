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
    const location = typeof body.location === "string" ? body.location.trim() : "";
    if (!location) return NextResponse.json({ error: "A location is required for live weather." }, { status: 400 });
    const live = await fetchCurrentWeather(location);
    if (live.ok) {
      candidate = { ...body, weather: live.weather };
      weatherStatus = { source: "live", provider: live.provider };
    } else {
      weatherStatus = { source: "manual", fallback: live.message };
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
