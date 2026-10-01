# Weather Damage Prediction & Repair Cost Estimation System

A **Logic System Design (LSD)** course project implemented as a usable web application.

> **Build objective:** Build the complete project as a single, testable, deployable website. The project must visibly demonstrate Boolean logic and deterministic decision-making rather than hiding the academic logic behind an opaque AI model.

---

## 0. Agent Mission

You are the primary software engineer responsible for implementing the entire project from an empty repository.

The repository will contain the project PRD at:

```text
./PRD.md
```

Treat `PRD.md` as the project requirements source of truth.

Your job is to turn that PRD into a polished, working web application that can be opened in a browser and demonstrated end-to-end.

### Non-negotiable outcome

The finished repository must provide:

```text
Input → Validation → Preprocessing → Boolean Logic → Risk → Damage → Severity → Cost → Recommendations → Dashboard
```

Do not stop after building a UI mockup. Build the actual functional pipeline.

---

# 1. Critical Engineering Rules

## Rule 1 — Read before coding

Before creating or modifying application code:

1. Read `PRD.md` completely.
2. Inspect the repository.
3. Identify existing files and configuration.
4. Check which tools/dependencies are already available.
5. Create a short implementation checklist in the repository issue/task notes or development log.

Do not overwrite an existing project blindly.

## Rule 2 — Do not invent dataset labels

The planned Kaggle source is:

```text
https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset
```

This is a weather prediction dataset. It must **not** automatically be treated as a damage/severity dataset.

Before designing any ML pipeline:

1. Obtain the actual dataset files.
2. Inspect columns.
3. Inspect data types.
4. Inspect missing values.
5. Inspect unique categorical values.
6. Identify possible target columns.
7. Determine whether a damage or severity target genuinely exists.

If there is no defensible damage/severity target, do not fabricate one.

In that situation:

- Keep rule-based damage prediction as the working MVP.
- Use the dataset for weather analysis/preprocessing/visualization.
- Optionally experiment with a weather-condition model only if it has a valid target.
- Document the limitation clearly.

## Rule 3 — Boolean logic is the academic core

The project is for **Logic System Design**.

Do not turn this into a generic CRUD dashboard.

The code must contain a dedicated rule/logic module implementing explicit Boolean conditions using:

- AND
- OR
- NOT

The UI must expose enough information for a faculty evaluator to understand how a result was produced.

## Rule 4 — No fake AI

Do not call a deterministic threshold table an "AI model".

Do not display made-up accuracy values.

Do not create fake training results.

Do not claim that the system predicts real-world damage accurately.

Use language such as:

- simulation
- estimate
- rule-based prediction
- experimental model
- approximate cost

unless actual evidence supports a stronger claim.

## Rule 5 — Manual mode must always work

The application must remain usable without a live weather API.

API failure must degrade gracefully:

```text
Live Weather
    ↓ failure
Manual Weather Input
    ↓
Normal Analysis Pipeline
```

## Rule 6 — Keep business logic out of UI components

UI components should collect/display data.

Domain modules should perform:

- validation
- rule evaluation
- damage classification
- severity classification
- cost estimation
- recommendations

## Rule 7 — Configuration over hard-coding

Keep thresholds and assumptions in one clearly documented place.

Example:

```text
config/
  thresholds.ts
  damageRules.ts
  costAssumptions.ts
```

Changing a threshold should not require searching through React/Next.js components.

## Rule 8 — Test every important rule

Every Boolean rule and every important boundary condition needs an automated test.

---

# 2. Default Technology Plan

Use the simplest reliable stack that produces a polished web product.

### Recommended default

- Next.js
- TypeScript
- Tailwind CSS
- MongoDB Atlas only where persistence is genuinely useful
- Zod for request/input schemas
- Recharts or an equivalent lightweight chart library
- Vitest/Jest for unit tests
- Playwright for browser/end-to-end tests
- Vercel for deployment

### Avoid unnecessary complexity

Do not add:

- microservices
- message queues
- Kubernetes
- event buses
- multiple databases
- authentication unless required
- vector databases
- agent frameworks
- LLM APIs for the core prediction pipeline

This project is small enough to remain a single application.

---

