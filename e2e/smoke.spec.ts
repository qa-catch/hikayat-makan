import { expect, test } from "@playwright/test";

// Lancé aussi contre la production (E2E_BASE_URL) après chaque déploiement : .github/workflows/deploiement.yml.

test("test de fumée : /ar répond 200, en arabe, RTL, avec son titre", async ({ page }) => {
  const response = await page.goto("/ar");
  expect(response?.status()).toBe(200);

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "ar");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(page).toHaveTitle("حكاية مكان");
});

test("en-têtes de sécurité : CSP, HSTS, nosniff", async ({ page, baseURL }) => {
  const response = await page.goto("/ar");
  const headers = response?.headers() ?? {};

  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["content-security-policy"]).toContain("object-src 'none'");
  expect(headers["strict-transport-security"]).toContain("max-age=63072000");
  expect(headers["x-content-type-options"]).toBe("nosniff");

  // En production, le site n'est servi qu'en HTTPS.
  if (baseURL?.startsWith("https://")) expect(new URL(page.url()).protocol).toBe("https:");
});
