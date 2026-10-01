# Dataset status and profiling

## Planned source

The planned source is [Kaggle weather prediction dataset](https://www.kaggle.com/datasets/drishtiagarwal20/weather-prediction-dataset).
The repository currently has no acquired Kaggle CSV under `data/raw/` in this
environment. Consequently, this document intentionally does not claim a row
count, column schema, missing-value summary, or target field, and no rows or
labels were invented.

## Reproducible profiling

After downloading the source file under `data/raw/`, run the TypeScript script
with the project's available TypeScript runner:

```text
npx tsx scripts/profile-dataset.ts
```

The script reports each CSV's filename, row/column counts, column names,
inferred primitive types, missing counts, duplicate rows, categorical uniques,
and numerical ranges. It only reads files that exist. If there is no CSV it
prints a `not_available` report.

## Intended use and limitation

The dataset is described as a weather prediction dataset, not automatically a
property-damage dataset. Before any ML experiment, inspect the actual schema
and determine whether a defensible damage or severity target exists. If it does
not, use the data only for weather preprocessing/analysis and retain the
rule-based damage and severity pipeline. The current MVP makes no unsupported
ML accuracy claim.
