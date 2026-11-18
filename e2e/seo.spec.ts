import { expect, test } from "@playwright/test";
import messages from "../messages/ar.json";

// Lancé aussi contre la production (E2E_BASE_URL) : la canonique et le sitemap doivent désigner
// l'URL testée, donc SITE_URL (ou le domaine de production Vercel) doit lui être égal.

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const { title, description } = messages.Metadata;

test.describe("HTML serveur, sans JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("/ar porte titre, description, canonique et Open Graph", async ({ page, baseURL }) => {
    const response = await page.goto("/ar");
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);

    const canonical = new URL("/ar", baseURL).href;
    const meta = (attr: string, value: string) =>
      page.locator(`meta[${attr}="${value}"]`).getAttribute("content");

    await expect(page).toHaveTitle(title);
    expect(await meta("name", "description")).toBe(description);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(canonical);
    expect(await meta("property", "og:type")).toBe("website");
    expect(await meta("property", "og:url")).toBe(canonical);
    expect(await meta("property", "og:site_name")).toBe(title);
    expect(await meta("property", "og:locale")).toBe("ar_MA");
    expect(await meta("property", "og:title")).toBe(title);
    expect(await meta("property", "og:description")).toBe(description);
  });

  test("/ar est indexable : ni meta robots ni X-Robots-Tag", async ({ page }) => {
    const response = await page.goto("/ar");
    expect(response?.headers()["x-robots-tag"]).toBeUndefined();
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });
});

test("robots.txt autorise l'exploration et désigne le sitemap", async ({ request, baseURL }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain(`Sitemap: ${new URL("/sitemap.xml", baseURL).href}`);
  expect(body).not.toMatch(/^Disallow:\s*\/\s*$/im);
});

test("sitemap.xml est valide et ses URL répondent 200", async ({ page, request, baseURL }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");

  // Analyse par le navigateur : une erreur de syntaxe XML produit un élément <parsererror>.
  const sitemap = await page.evaluate(
    ([xml, ns]) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      return {
        wellFormed: doc.getElementsByTagName("parsererror").length === 0,
        root: `${doc.documentElement.namespaceURI} ${doc.documentElement.localName}`,
        urls: doc.getElementsByTagNameNS(ns, "url").length,
        locs: Array.from(doc.getElementsByTagNameNS(ns, "loc"), (n) => n.textContent ?? ""),
      };
    },
    [await response.text(), SITEMAP_NS] as const,
  );

  expect(sitemap.wellFormed).toBe(true);
  expect(sitemap.root).toBe(`${SITEMAP_NS} urlset`);
  expect(sitemap.locs).toContain(new URL("/ar", baseURL).href);
  // Une <loc> par <url>, chacune absolue, sur le domaine du site, et servie.
  expect(sitemap.locs).toHaveLength(sitemap.urls);
  for (const loc of sitemap.locs) {
    expect(new URL(loc).origin).toBe(new URL(baseURL!).origin);
    expect((await request.get(loc)).status()).toBe(200);
  }
});

test("/admin n'est jamais indexable", async ({ request }) => {
  for (const path of ["/admin", "/admin/connexion"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.headers()["x-robots-tag"], path).toContain("noindex");
  }
});