# 3. Repository Structure

Use a structure close to this:

```text
.
├── PRD.md
├── README.md
├── package.json
├── .env.example
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── analyze/
│   │   ├── results/
│   │   ├── methodology/
│   │   └── api/
│   ├── components/
│   ├── domain/
│   │   ├── validation/
│   │   ├── preprocessing/
│   │   ├── rules/
│   │   ├── damage/
│   │   ├── severity/
│   │   ├── cost/
│   │   └── recommendations/
│   ├── lib/
│   │   ├── weather/
│   │   ├── dataset/
│   │   └── db/
│   ├── config/
│   └── types/
├── data/
│   ├── raw/
│   ├── processed/
│   └── samples/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
└── public/
```

Adapt the exact structure to the framework actually installed, but preserve separation between UI and domain logic.

---

# 4. Phase 0 — Repository Discovery

Before implementation:

1. List repository files.
2. Read existing `package.json` if present.
3. Check Node/npm/pnpm/yarn/bun availability.
4. Check whether a framework is already configured.
5. Check Git status.
6. Check for environment files.
7. Read `PRD.md`.
8. Identify anything already implemented.

### Output of Phase 0

Create a small `docs/BUILD_STATUS.md` containing:

- Existing stack
- Existing files
- Detected gaps
- Planned architecture

Do not create duplicate frameworks in the same repository.

---

# 5. Phase 1 — Define the Domain Model

Create TypeScript types/interfaces for:

```text
WeatherInput
PropertyInput
AnalysisInput
WeatherFlags
RuleEvaluation
RiskLevel
DamageType
DamageSeverity
CostEstimate
Recommendation
AnalysisResult
```

Use literal unions/enums where appropriate.

Example conceptual types:

```ts
RiskLevel = "LOW" | "MEDIUM" | "HIGH"

DamageSeverity = "MINOR" | "MODERATE" | "SEVERE"
```

Do not allow arbitrary strings everywhere.

---

# 6. Phase 2 — Build the Validation Layer

Implement validation before any prediction logic.

Validate:

- rainfall
- wind speed
- temperature
- humidity
- location
- property type
- property value

Requirements:

- clear errors
- reusable schema
- server-side validation
- client-side validation where useful
- no trust in browser-only validation

Add unit tests for valid, invalid, boundary, missing, and malformed values.

---

# 7. Phase 3 — Build the Preprocessing Layer

Create deterministic preprocessing functions.

Responsibilities:

- numeric normalization
- unit normalization
- categorical cleanup
- missing-value handling
- safe defaults where allowed

Example principle:

```text
Raw Input
   ↓
Normalize
   ↓
Validated AnalysisInput
```

Do not silently hide important transformations. Log or expose them where relevant to methodology/debugging.

---

# 8. Phase 4 — Inspect and Ingest the Kaggle Dataset

Source:

```text
https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset
```

## Required dataset workflow

### Step 4.1 — Acquire dataset

Place downloaded source files under:

```text
data/raw/
```

Do not commit secrets.

If licensing or redistribution terms prevent committing the dataset, commit only scripts and documentation explaining how to obtain it.

### Step 4.2 — Profile dataset

Create a script that prints or saves:

- filename
- row count
- column count
- column names
- data types
- missing values
- duplicate count
- unique values for categorical columns
- numerical ranges

### Step 4.3 — Preprocess

Create:

```text
data/processed/
```

with documented transformations.

### Step 4.4 — Decide ML feasibility

Answer:

```text
Does this dataset contain a valid target for damage or severity prediction?
```

If NO:

```text
Do not fabricate a target.
Do not train fake damage labels.
Keep damage prediction rule-based.
```

If YES:

Document exactly:

- target field
- feature fields
- split strategy
- preprocessing
- model
- metrics
- limitations

### Step 4.5 — Add dataset methodology page

The website should display a concise dataset/methodology explanation for academic evaluation.

---

# 9. Phase 5 — Create the Boolean Rule Engine

This is the most important academic module.

Implement a dedicated domain module such as:

```text
src/domain/rules/
```

Suggested flow:

```text
WeatherInput
   ↓
condition flags
   ↓
Boolean rules
   ↓
RuleEvaluation[]
   ↓
RiskLevel
```

