import { expect, test } from "@playwright/test";

test("/ redirige vers /ar", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/ar");
});

test("le titre vient de messages/ar.json", async ({ page }) => {
  await page.goto("/ar");
  await expect(page).toHaveTitle("حكاية مكان");
});

test("une locale inconnue renvoie 404 (via le proxy)", async ({ page }) => {
  const response = await page.goto("/fr");
  expect(response?.status()).toBe(404);
});

test("une locale inconnue renvoie 404 (hors proxy, validée par le layout)", async ({ request }) => {
  // Le point exclut ce chemin du matcher du proxy : seul le layout valide la locale.
  const response = await request.get("/fr.x");
  expect(response.status()).toBe(404);
});
