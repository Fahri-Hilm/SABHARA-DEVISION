import { test, expect } from "@playwright/test";

test("home page renders brand title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Kepolisian Futuristic Sabhara Devision/);
  await expect(page.getByRole("heading", { name: "Kepolisian Futuristic Sabhara Devision" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
});
