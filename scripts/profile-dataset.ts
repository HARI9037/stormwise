/**
 * Lightweight CSV profiler with no third-party dependency.
 * Run with a TypeScript runner available in the host project, for example:
 *   npx tsx scripts/profile-dataset.ts
 *
 * It only reports files that actually exist under data/raw; it never creates
 * rows or infers a damage/severity target.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) { current += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { cells.push(current); current = ""; }
    else current += character;
  }
  cells.push(current);
  return cells;
}

function profile(filePath: string) {
  const lines = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length === 0) return { filename: filePath, rowCount: 0, columnCount: 0, columns: [] };
  const columns = parseCsvLine(lines[0]).map((name) => name.trim());
  const rows = lines.slice(1).map(parseCsvLine);
  const missing: Record<string, number> = {};
  const unique: Record<string, string[]> = {};
  const types: Record<string, string> = {};
  const ranges: Record<string, { min: number; max: number }> = {};
  for (let column = 0; column < columns.length; column += 1) {
    const values = rows.map((row) => (row[column] ?? "").trim());
    const nonEmpty = values.filter(Boolean);
    missing[columns[column]] = values.length - nonEmpty.length;
    const numbers = nonEmpty.map(Number).filter(Number.isFinite);
    types[columns[column]] = numbers.length === nonEmpty.length && nonEmpty.length > 0 ? "number" : "string";
    if (types[columns[column]] === "number") ranges[columns[column]] = { min: Math.min(...numbers), max: Math.max(...numbers) };
    else unique[columns[column]] = [...new Set(nonEmpty)].slice(0, 50);
  }
  const serialized = new Set(rows.map((row) => JSON.stringify(row)));
  return { filename: filePath, rowCount: rows.length, columnCount: columns.length, columns, types, missing, duplicateRows: rows.length - serialized.size, uniqueCategoricalValues: unique, numericalRanges: ranges };
}

const rawDirectory = resolve(process.cwd(), "data", "raw");
let report: unknown;
try {
  const files = readdirSync(rawDirectory).filter((file) => statSync(join(rawDirectory, file)).isFile() && file.toLowerCase().endsWith(".csv"));
  report = files.length === 0
    ? { status: "not_available", directory: rawDirectory, message: "No CSV dataset was acquired in this environment; no rows or labels were fabricated.", source: "https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset" }
    : { status: "profiled", files: files.map((file) => profile(join(rawDirectory, file))) };
} catch {
  report = { status: "not_available", directory: rawDirectory, message: "data/raw is not present or cannot be read; acquire the planned Kaggle file before profiling.", source: "https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset" };
}
console.log(JSON.stringify(report, null, 2));
