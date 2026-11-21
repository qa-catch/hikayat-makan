import { expect, test, type Page } from "@playwright/test";

// Catalogue des composants (T4) : route hors production, `noindex`, données factices.
const CATALOGUE = "/ar/catalogue";

test.describe("catalogue", () => {
  test("est noindex et marque les contenus factices", async ({ page }) => {
    await page.goto(CATALOGUE);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("place-card-demo-1")).toContainText("تجريبي");
  });

  test("a des data-testid uniques et stables", async ({ page }) => {
    await page.goto(CATALOGUE);
    const ids = await page
      .locator("[data-testid]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-testid")));
    expect(ids.length).toBeGreaterThan(40);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    expect(ids.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id!))).toBe(true);
  });

  test("a un seul h1 et les repères sémantiques", async ({ page }) => {
    await page.goto(CATALOGUE);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
  });

  test("n'a aucun défilement horizontal à 360, 768 et 1280 px", async ({ page }) => {
    for (const largeur of [360, 768, 1280]) {
      await page.setViewportSize({ width: largeur, height: 800 });
      await page.goto(CATALOGUE);
      const debordement = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(debordement, `${largeur} px`).toBeLessThanOrEqual(0);
    }
  });

  test("toutes les cibles tactiles font au moins 44 × 44 px", async ({ page }) => {
    for (const largeur of [360, 1280]) {
      await page.setViewportSize({ width: largeur, height: 800 });
      await page.goto(CATALOGUE);
      const trop_petites = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("a, button")]
          .filter((el) => {
            const style = getComputedStyle(el);
            const boite = el.getBoundingClientRect();
            // Lien d'évitement masqué (1 px) et liens en milieu de phrase (WCAG 2.5.8) exclus.
            const visible = style.display !== "none" && boite.width > 1;
            return visible && el.dataset.inline !== "true";
          })
          .map((el) => ({
            id: el.dataset.testid ?? el.textContent,
            rect: el.getBoundingClientRect(),
          }))
          .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
          .map(({ id, rect }) => `${id}: ${Math.round(rect.width)}×${Math.round(rect.height)}`),
      );
      expect(trop_petites, `${largeur} px`).toEqual([]);
    }
  });

  test("la navigation du bas est celle du mobile, celle du haut celle du bureau", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(CATALOGUE);
    await expect(page.getByTestId("nav-bottom")).toBeVisible();
    await expect(page.getByTestId("nav-header")).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByTestId("nav-bottom")).toBeHidden();
    await expect(page.getByTestId("nav-header")).toBeVisible();
  });

  test("la page courante est marquée, une seule fois par barre", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(CATALOGUE);
    await expect(page.getByTestId("nav-bottom").locator('[aria-current="page"]')).toHaveCount(1);
    await expect(page.getByTestId("nav-bottom-stories")).toHaveAttribute("aria-current", "page");
  });

  test("la barre du bas ne recouvre pas la fin de la page", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(CATALOGUE);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const pied = await page.getByTestId("site-footer").boundingBox();
    const barre = await page.getByTestId("nav-bottom").boundingBox();
    expect(pied!.y + pied!.height).toBeLessThanOrEqual(barre!.y + 1);
  });

  test("les icônes « suivant » sont inversées en RTL, « précédent » non", async ({ page }) => {
    await page.goto(CATALOGUE);
    const echelle = (id: string) =>
      page.getByTestId(id).evaluate((el) => getComputedStyle(el).scale.split(" ")[0]);
    expect(Number(await echelle("catalogue-icon-chevron-forward"))).toBeLessThan(0);
    expect(Number(await echelle("catalogue-icon-chevron-back"))).toBeGreaterThan(0);
    expect(Number(await echelle("catalogue-icon-arrow-forward"))).toBeLessThan(0);
    expect(Number(await echelle("catalogue-icon-arrow-back"))).toBeGreaterThan(0);
  });

  test("les titres et paragraphes latins prennent leur propre direction", async ({ page }) => {
    await page.goto(CATALOGUE);
    const latin = page.getByTestId("catalogue-long-text-latin").locator("p");
    await expect(latin).toHaveAttribute("dir", "auto");
    expect(await latin.evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
    const arabe = page.getByTestId("catalogue-long-text").locator("p").first();
    expect(await arabe.evaluate((el) => getComputedStyle(el).direction)).toBe("rtl");
  });
});

/** Appuie sur Tab `fois` fois et rend, pour chaque élément focalisé, s'il a un contour visible. */
async function parcoursClavier(page: Page, fois: number) {
  const resultats: { id: string; visible: boolean }[] = [];
  for (let i = 0; i < fois; i++) {
    await page.keyboard.press("Tab");
    resultats.push(
      await page.evaluate(() => {
        const actif = document.activeElement as HTMLElement;
        // Le focus peut être dessiné par l'élément ou par un ancêtre qui le contient
        // (cartes : `has-focus-visible`).
        for (
          let el: HTMLElement | null = actif;
          el && el !== document.body;
          el = el.parentElement
        ) {
          const style = getComputedStyle(el);
          if (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2) {
            return { id: actif.dataset.testid ?? actif.tagName, visible: true };
          }
        }
        return { id: actif.dataset.testid ?? actif.tagName, visible: false };
      }),
    );
  }
  return resultats;
}

test.describe("clavier", () => {
  test("le focus est visible sur chaque élément interactif", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(CATALOGUE);
    const total = await page.locator("a:visible, button:enabled:visible").count();
    expect(total).toBeGreaterThan(15);

    const resultats = await parcoursClavier(page, total);
    expect(resultats.filter((r) => !r.visible)).toEqual([]);
    // Le parcours traverse toute la page : le dernier élément est dans le pied de page.
    expect(resultats.at(-1)!.id).toMatch(/^nav-footer/);
  });

  test("le lien d'évitement apparaît au premier Tab et mène au contenu", async ({ page }) => {
    await page.goto(CATALOGUE);
    const lien = page.getByTestId("site-header-skip");
    await page.keyboard.press("Tab");
    await expect(lien).toBeFocused();
    const boite = await lien.boundingBox();
    expect(boite!.width).toBeGreaterThan(44);
    expect(boite!.height).toBeGreaterThanOrEqual(44);

    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("le bouton désactivé n'est pas atteint au clavier", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(CATALOGUE);
    await expect(page.getByTestId("catalogue-button-disabled")).toBeDisabled();
    const parcours = await parcoursClavier(page, 25);
    expect(parcours.map((r) => r.id)).not.toContain("catalogue-button-disabled");
  });
});
