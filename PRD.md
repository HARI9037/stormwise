# Product Requirements Document (PRD)

## Project
**Weather Damage Prediction & Repair Cost Estimation System — Web Application**

## Course Context
**Subject:** Logic System Design (LSD)

**Project Type:** Team course project, implemented as a solo-built web application for development efficiency.

## Version
**MVP 1.0 — Web Edition**

---

## 1. Product Overview

The Weather Damage Prediction & Repair Cost Estimation System is a browser-based simulation and prediction application that analyzes weather conditions and property information to estimate:

- Weather-related risk
- Possible damage type
- Damage severity
- Approximate repair-cost range
- Explainable reasons behind the result
- Basic recommendations

The original academic project concept is preserved, but the implementation target is changed from a MATLAB/App Designer-first application to a **usable web application**.

The web application must demonstrate the Logic System Design concepts at the center of the project, especially **Boolean decision-making using AND, OR, and NOT**, deterministic rules, threshold-based classification, and an explainable decision trace.

The system should prioritize a reliable, understandable end-to-end workflow over unnecessary AI complexity.

> **Academic positioning:** This is an academic simulation and decision-support prototype. It must not present its repair estimates as certified insurance, engineering, or professional assessments.

---

## 2. Problem Statement

Extreme weather conditions such as heavy rainfall, strong winds, storms, and extreme temperatures can contribute to property damage. Users often do not have an immediate, understandable estimate of the potential risk, likely damage category, or approximate financial impact.

The system addresses this by converting weather and property inputs into an explainable sequence of decisions:

**Input → Risk → Boolean Rules → Damage Prediction → Severity → Cost → Recommendations**

---

## 3. Product Goals

1. Accept weather and property information.
2. Validate and preprocess inputs.
3. Detect potentially dangerous weather conditions.
4. Apply explicit Boolean rules using AND, OR, and NOT.
5. Classify overall risk as **Low, Medium, or High**.
6. Predict a plausible damage category.
7. Classify predicted damage severity as **Minor, Moderate, or Severe**.
8. Estimate an approximate repair-cost range.
9. Explain exactly which rules/conditions produced the result.
10. Show results through a clear interactive dashboard.
11. Work without a live weather API by supporting manual input.
12. Use the supplied Kaggle weather dataset where appropriate for analysis/experimentation, without inventing unavailable target labels.

---

## 4. Target Users

### Primary
- Homeowners/property owners
- Students and academic evaluators
- Demonstration users

### Secondary
- Insurance-related users
- Maintenance/construction teams
- Disaster-management use cases as a conceptual future extension

The MVP is an academic demonstration and simulation, not a production disaster-response or insurance system.

---

## 5. Scope

### 5.1 MVP In Scope

- Manual weather input
- Optional weather API input
- Property information input
- Input validation
- Data preprocessing
- Boolean/rule engine
- Risk classification
- Damage-type prediction
- Damage-severity classification
- Approximate repair-cost estimation
- Recommendations
- Explainable rule trace
- Dashboard
- Weather visualizations
- Sample/test scenarios
- Dataset ingestion and exploratory analysis
- Optional ML experiment only when the dataset supports a defensible target
- Local development
- Production deployment

### 5.2 Out of Scope for MVP

- Mobile app
- Image-based damage detection
- Insurance claim integration
- Automated emergency response
- Deep-learning system
- Continuous real-time monitoring
- Insurance-grade repair estimation
- Full GIS/map-based risk analysis
- Complex multi-agent architecture

---

## 6. Functional Requirements

### FR-01 — Weather Input

The user shall be able to enter:

- Rainfall
- Wind speed
- Temperature
- Humidity
- Location

### FR-02 — Property Input

The user shall be able to enter:

- Property type
- Property value

Suggested property types:
- Residential
- Commercial
- Other

### FR-03 — Input Validation

The system shall reject invalid or unreasonable values and show a useful validation message.

Validation must include:

- Required-field checks
- Numeric checks
- Non-negative rainfall/wind/property value checks
- Reasonable temperature/humidity ranges
- Valid property type
- Clear unit labels

The exact accepted ranges must be documented in code/configuration rather than hidden inside UI components.

### FR-04 — Weather API

The system may retrieve current weather information from a weather API using the entered location.

API integration must be optional from the user perspective.

### FR-05 — Manual Fallback

When the API fails, times out, returns unusable data, or is unavailable, manual input must continue to work.

