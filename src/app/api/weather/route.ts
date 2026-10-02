import { NextResponse } from "next/server";
import { fetchCurrentWeather } from "@/lib/weather";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { latitude?: unknown; longitude?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Send valid JSON coordinates." }, { status: 400 }); }
  const latitude = Number(body.latitude), longitude = Number(body.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return NextResponse.json({ error: "Latitude and longitude must be valid coordinates." }, { status: 400 });
  const result = await fetchCurrentWeather({ latitude, longitude });
  return result.ok ? NextResponse.json(result) : NextResponse.json({ error: result.message, code: result.code }, { status: 502 });
}
