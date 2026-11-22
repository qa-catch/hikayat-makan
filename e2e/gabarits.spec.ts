import { expect, test } from "@playwright/test";

// Gabarits de pages (T6) : route catalogue, hors production, `noindex`, données factices.
const GABARITS = ["accueil", "lieu", "histoire", "liste"] as const;
const url = (name: string) => `/ar/catalogue/gabarits/${name}`;

for (const name of GABARITS) {
  test.describe(`gabarit ${name}`, () => {
    test("est noindex, en arabe RTL, et marque les contenus factices", async ({ page }) => {
      await page.goto(url(name));
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.getByTestId(`gabarit-${name}`)).toContainText("تجريبي");
    });

    test("a un seul h1 et les repères header, main, nav, footer", async ({ page }) => {
      await page.goto(url(name));
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("body > header")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("body > footer")).toHaveCount(1);
      await expect(page.locator("nav[aria-label]").first()).toBeAttached();
      expect(await page.locator("nav").count()).toBeGreaterThanOrEqual(2);
    });

    test("a des data-testid uniques et stables", async ({ page }) => {
      await page.goto(url(name));
      const ids = await page
        .locator("[data-testid]")
        .evaluateAll((els) => els.map((el) => el.getAttribute("data-testid")));
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
      expect(ids.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id!))).toBe(true);
    });

    test("n'a aucun défilement horizontal à 360, 768 et 1280 px", async ({ page }) => {
      for (const largeur of [360, 768, 1280]) {
        await page.setViewportSize({ width: largeur, height: 800 });
        await page.goto(url(name));
        const debordement = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(debordement, `${largeur} px`).toBeLessThanOrEqual(0);
      }
    });

    test("toutes les cibles tactiles font au moins 44 × 44 px", async ({ page }) => {
      for (const largeur of [360, 1280]) {
        await page.setViewportSize({ width: largeur, height: 800 });
        await page.goto(url(name));
        const trop_petites = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("a, button")]
            .filter((el) => {
              const style = getComputedStyle(el);
              const boite = el.getBoundingClientRect();
              // Lien d'évitement masqué (1 px) et liens en milieu de phrase exclus.
              return style.display !== "none" && boite.width > 1 && el.dataset.inline !== "true";
            })
            .map((el) => ({
              id: el.dataset.testid ?? el.textContent,
              r: el.getBoundingClientRect(),
            }))
            .filter(({ r }) => r.width < 43.5 || r.height < 43.5)
            .map(({ id }) => id),
        );
        expect(trop_petites, `${largeur} px`).toEqual([]);
      }
    });
  });
}

test.describe("mise en page responsive (§ 19.1)", () => {
  const splits = [
    ["lieu", "gabarit-lieu-split"],
    ["histoire", "gabarit-histoire-scene-1"],
  ] as const;

  for (const [name, testId] of splits) {
    test(`${name} : mobile = visuel en haut, texte dessous`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(url(name));
      const visuel = await page.getByTestId(`${testId}-visual`).boundingBox();
      const texte = await page.getByTestId(testId).locator("h1, h2").first().boundingBox();
      expect(visuel!.y + visuel!.height).toBeLessThanOrEqual(texte!.y + 1);
      expect(visuel!.width).toBeGreaterThanOrEqual(359);
    });

    test(`${name} : desktop = visuel d'un côté, texte à droite (RTL)`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(url(name));
      const visuel = await page.getByTestId(`${testId}-visual`).boundingBox();
      const texte = await page.getByTestId(testId).locator("h1, h2").first().boundingBox();
      expect(visuel!.x + visuel!.width).toBeLessThanOrEqual(texte!.x + 1);
    });
  }

  test("accueil : la scène d'ouverture remplit l'écran visible, sur mobile et desktop", async ({
    page,
  }) => {
    for (const [largeur, hauteur] of [
      [360, 740],
      [1280, 800],
    ] as const) {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(url("accueil"));
      const scene = await page.getByTestId("gabarit-accueil-hero").boundingBox();
      // En-tête (≈ 57 px) + scène + navigation du bas sur mobile ≈ un écran.
      const reserve = largeur < 768 ? 57 + 56 : 57;
      expect(scene!.height, `${largeur} px`).toBeGreaterThanOrEqual(hauteur - reserve - 4);
    }
  });

  test("accueil : trois portes en colonne sur mobile, en ligne sur desktop", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(url("accueil"));
    const portes = ["stories", "discover", "crafts"].map((id) =>
      page.getByTestId(`gabarit-accueil-door-${id}`),
    );
    const mobile = await Promise.all(portes.map((p) => p.boundingBox()));
    expect(mobile[1]!.y).toBeGreaterThan(mobile[0]!.y);
    await page.setViewportSize({ width: 1280, height: 800 });
    const bureau = await Promise.all(portes.map((p) => p.boundingBox()));
    expect(bureau[0]!.y).toBe(bureau[1]!.y);
    // RTL : la première porte est à droite.
    expect(bureau[0]!.x).toBeGreaterThan(bureau[1]!.x);
  });
});