The core risk/damage/cost pipeline must never depend entirely on the external API.

### FR-06 — Preprocessing

The system shall normalize and prepare inputs before analysis.

Examples:
- Unit normalization
- Missing-value handling
- Numeric conversion
- Category normalization
- Dataset cleaning

### FR-07 — Boolean Decision Engine

The system shall use explicit Boolean conditions involving:

- AND
- OR
- NOT

Example conceptual rules:

```text
HeavyRain = rainfall > RAIN_HEAVY_THRESHOLD
HighWind = windSpeed > WIND_HIGH_THRESHOLD
ExtremeTemperature = temperature < TEMP_LOW_THRESHOLD OR temperature > TEMP_HIGH_THRESHOLD
HighHumidity = humidity > HUMIDITY_HIGH_THRESHOLD

HighWeatherRisk = HeavyRain AND HighWind
DamageWarning = HeavyRain OR HighWind OR ExtremeTemperature
```

The actual numerical thresholds are **project assumptions unless supported by documented evidence or dataset-derived analysis**.

### FR-08 — Risk Classification

The system shall produce exactly one primary risk class:

- Low
- Medium
- High

The classification method shall be deterministic for the same rule/model configuration and input.

### FR-09 — Damage Prediction

The system shall identify a likely damage category from the weather/property conditions.

Initial categories may include:

- None/Minimal
- Water/Flood Damage
- Wind/Roof Damage
- Structural Damage
- Combined Weather Damage
- Temperature-related Property Risk
- Other

The project must clearly distinguish between:

1. **Rule-based damage prediction**, which is mandatory for the MVP.
2. **ML-based prediction**, which is experimental and only permitted when the available dataset supports a valid target.

### FR-10 — Damage Severity

The system shall classify the expected severity as:

- Minor
- Moderate
- Severe

Severity must be derived from documented rules and/or a validated experimental model. It must not be randomly generated.

### FR-11 — Repair Cost Estimation

The system shall calculate an approximate repair-cost range.

Base model:

```text
Estimated Repair Cost
= Property Value × Assumed Damage Percentage
```

The percentage must depend on documented project assumptions and may vary by damage type/severity.

Example only:

```text
Property Value = ₹50,00,000
Damage Percentage = 10%
Estimated Cost = ₹5,00,000
```

The UI must describe the result as an **approximate simulation estimate**.

### FR-12 — Recommendations

The system shall display basic precautions/recommendations based on the resulting risk and damage category.

### FR-13 — Explainability

For every analysis, the user shall be able to see:

- Important threshold checks
- Boolean conditions that evaluated to TRUE/FALSE
- The resulting risk decision
- Damage prediction reasoning
- Severity reasoning
- Cost assumptions used

### FR-14 — Dashboard

The dashboard shall display:

- Input weather conditions
- Property information
- Risk level
- Damage type
- Damage severity
- Estimated repair-cost range
- Alerts
- Recommendations
- Rule trace
- At least one useful visualization

### FR-15 — Scenario Testing

The system shall support repeatable test scenarios for:

1. Low-risk conditions
2. Medium-risk conditions
3. High-risk conditions
4. API failure/manual fallback

---

## 7. Core Decision Model

The system should follow a layered deterministic flow.

```text
USER INPUT
   ↓
VALIDATION
   ↓
PREPROCESSING
   ↓
WEATHER CONDITION FLAGS
   ↓
BOOLEAN / RULE ENGINE
   ↓
RISK LEVEL
   ↓
DAMAGE TYPE
   ↓
DAMAGE SEVERITY
   ↓
REPAIR COST RANGE
   ↓
RECOMMENDATIONS
   ↓
DASHBOARD + EXPLANATION
```

### Separation of responsibility

The rule engine must remain independent from the UI.

Thresholds, damage mappings, severity mappings, and cost assumptions should be stored in a dedicated configuration or domain layer.

---

## 8. Risk Rules

The implementation must create a documented rule table before coding the final rule engine.

Example structure:

| Rule ID | Condition | Operator | Result |
|---|---|---|---|
| R1 | Heavy rainfall | AND | High water risk when combined with poor conditions |
| R2 | High wind | OR | Wind damage warning |
| R3 | Heavy rainfall + high wind | AND | High combined-weather risk |
| R4 | No critical weather flag | NOT | Low-risk baseline |

The exact thresholds and rule weights are implementation decisions and must be recorded as assumptions.

