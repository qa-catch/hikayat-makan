import { expect, test } from "@playwright/test";

test("/ar est en arabe, RTL, avec Tailwind appliqué", async ({ page }) => {
  const response = await page.goto("/ar");
  expect(response?.status()).toBe(200);

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "ar");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(html).toHaveCSS("direction", "rtl");
  // Preflight de Tailwind : le body n'a plus la marge par défaut du navigateur.
  await expect(page.locator("body")).toHaveCSS("margin-top", "0px");
});
