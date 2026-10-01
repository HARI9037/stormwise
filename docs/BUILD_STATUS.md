# Domain implementation status

- Existing repository stack: Next.js/TypeScript files were present when the
  domain work resumed; `package.json` was not modified.
- Completed: typed domain models, centralized thresholds/cost assumptions,
  validation, preprocessing, explicit AND/OR/NOT rule trace, risk, damage,
  severity, cost, recommendations, and orchestration.
- Tests: Vitest unit and integration tests are supplied under `tests/`; this
  repository's package configuration does not currently include a Vitest
  script, so the tests are intended for the project's test setup to invoke.
- Dataset: no Kaggle CSV was available under `data/raw`; see `docs/DATASET.md`.