## Required Boolean operations

Implement real expressions equivalent to:

```text
HeavyRain AND HighWind
HeavyRain OR HighWind
NOT SafeWeather
```

Do not simply store labels and switch on them.

### Each rule should return an explanation

Example shape:

```ts
{
  id: "R3",
  name: "Combined Weather Risk",
  expression: "HeavyRain AND HighWind",
  inputs: {
    HeavyRain: true,
    HighWind: true
  },
  result: true,
  explanation: "Heavy rainfall and high wind were detected together."
}
```

### Create a rule table

Store a human-readable rule table in `docs/RULES.md`.

Include:

- Rule ID
- Name
- Boolean expression
- Thresholds used
- Output effect
- Explanation

---

# 10. Phase 6 — Risk Classification

Build deterministic Low/Medium/High classification.

Do not mix risk level and damage severity.

These are separate concepts:

```text
Risk Level:
LOW / MEDIUM / HIGH

Damage Severity:
MINOR / MODERATE / SEVERE
```

Possible approach:

```text
Critical conditions
    ↓
HIGH

Moderate conditions
    ↓
MEDIUM

No meaningful critical conditions
    ↓
LOW
```

The exact threshold logic must come from your documented rule design, not hidden assumptions.

Add tests for boundary values around every threshold.

---

# 11. Phase 7 — Damage Prediction

Implement the mandatory rule-based predictor first.

Example conceptual mapping:

```text
Heavy Rain
   → Water/Flood Damage

High Wind
   → Wind/Roof Damage

Heavy Rain AND High Wind
   → Combined Weather Damage

Extreme Temperature
   → Temperature-related Property Risk
```

The predictor may also use property type if justified.

Return both:

- damage type
- explanation

Do not claim certainty. Use wording such as:

```text
Predicted / Possible Damage
```

---

# 12. Phase 8 — Damage Severity

Implement deterministic severity classification.

Example conceptual mapping:

```text
LOW risk
  → MINOR

MEDIUM risk
  → MODERATE

HIGH risk
  → SEVERE
```

This mapping can be refined using damage conditions and property details, but it must remain documented and testable.

Return a reason for the classification.

---

# 13. Phase 9 — Repair Cost Estimator

Implement the approximate cost model.

Base concept:

```text
Property Value × Assumed Damage Percentage
```

Create configuration such as:

```text
Minor     → lower assumed percentage
Moderate  → medium assumed percentage
Severe    → higher assumed percentage
```

You may differentiate assumptions by damage type.

### Cost output requirement

Return a range, not a fake exact insurance quote.

Example:

```text
₹4.0L – ₹6.5L
```

The UI must show a note that this is a simulation estimate based on project assumptions.

### Tests

Test:

- low property value
- high property value
- each severity
- each damage type adjustment
- rounding
- currency formatting

---

# 14. Phase 10 — Recommendations Engine

Create a deterministic mapping from risk/damage/severity to basic recommendations.

Example categories:

```text
Low
→ Monitor conditions.

Heavy rain / flood risk
→ Protect exposed electrical equipment and monitor water accumulation.

High wind
→ Secure loose external objects and avoid exposed areas.

High combined risk
→ Prioritize preventive measures and monitor official weather information.
```

Recommendations are informational, not emergency-response commands.

---

# 15. Phase 11 — Weather API Integration

Implement a server-side weather service.

Requirements:

- API key in environment variable
- never expose secrets to the browser
- request timeout
- response validation
- graceful errors
- user-friendly fallback

Flow:

```text
Location
   ↓
Weather API
   ↓
Normalize Response
   ↓
WeatherInput
   ↓
Normal Analysis Pipeline
```

### Fallback behavior

If the API fails:

```text
API unavailable
   ↓
Show non-blocking error
   ↓
Enable manual weather fields
   ↓
Continue analysis
```

Do not make the dashboard unusable because an external service failed.

---

# 16. Phase 12 — Build the Analysis API

Expose a clean internal application endpoint/action.

Conceptual request:

```json
{
  "weather": {
    "rainfall": 120,
    "windSpeed": 75,
    "temperature": 29,
    "humidity": 88
  },
  "location": "Kochi",
  "property": {
    "type": "Residential",
    "value": 5000000
  }
}
```

