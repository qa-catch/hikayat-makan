import { expect, test, type Page } from "@playwright/test";

// Primitives d'animation (T7) : repli, contenu complet, défilement natif, clavier.
const HISTOIRE = "/ar/catalogue/gabarits/histoire";
const CATALOGUE = "/ar/catalogue";

/** Textes de la page dont l'opacité effective (produit des ancêtres) est inférieure à 1. */
function textesMasques(page: Page) {
  return page.locator("main :is(h1, h2, h3, p, li, a)").evaluateAll((els) =>
    els
      .filter((el) => el.textContent?.trim())
      .filter((el) => {
        let opacity = 1;
        for (let node: Element | null = el; node; node = node.parentElement) {
          opacity *= Number(getComputedStyle(node).opacity);
        }
        return opacity < 1;
      })
      .map((el) => el.textContent?.trim()),
  );
}

/** Animation de chaque primitive pilotée par le défilement. */
function animations(page: Page) {
  return page.locator(".motion-reveal, .motion-scene-visual").evaluateAll((els) =>
    els.map((el) => {
      const style = getComputedStyle(el);
      return { name: style.animationName, timeline: style.getPropertyValue("animation-timeline") };
    }),
  );
}

/** Fixe la connexion annoncée : `effectiveType` est une estimation qui varie sous charge. */
function connexion(page: Page, effectiveType: string) {
  return page.addInitScript((type) => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      get: () => ({ saveData: false, effectiveType: type }),
    });
  }, effectiveType);
}

async function defilerJusquAuBas(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  });
}

test.describe("primitives d'animation", () => {
  test("le HTML serveur contient tout le texte des scènes et des apparitions", async ({
    request,
  }) => {
    const histoire = await (await request.get(HISTOIRE)).text();
    expect(histoire.match(/class="[^"]*motion-scene(?:\s|")/g)).toHaveLength(3);
    for (const texte of ["مشهد تجريبي أول", "مشهد تجريبي ثانٍ", "مشهد تجريبي ثالث"]) {
      expect(histoire).toContain(texte);
    }
    const catalogue = await (await request.get(CATALOGUE)).text();
    expect(catalogue.match(/class="[^"]*motion-reveal/g)).toHaveLength(3);
    expect(catalogue).toContain("كتلة تجريبية تظهر بهدوء");
  });

  for (const url of [HISTOIRE, CATALOGUE]) {
    test(`avec prefers-reduced-motion, tout le texte de ${url} est visible`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(url);
      await expect(page.locator("html")).toHaveAttribute("data-motion", "none");
      for (const animation of await animations(page)) expect(animation.name).toBe("none");
      expect(await textesMasques(page)).toEqual([]);
      await defilerJusquAuBas(page);
      expect(await textesMasques(page)).toEqual([]);
    });
  }

  test("sans préférence : animations pilotées par le défilement, texte du haut visible", async ({
    page,
  }) => {
    await connexion(page, "4g");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(HISTOIRE);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
    expect(await animations(page)).toEqual([
      { name: "motion-scene-appear", timeline: "--motion-scene" },
      { name: "motion-scene-zoom", timeline: "--motion-scene" },
      { name: "motion-scene-pan", timeline: "--motion-scene" },
    ]);
    // Aucune animation ne cache le texte : seuls les visuels décoratifs s'animent.
    await defilerJusquAuBas(page);
    expect(await textesMasques(page)).toEqual([]);

    await page.goto(CATALOGUE);
    const reveal = await animations(page);
    expect(reveal).toHaveLength(3);
    for (const animation of reveal) {
      expect(animation).toEqual({ name: "motion-reveal", timeline: "view()" });
    }
  });

  test("connexion modeste : version allégée (fondus seulement, scènes immobiles)", async ({
    page,
  }) => {
    await connexion(page, "3g");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(HISTOIRE);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "lite");
    for (const animation of await animations(page)) expect(animation.name).toBe("none");
    await page.goto(CATALOGUE);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "lite");
    for (const animation of await animations(page)) expect(animation.name).toBe("motion-fade");
  });

  test("le défilement reste natif : aucun gestionnaire ne bloque la molette ni le toucher", async ({
    page,
  }) => {
    await page.goto(HISTOIRE);
    const styles = await page.evaluate(() => {
      const html = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      return [html.scrollSnapType, body.scrollSnapType, html.overflowY, body.touchAction];
    });
    expect(styles).toEqual(["none", "none", "visible", "auto"]);
    const avant = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(avant);
  });

  test("au clavier, les scènes se traversent jusqu'à la suite du parcours", async ({ page }) => {
    await page.goto(HISTOIRE);
    const cible = page.getByTestId("place-card-demo-suivant-link");
    for (let i = 0; i < 40 && !(await cible.evaluate((el) => el === document.activeElement)); i++) {
      await page.keyboard.press("Tab");
    }
    await expect(cible).toBeFocused();
    await expect(cible).toBeInViewport();
  });

  test("un lien « avancer » passe par une transition de vue, puis la page est complète", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = document.startViewTransition?.bind(document);
      if (!original) return;
      (window as unknown as { transitions: number }).transitions = 0;
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
        (window as unknown as { transitions: number }).transitions++;
        return original(arg);
      }) as typeof document.startViewTransition;
    });
    await page.goto(CATALOGUE);
    await page.getByTestId("catalogue-motion-shared").click();
    await expect(page).toHaveURL(/\/catalogue\/gabarits\/lieu$/);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(() => (window as unknown as { transitions: number }).transitions),
    ).toBeGreaterThan(0);
  });
});