---

## 9. Dataset Requirements

### Dataset Source

The project team plans to use the following Kaggle dataset:

https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset

### Important constraint

The provided dataset is a **weather prediction dataset**, not automatically a property-damage dataset.

Therefore:

- The agent must inspect the actual CSV/schema before deciding how it can be used.
- The agent must not invent a `damage` or `severity` target column if none exists.
- The dataset may be used for weather analysis, preprocessing, visualization, threshold experimentation, or ML experiments only where the available fields support that task.
- If the dataset does not contain a defensible damage/severity target, the mandatory MVP remains rule-based and ML remains an optional experimental extension.

### Dataset documentation required

The final project documentation shall include:

- Dataset source URL
- File name(s)
- Row count
- Column names
- Data types
- Missing-value summary
- Duplicate analysis
- Preprocessing steps
- Features used
- Target used, if any
- Train/test split, if ML is used
- Limitations

---

## 10. ML Requirements

ML is **not the foundation of the MVP**.

If the dataset supports a legitimate supervised target, the project may include a small interpretable model.

Possible workflow:

```text
Dataset
  ↓
Cleaning
  ↓
Feature Selection
  ↓
Train/Test Split
  ↓
Baseline Model
  ↓
Evaluation
  ↓
Comparison with Rule-Based Output
```

The project must report actual evaluation metrics if an ML model is used.

The project must not claim predictive accuracy without measured evidence.

---

## 11. Non-Functional Requirements

### NFR-01 — Usability

A first-time user should understand the form and result without reading technical documentation.

### NFR-02 — Performance

A normal manual analysis should complete quickly without noticeable delay.

### NFR-03 — Reliability

The application must continue to function when the weather API is unavailable.

### NFR-04 — Maintainability

Business rules and assumptions must not be hard-coded throughout UI components.

### NFR-05 — Explainability

Each final classification must have a traceable reason.

### NFR-06 — Reproducibility

Identical inputs with identical configuration/model versions must produce consistent rule-based results.

### NFR-07 — Security

The application must validate API responses, sanitize user inputs, and avoid unsafe server-side requests. API keys must be stored in environment variables.

### NFR-08 — Responsive UI

The application should work on desktop and mobile-sized screens, although a desktop browser is the primary academic-demo environment.

---

## 12. Suggested Web Architecture

```text
Browser
  ↓
Web UI
  ↓
Analysis API
  ├── Input Validation
  ├── Preprocessing
  ├── Weather Service
  ├── Boolean Rule Engine
  ├── Damage Predictor
  ├── Severity Classifier
  ├── Cost Estimator
  └── Recommendation Engine
        ↓
Results + Explainability
```

### Suggested technology direction

The implementation may use a single-repository TypeScript web stack to keep the project practical for one developer.

Suggested default:

- Next.js + TypeScript
- Tailwind CSS
- API routes/server actions for backend orchestration
- MongoDB Atlas for persistent project/application data if persistence is required
- CSV/JSON processing for the Kaggle dataset
- Recharts or a comparable charting library
- Zod or equivalent schema validation
- Vitest/Jest + Playwright for automated testing
- Vercel for deployment

The agent may replace a dependency when there is a clear technical reason, but unnecessary stack changes are prohibited.

---

## 13. Data Model

The project should distinguish between **dataset data** and **application database data**.

### Dataset data

Used for analysis/experiments and stored as CSV/processed data artifacts.

### Application data

If MongoDB is used, possible collections are:

- `analyses`
- `savedScenarios`
- `ruleConfigs` (optional)

Example analysis record:

```json
{
  "location": "Kochi",
  "weather": {
    "rainfall": 120,
    "windSpeed": 75,
    "temperature": 29,
    "humidity": 88
  },
  "property": {
    "type": "Residential",
    "value": 5000000
  },
  "result": {
    "risk": "High",
    "damageType": "Combined Weather Damage",
    "severity": "Severe",
    "estimatedCostRange": {
      "min": 400000,
      "max": 650000
    }
  },
  "ruleTrace": [],
  "createdAt": "ISO-8601 timestamp"
}
```

---

## 14. User Flow

```text
Open Website
   ↓
Enter Property Details
   ↓
Choose Weather Source
   ├── Live Weather API
   └── Manual Input
   ↓
Validate Inputs
   ↓
Analyze
   ↓
View Risk
   ↓
View Damage + Severity
   ↓
View Cost Range
   ↓
Inspect Rule Explanation
   ↓
Read Recommendations
   ↓
Optionally Save Scenario
```