Conceptual response:

```json
{
  "risk": "HIGH",
  "damageType": "COMBINED_WEATHER_DAMAGE",
  "severity": "SEVERE",
  "estimatedCost": {
    "min": 400000,
    "max": 650000,
    "currency": "INR"
  },
  "ruleTrace": [],
  "recommendations": []
}
```

Keep the internal domain engine independent from transport/API concerns.

---

# 17. Phase 13 — Build the Website UX

The website should feel like a real usable tool, not a classroom wireframe.

## Home page

Include:

- Project title
- One-sentence explanation
- Visual pipeline
- Analyze CTA
- Academic/simulation disclaimer

## Analysis page

Use a structured form:

### Weather
- Location
- Weather source
- Rainfall
- Wind speed
- Temperature
- Humidity

### Property
- Property type
- Property value

### Action
- Analyze button

Support a clear loading state.

## Results page

Display prominent cards for:

1. Risk
2. Damage type
3. Severity
4. Repair-cost range

Then show:

- Weather summary
- Property summary
- Recommendations
- Boolean rule trace
- Threshold information
- Visualization

---

# 18. Phase 14 — Add Visualizations

At minimum, provide useful visual output rather than decorative charts.

Recommended charts:

### Weather profile

Bar/radar/summary visualization of rainfall, wind, temperature, humidity.

### Risk factors

Display condition flags:

```text
Heavy Rain      TRUE
High Wind       TRUE
Extreme Temp    FALSE
High Humidity   TRUE
```

### Cost range

Show the estimated range visually.

Do not create charts whose values are not based on real computed outputs.

---

# 19. Phase 15 — Add Explainability

This is a major differentiator for the LSD presentation.

Create an expandable section:

```text
Why did the system classify this as HIGH?

✓ Heavy Rain = TRUE
✓ High Wind = TRUE
✗ Extreme Temperature = FALSE

R3: HeavyRain AND HighWind = TRUE

→ Combined Weather Risk = HIGH
```

Also explain:

```text
Risk → Damage
Damage → Severity
Severity → Cost assumption
```

The evaluator should be able to trace the entire decision path without reading source code.

---

# 20. Phase 16 — Add Sample Scenarios

Create a development/demo scenario set.

Example files:

```text
data/samples/low-risk.json
data/samples/medium-risk.json
data/samples/high-risk.json
data/samples/api-failure.md
```

The UI may provide quick-load demo scenarios.

This makes final presentation/demo much safer.

---

# 21. Phase 17 — Persistence (Optional but Recommended)

Use MongoDB Atlas only for useful persistence.

Good candidates:

- saved analyses
- saved scenarios
- project configuration/version

Do not store data simply to claim "database integration."

If persistence is implemented:

- validate server-side
- use environment variables
- handle connection failures
- avoid exposing secrets
- add indexes only where useful

If persistence is not necessary for the academic demo, keep the application functional without it.

---

# 22. Phase 18 — Testing

Testing is mandatory.

## Unit tests

Cover:

- validation
- preprocessing
- condition flags
- AND logic
- OR logic
- NOT logic
- risk classification
- damage prediction
- severity
- cost estimation
- recommendations

## Integration tests

Test the complete domain pipeline:

```text
AnalysisInput
   ↓
Validation
   ↓
Rules
   ↓
Risk
   ↓
Damage
   ↓
Severity
   ↓
Cost
   ↓
Result
```

## End-to-end tests

Use Playwright or the project's equivalent to verify:

1. Homepage loads.
2. Analysis form loads.
3. Valid input can be submitted.
4. Results are displayed.
5. Rule explanation is visible.
6. Manual fallback works.
7. Validation errors are visible.

---

# 23. Phase 19 — Required Rule Test Matrix

At minimum, test these logical combinations.

| Heavy Rain | High Wind | Expected Boolean Interpretation |
|---:|---:|---|
| FALSE | FALSE | No combined weather risk |
| TRUE | FALSE | Water-risk condition |
| FALSE | TRUE | Wind-risk condition |
| TRUE | TRUE | Combined weather risk |

