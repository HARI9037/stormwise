import { expect, test } from "@playwright/test";

test("home page exposes the analysis workflow", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Stormwise/);
  await expect(page.getByRole("heading", { name: /Read the weather/i })).toBeVisible();
  await page.getByRole("link", { name: /Run a scenario/i }).click();
  await expect(page).toHaveURL(/\/analyze/);
  await expect(page.getByRole("heading", { name: "Run an analysis" })).toBeVisible();
});

test("a demo scenario produces a rule trace", async ({ page }) => {
  await page.goto("/analyze");
  await page.getByRole("button", { name: /High risk/i }).click();
  await page.getByRole("button", { name: /Analyze scenario/i }).click();
  await expect(page.getByText("Rule trace")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Combined Weather", { exact: false })).toBeVisible();
});

test("validation errors are returned for missing required values", async ({ page }) => {
  await page.goto("/analyze");
  await page.getByLabel("Location").fill("");
  await page.getByRole("button", { name: /Analyze scenario/i }).click();
  await expect(page.getByRole("alert")).toContainText(/correct|location/i);
});