---

## 15. Required UI Pages/Views

### 15.1 Home / Landing

Purpose:
- Explain what the tool does
- Show the core pipeline
- Provide an Analyze CTA

### 15.2 Analysis Page

Contains:
- Location
- Weather inputs
- Property inputs
- Weather source selection
- Analyze button
- Validation feedback

### 15.3 Results Dashboard

Contains:
- Risk card
- Damage card
- Severity card
- Cost-range card
- Weather summary
- Recommendations
- Boolean/rule trace
- Visualization

### 15.4 Dataset / Methodology View

Optional but strongly recommended for an academic demonstration.

Contains:
- Dataset source
- Feature summary
- Preprocessing notes
- Model/rule methodology
- Limitations

### 15.5 About / Project View

Contains:
- Course/project information
- Team information
- Academic disclaimer
- Technology stack

---

## 16. Acceptance Criteria

The MVP is complete only when all of the following are true:

- A user can enter valid weather/property information.
- Invalid values are rejected with clear messages.
- Analysis can run without a weather API.
- API failure falls back to manual input.
- Boolean AND/OR/NOT logic is visibly implemented in the domain logic.
- Risk is classified as Low/Medium/High.
- Damage type is produced.
- Severity is produced as Minor/Moderate/Severe.
- Repair cost is returned as an approximate range.
- Recommendations are returned.
- The result includes an explainable rule trace.
- At least four repeatable test scenarios pass.
- Dataset preprocessing is documented.
- No unsupported ML claim is made.
- The application has a usable dashboard.
- The full flow works end-to-end in a browser.
- Production build succeeds.

---

## 17. Test Scenarios

### Test 1 — Low Risk

Inputs:
- Low rainfall
- Low wind
- Normal temperature
- Normal humidity

Expected:
- Risk = Low
- Damage = None/Minimal or Minor
- Low estimated repair-cost range

### Test 2 — Medium Risk

Inputs:
- Moderate rainfall
- Moderate wind

Expected:
- Risk = Medium
- Moderate damage/severity result
- Moderate estimated cost

### Test 3 — High Risk

Inputs:
- Heavy rainfall
- High wind

Expected:
- Risk = High
- Severe or equivalent high-damage result
- Higher estimated cost
- Rule trace shows the critical Boolean combination

### Test 4 — API Failure

Inputs:
- Weather API unavailable

Expected:
- Manual entry remains available
- Analysis completes normally

### Additional recommended tests

- Invalid negative rainfall
- Humidity > 100%
- Missing property value
- Missing location in API mode
- API timeout
- Combined extreme weather conditions
- Property type boundary cases
- Cost calculation consistency

---

## 18. Academic Traceability

The website implementation must make the Logic System Design contribution obvious during evaluation.

The demo should be able to show:

1. Boolean variables derived from raw weather inputs.
2. AND/OR/NOT combinations.
3. Deterministic rule evaluation.
4. Risk state transitions.
5. Damage/severity mapping.
6. Explainable outputs.
7. Repeatable test cases.

The project should not become merely a generic weather dashboard with an AI label.

---

## 19. Future Scope

- Historical weather analytics
- More disaster categories
- Image-based damage assessment
- GIS integration
- Continuous monitoring
- Advanced ML/deep learning
- Insurance-system integration
- Mobile application
- Automated alert workflows

---

## 20. Final MVP Definition

The final product is a **web-based weather damage simulation and decision-support application** that accepts weather and property inputs, preprocesses them, applies an explainable Boolean/rule engine, classifies weather/property risk, predicts a plausible damage category and severity, estimates an approximate repair-cost range, and presents the complete result through an interactive dashboard.

The **rule-based pipeline is mandatory**. ML is optional and evidence-driven.

---

## 21. Final Project Pipeline

```text
WEATHER + PROPERTY INPUT
          ↓
     VALIDATION
          ↓
    PREPROCESSING
          ↓
  WEATHER CONDITION FLAGS
          ↓
 BOOLEAN / RULE ENGINE
          ↓
     RISK LEVEL
          ↓
     DAMAGE TYPE
          ↓
   DAMAGE SEVERITY
          ↓
   REPAIR COST RANGE
          ↓
 RECOMMENDATIONS + TRACE
          ↓
   WEB DASHBOARD
```
