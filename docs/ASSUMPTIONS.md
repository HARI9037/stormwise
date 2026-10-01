# Domain assumptions

This project is an academic decision-support simulation. It is not an
insurance quote, structural assessment, emergency system, or professional
weather forecast.

## Inputs

- Canonical weather units are millimetres, km/h, °C, and relative humidity %.
- Accepted manual limits are configured in `src/config/thresholds.ts`:
  rainfall 0–2,000 mm, wind 0–400 km/h, temperature -80–70 °C, humidity 0–100%,
  and property value ₹1–₹1,000,000,000,000.
- Text numbers, commas, surrounding whitespace, common property aliases, and
  Fahrenheit/imperial units can be normalized before validation.
- Missing values are not silently defaulted; validation returns field-level
  issues.

## Decision model

- Risk is deterministic and based on the Boolean rule trace, not a trained ML
  model. See `docs/RULES.md`.
- Combined heavy rain/high wind is classified as high risk. One moderate or
  single warning condition is medium risk. No warning is low risk.
- Damage type is a plausible category, not a claim that damage is present.
- Severity maps HIGH → SEVERE, MEDIUM → MODERATE, and LOW → MINOR.

## Cost model

`src/config/costAssumptions.ts` contains every cost assumption. Cost is the
property value multiplied by a severity percentage range, a damage-type
multiplier, and a property-type multiplier. Results are rounded to the nearest
₹100 and capped at the property value. The range is an approximate simulation
only.

## Dataset and ML

The planned source is the Kaggle weather prediction dataset:
<https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset>.
No Kaggle data was available in this environment. No rows, damage labels, or
severity labels have been fabricated. The mandatory MVP therefore remains
rule-based. See `docs/DATASET.md` and `scripts/profile-dataset.ts`.
