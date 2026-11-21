import { expect, test, type Page } from "@playwright/test";

// Motif de zellige (T5), montré sur le catalogue (hors production).
const CATALOGUE = "/ar/catalogue";

/** État calculé de chaque trait et du cœur du chargement. */
function etatDuDessin(page: Page) {
  return page
    .getByTestId("catalogue-zellige-loader")
    .locator("line, path")
    .evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el);
        return {
          animation: style.animationName,
          transform: style.transform,
          opacity: style.opacity,
        };
      }),
    );
}

test.describe("motif de zellige", () => {
  test("avec prefers-reduced-motion, le chargement est fixe et complet", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(CATALOGUE);
    const dessin = await etatDuDessin(page);
    expect(dessin).toHaveLength(17);
    for (const trait of dessin) {
      expect(trait).toEqual({ animation: "none", transform: "none", opacity: "1" });
    }
    await expect(page.locator("svg [class*='animate-']:not([class*='motion-safe'])")).toHaveCount(
      0,
    );
  });

  test("sans préférence, chaque trait se dessine par transform et opacity", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(CATALOGUE);
    const dessin = await etatDuDessin(page);
    expect(dessin.slice(0, 16).every((t) => t.animation === "zellige-trait")).toBe(true);
    expect(dessin[16]!.animation).toBe("zellige-coeur");

    // Les images clés n'animent que transform et opacity.
    const proprietes = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => /^zellige-/.test((a as CSSAnimation).animationName))
        .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes())
        .flatMap((cle) => Object.keys(cle))
        .filter((cle) => !["offset", "computedOffset", "easing", "composite"].includes(cle)),
    );
    expect(new Set(proprietes)).toEqual(new Set(["transform", "opacity"]));
  });

  test("les motifs fixes sont décoratifs et le chargement s'annonce", async ({ page }) => {
    await page.goto(CATALOGUE);
    for (const id of ["catalogue-zellige-divider", "catalogue-zellige-medallion"]) {
      await expect(page.getByTestId(id)).toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.getByTestId("catalogue-zellige-loader")).toHaveRole("status");
    await expect(page.getByTestId("catalogue-zellige-loader")).toHaveText("جارٍ التحميل…");
  });

  test("le cadre ne déborde pas, même à 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(CATALOGUE);
    const cadre = page.getByTestId("catalogue-zellige-frame");
    const boite = (await cadre.boundingBox())!;
    const etoiles = await cadre
      .locator(":scope > svg")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON() as DOMRect));
    expect(etoiles).toHaveLength(4);
    for (const etoile of etoiles) {
      expect(etoile.left).toBeGreaterThanOrEqual(boite.x);
      expect(etoile.right).toBeLessThanOrEqual(boite.x + boite.width);
      expect(etoile.top).toBeGreaterThanOrEqual(boite.y);
      expect(etoile.bottom).toBeLessThanOrEqual(boite.y + boite.height);
    }
  });
});