Also test NOT logic explicitly.

Example:

```text
NOT (HeavyRain OR HighWind)
```

must behave correctly for all combinations.

Do not rely only on a few hand-written demo inputs.

---

# 24. Phase 20 — Accessibility and UX QA

Check:

- keyboard navigation
- form labels
- readable contrast
- error messages
- button states
- mobile layout
- loading states
- API failure state
- empty state
- result readability

Do not sacrifice clarity for visual effects.

---

# 25. Phase 21 — Security QA

Before deployment:

- move API keys to environment variables
- validate all input server-side
- validate weather API responses
- protect database credentials
- avoid logging secrets
- prevent arbitrary server-side URL fetching
- use HTTPS in deployment

If the weather service accepts a user-provided location only, do not build an unrestricted URL-fetch proxy.

---

# 26. Phase 22 — Documentation

Create:

```text
docs/
├── ARCHITECTURE.md
├── RULES.md
├── DATASET.md
├── TESTING.md
└── ASSUMPTIONS.md
```

### ARCHITECTURE.md

Document:

- application layers
- data flow
- major modules
- API flow

### RULES.md

Document:

- every Boolean rule
- thresholds
- operators
- outcome
- explanation

### DATASET.md

Document:

- Kaggle source
- schema
- preprocessing
- target decision
- ML decision
- limitations

### TESTING.md

Document:

- test strategy
- test counts
- scenarios
- known issues

### ASSUMPTIONS.md

Document:

- threshold assumptions
- cost percentages
- severity mapping
- dataset limitations
- API limitations

---

# 27. Phase 23 — Build the Academic Demo Mode

Create a way to demonstrate the project quickly in front of faculty.

The demo should have at least three one-click scenarios:

```text
LOW RISK DEMO
MEDIUM RISK DEMO
HIGH RISK DEMO
```

Each should populate the form and generate a deterministic result.

The high-risk demo should make the Boolean logic visually obvious.

---

# 28. Phase 24 — Quality Gate Before Calling It Done

Do not declare completion until all checks pass.

## Functional gate

```text
[ ] Input works
[ ] Validation works
[ ] Manual mode works
[ ] API mode works or is safely marked unavailable
[ ] API fallback works
[ ] Boolean AND works
[ ] Boolean OR works
[ ] Boolean NOT works
[ ] Risk classification works
[ ] Damage classification works
[ ] Severity works
[ ] Cost estimation works
[ ] Recommendations work
[ ] Rule trace works
[ ] Dashboard works
```

## Data gate

```text
[ ] Dataset was actually inspected
[ ] Schema documented
[ ] Missing values documented
[ ] No fabricated damage labels
[ ] ML claim is evidence-based
```

## Engineering gate

```text
[ ] Unit tests pass
[ ] Integration tests pass
[ ] E2E tests pass
[ ] Production build passes
[ ] No critical console errors
[ ] No secrets committed
[ ] Environment variables documented
```

## UX gate

```text
[ ] Desktop layout works
[ ] Mobile-sized layout works
[ ] Validation messages are understandable
[ ] Loading state works
[ ] Failure states work
[ ] Results are readable
[ ] Explanation is visible
```

---

# 29. Phase 25 — Deployment

Preferred deployment approach:

```text
GitHub
  ↓
Vercel
  ↓
Production Website
```

If MongoDB Atlas is used:

```text
Website
  ↓
Server-side application code
  ↓
MongoDB Atlas
```

If a separate weather API is used:

```text
Server-side app
  ↓
Weather Provider
```

Never expose provider secrets in client-side JavaScript.

### Deployment checklist

1. Create production environment variables.
2. Configure database connection if used.
3. Configure weather API credentials if used.
4. Build production bundle.
5. Run tests.
6. Deploy.
7. Open deployed URL.
8. Run manual smoke test.
9. Record production URL in `docs/BUILD_STATUS.md`.

---

# 30. Phase 26 — Browser Verification

After deployment or when a production-like dev server is available, use browser automation to verify the actual website.

Check:

- page loads
- navigation works
- form submission works
- results appear
- charts render
- rule trace expands
- API error handling works
- no critical console errors

A successful `npm run build` is not enough. The actual browser UI must be checked.

