export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "OTHER";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type DamageType = "NONE" | "NONE_MINIMAL" | "WATER_FLOOD" | "WIND_ROOF" | "COMBINED_WEATHER" | "TEMPERATURE" | "TEMPERATURE_RELATED" | "STRUCTURAL" | "OTHER";
export type DamageSeverity = "MINOR" | "MODERATE" | "SEVERE";
export interface WeatherInput { location?: string; rainfall: number; windSpeed: number; temperature: number; humidity: number; units?: { rainfall?: string; windSpeed?: string; temperature?: string }; }
export interface PropertyInput { type: PropertyType; value: number; }
export interface AnalysisInput { location: string; weather: WeatherInput; property: PropertyInput; }
export interface RawAnalysisInput { location?: unknown; weather?: any; property?: any; [key:string]: any; }
export interface Coordinates { latitude: number; longitude: number; }
export interface WeatherFlags { heavyRain: boolean; highWind: boolean; extremeTemperature: boolean; highHumidity: boolean; safeWeather: boolean; combinedWeatherRisk?: boolean; damageWarning?: boolean; moderateRain: boolean; moderateWind: boolean; }
export interface RuleEvaluation { id: string; name: string; expression: string; inputs: Record<string, boolean>; result: boolean; explanation: string; operator?: string; effect?: string; [key:string]: any; }
export interface RiskAssessment { level: RiskLevel; reason: string; ruleId?: string; [key:string]: any; }
export interface DamageAssessment { type: DamageType; label?: string; explanation: string; contributingConditions?: string[]; [key:string]: any; }
export interface SeverityAssessment { severity: DamageSeverity; reason: string; }
export interface CostEstimate { min: number; max: number; currency: "INR"; assumptions: string | string[]; rangeLabel?: string; [key:string]: any; }
export interface Recommendation { id?: string; title?: string; message: string; priority: "LOW" | "MEDIUM" | "HIGH"; rationale?: string; [key:string]: any; }
export interface PreprocessingChange { path: string; before: unknown; after: unknown; reason: string; }
export interface PreprocessingResult { input: RawAnalysisInput; changes: PreprocessingChange[]; warnings: string[]; }
export interface ValidationIssue { path: string; message: string; code?: string; }
export interface ValidationResult { success: boolean; data?: AnalysisInput; issues: ValidationIssue[]; }
export interface AnalysisResult { input: AnalysisInput; flags: WeatherFlags; ruleTrace: RuleEvaluation[]; risk: RiskAssessment; damage: DamageAssessment; severity: SeverityAssessment; cost: CostEstimate; recommendations: Recommendation[]; disclaimer: string; preprocessing: { changes: PreprocessingChange[]; warnings: string[] }; }
export const DAMAGE_LABELS: Record<DamageType, string> = { NONE: "None / Minimal", NONE_MINIMAL: "None / Minimal", WATER_FLOOD: "Water / Flood Damage", WIND_ROOF: "Wind / Roof Damage", COMBINED_WEATHER: "Combined Weather Damage", TEMPERATURE: "Temperature-related Property Risk", TEMPERATURE_RELATED: "Temperature-related Property Risk", STRUCTURAL: "Structural Damage", OTHER: "Other" };
