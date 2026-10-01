# Deterministic rule table

The domain engine in `src/domain/rules/boolean.ts` evaluates the conditions in
the table below in order. Thresholds are project assumptions, not official
meteorological or engineering limits. High comparisons are strict (`>`), while
the low-temperature comparison is strict (`<`).

| ID | Name | Boolean expression / threshold | Effect |
| --- | --- | --- | --- |
| R1 | Heavy rainfall | `rainfall > 100 mm` | Water/flood contributor |
| R2 | High wind | `wind speed > 70 km/h` | Wind/roof contributor |
| R3 | Extreme temperature | `temperature < 10°C OR temperature > 40°C` | Temperature-related contributor |
| R4 | High humidity | `humidity > 85%` | Dampness/mould warning |
| R5 | Combined weather | `HeavyRain AND HighWind` | Combined-weather condition |
| R6 | Weather warning | `HeavyRain OR HighWind OR ExtremeTemperature OR HighHumidity` | At least one notable warning |
| R7 | Safe baseline | `NOT (HeavyRain OR HighWind OR ExtremeTemperature OR HighHumidity)` | Candidate low-risk baseline |
| R8 | High risk | `(HeavyRain AND HighWind) OR (HeavyRain AND ExtremeTemperature) OR (HighWind AND ExtremeTemperature) OR (ExtremeTemperature AND HighHumidity)` | `HIGH` risk |
| R9 | Medium risk | `NOT HighWeatherRisk AND (ModerateRain OR ModerateWind OR HighHumidity OR ExtremeTemperature)` | `MEDIUM` risk |
| R10 | Low risk | `NOT HighWeatherRisk AND NOT MediumWeatherRisk` | `LOW` risk |

Moderate rainfall is `>= 50 mm`; moderate wind is `>= 40 km/h`. They support
R9 but do not independently mean severe damage. The ordered result precedence
is HIGH, then MEDIUM, then LOW.

Every rule emits an evaluation containing its `id`, expression, Boolean inputs,
result, effect, and explanation. This array is returned as `AnalysisResult.ruleTrace`.