---

# 31. Suggested Commands

Use the package manager already established by the repository.

Typical commands:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
npm run start
```

Do not assume every command exists. Inspect `package.json` first.

---

# 32. Environment Variables

Create `.env.example` with only placeholder names.

Possible variables:

```text
WEATHER_API_KEY=
MONGODB_URI=
MONGODB_DB_NAME=
```

Use the actual provider/database names chosen by the implementation.

Never commit a real secret.

---

# 33. Definition of Done

The project is DONE only when a person can open the website and complete this journey:

```text
Open Website
   ↓
Enter Location
   ↓
Enter / Fetch Weather
   ↓
Enter Property Data
   ↓
Click Analyze
   ↓
System Validates
   ↓
System Evaluates Boolean Rules
   ↓
Risk Appears
   ↓
Damage Type Appears
   ↓
Severity Appears
   ↓
Repair Cost Range Appears
   ↓
Recommendations Appear
   ↓
User Can Inspect Why
```

And the implementation can demonstrate this academically as:

```text
Raw Inputs
   ↓
Boolean Variables
   ↓
AND / OR / NOT
   ↓
Decision
   ↓
Explainable Output
```

---

# 34. Development Discipline for the Agent

Work in small verified increments.

For each phase:

1. Implement.
2. Run tests.
3. Fix failures.
4. Run the app.
5. Check the result.
6. Update documentation.
7. Only then move to the next phase.

Do not build 20 modules and test only at the end.

### Commit strategy

Use meaningful Git commits such as:

```text
feat: initialize web app
feat: add validated weather and property input
feat: implement boolean rule engine
feat: add risk classification
feat: add damage prediction
feat: add severity classifier
feat: add repair cost estimator
feat: add weather API with manual fallback
feat: build analysis dashboard
feat: add dataset methodology
feat: add automated tests
fix: handle weather API timeout
```

---

# 35. What the Agent Must NOT Do

Do not:

- rewrite the project into a generic chatbot
- make an LLM decide the risk level
- invent dataset columns
- invent ML accuracy
- hide Boolean logic inside UI code
- hard-code dozens of thresholds across components
- make the weather API mandatory
- claim insurance-grade cost accuracy
- add unnecessary authentication
- over-engineer the architecture
- skip tests because the UI looks correct
- declare success without browser verification

---

# 36. Final Expected Repository

At the end, the repository should approximately contain:

```text
PRD.md
README.md

src/
data/
docs/
tests/
scripts/
public/

.env.example
package.json
...
```

And the website should be usable through:

```text
Local development URL
+
Production deployment URL
```

---

# 37. Final Presentation Narrative

The simplest explanation of the project during the LSD evaluation should be:

> We collect weather and property inputs, convert them into Boolean weather conditions, apply deterministic AND/OR/NOT rules to classify risk, map the risk to possible damage and severity, estimate an approximate repair-cost range, and show the reasoning through a web dashboard.

The strongest demonstration sequence is:

```text
INPUT
  ↓
BOOLEAN CONDITIONS
  ↓
RULE TRACE
  ↓
RISK
  ↓
DAMAGE
  ↓
SEVERITY
  ↓
COST
  ↓
RECOMMENDATION
```

That sequence should be obvious in both the code and the UI.

---

# 38. First Action for the Agent

When the repository is opened for the first time, do exactly this order:

```text
1. Read PRD.md
2. Inspect repository
3. Decide/confirm framework
4. Create architecture notes
5. Scaffold or reuse the application
6. Define domain types
7. Build validation
8. Build preprocessing
9. Inspect Kaggle dataset
10. Implement Boolean rules
11. Implement risk classification
12. Implement damage prediction
13. Implement severity
14. Implement cost estimation
15. Implement recommendations
16. Implement weather API + manual fallback
17. Build analysis API
18. Build UI
19. Add explainability
20. Add charts
21. Add sample scenarios
22. Add tests
23. Add documentation
24. Run full QA
25. Build production
26. Verify browser behavior
27. Deploy
28. Record final status
```

Do not skip directly to styling.

The **decision engine and end-to-end functionality come first; visual polish comes after the pipeline is correct.**
