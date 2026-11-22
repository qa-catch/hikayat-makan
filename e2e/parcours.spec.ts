import { expect, test, type Page } from "@playwright/test";

// Prototype du parcours « الرحلة » (T8) : entrer → parcourir → poursuivre, avec et sans
// réduction des animations, sur la route catalogue (hors production).
const DEPART = "/ar/catalogue/parcours";
const LIEU_1 = `${DEPART}/lieu-1`;
const HISTOIRE_1 = `${LIEU_1}/histoire`;
const LIEU_2 = `${DEPART}/lieu-2`;
const PAGES = [DEPART, LIEU_1, HISTOIRE_1, LIEU_2, `${LIEU_2}/histoire`];

/** Textes de `<main>` dont l'opacité effective (produit des ancêtres) est inférieure à 1. */
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

/**
 * Note les pseudo-éléments réellement animés de chaque transition de vue (`window.vt`), avec le
 * nom de l'animation (ex. `::view-transition-new(_t_1_) motion-slide`).
 */
function suivreTransitions(page: Page) {
  return page.addInitScript(() => {
    const w = window as unknown as { vt: string[] };
    w.vt = [];
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
      const transition = original(arg);
      transition.ready
        .then(() => {
          for (const animation of document.getAnimations()) {
            const pseudo = (animation.effect as KeyframeEffect | null)?.pseudoElement;
            // Les animations internes du navigateur (durée nulle) ne comptent pas.
            const duree = Number(animation.effect?.getComputedTiming().duration);
            const nom = (animation as CSSAnimation).animationName ?? "";
            if (pseudo && duree > 0) w.vt.push(`${pseudo} ${nom}`);
          }
        })
        .catch(() => {});
      return transition;
    }) as typeof document.startViewTransition;
  });
}

const transitions = (page: Page) => page.evaluate(() => (window as unknown as { vt: string[] }).vt);

/** Attend la fin du préchargement : la morphose ne joue que si la page d'arrivée est prête. */
const precharger = (page: Page) => page.waitForLoadState("networkidle");

async function defilerJusquAuBas(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  });
}

test.describe("parcours « الرحلة »", () => {
  for (const url of PAGES) {
    test(`${url} : noindex, un h1, aucun défilement horizontal (360 et 1280 px)`, async ({
      page,
    }) => {
      for (const largeur of [360, 1280]) {
        await page.setViewportSize({ width: largeur, height: 800 });
        await page.goto(url);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("main")).toContainText("تجريبي");
        const debordement = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(debordement, `${largeur} px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("un lieu inconnu est une 404", async ({ request }) => {
    expect((await request.get(`${DEPART}/inconnu`)).status()).toBe(404);
    expect((await request.get(`${DEPART}/inconnu/histoire`)).status()).toBe(404);
  });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`parcours complet (avant, retour, fin d'histoire), reducedMotion: ${reducedMotion}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto(DEPART);

      // Entrer : la carte devient la fiche.
      await page.getByTestId("place-card-lieu-1-link").click();
      await expect(page).toHaveURL(new RegExp(`${LIEU_1}$`));
      await expect(page.locator("h1")).toHaveText("مكان تجريبي أول");

      // Retour vers le départ, puis on entre de nouveau.
      await page.getByTestId("parcours-lieu-back").click();
      await expect(page).toHaveURL(new RegExp(`${DEPART}$`));
      await page.getByTestId("place-card-lieu-1-link").click();
      await expect(page).toHaveURL(new RegExp(`${LIEU_1}$`));

      // Parcourir : chaque scène dit sa place, aucun texte n'est caché.
      await page.getByTestId("parcours-lieu-story").click();
      await expect(page).toHaveURL(new RegExp(`${HISTOIRE_1}$`));
      await expect(page.locator("h1")).toHaveText("حكاية تجريبية أولى");
      for (const n of [1, 2, 3]) {
        const progression = page.getByTestId(`parcours-scene-${n}-progress`);
        await progression.scrollIntoViewIfNeeded();
        await expect(progression).toHaveText(`المشهد ${n} من 3`);
      }
      await defilerJusquAuBas(page);
      expect(await textesMasques(page)).toEqual([]);

      // Retour à la fiche depuis l'histoire, puis retour du navigateur.
      await page.getByTestId("parcours-histoire-back").click();
      await expect(page).toHaveURL(new RegExp(`${LIEU_1}$`));
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${HISTOIRE_1}$`));

      // Poursuivre : la fin ouvre sur l'autre lieu, sans rupture.
      await page.getByTestId("place-card-lieu-2-link").click();
      await expect(page).toHaveURL(new RegExp(`${LIEU_2}$`));
      await expect(page.locator("h1")).toHaveText("مكان تجريبي ثانٍ");
      expect(await textesMasques(page)).toEqual([]);
    });
  }

  test("sans préférence : chaque étape glisse, le visuel de la carte devient l'en-tête et inversement", async ({
    page,
  }) => {
    await suivreTransitions(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(DEPART);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
    const morphose = /^::view-transition-group\(parcours-lieu-[12]-visual\) /;
    const glisseSortie = /^::view-transition-old\(.+\) motion-slide$/;
    const glisseEntree = /^::view-transition-new\(.+\) motion-slide$/;

    // Chaque lien typé du parcours : la page sort et entre en glissant ; morphose si `morph`.
    for (const [lien, h1, morph] of [
      ["place-card-lieu-1-link", "مكان تجريبي أول", true],
      ["parcours-lieu-story", "حكاية تجريبية أولى", false],
      ["parcours-histoire-back", "مكان تجريبي أول", false],
      ["parcours-lieu-back", "الرحلة", true],
      ["place-card-lieu-1-link", "مكان تجريبي أول", true],
      ["parcours-lieu-story", "حكاية تجريبية أولى", false],
      ["place-card-lieu-2-link", "مكان تجريبي ثانٍ", true],
    ] as const) {
      await page.evaluate(() => ((window as unknown as { vt: string[] }).vt = []));
      await precharger(page);
      await page.getByTestId(lien).click();
      await expect(page.locator("h1")).toHaveText(h1);
      await expect
        .poll(() => transitions(page), lien)
        .toContainEqual(expect.stringMatching(glisseSortie));
      const vues = await transitions(page);
      expect(vues, lien).toContainEqual(expect.stringMatching(glisseEntree));
      expect(
        vues.some((vue) => morphose.test(vue)),
        lien,
      ).toBe(morph);
    }
  });

  test("avec prefers-reduced-motion : aucune animation de transition", async ({ page }) => {
    await suivreTransitions(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(DEPART);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "none");
    await precharger(page);
    await page.getByTestId("place-card-lieu-1-link").click();
    await expect(page.locator("h1")).toHaveText("مكان تجريبي أول");
    expect(await transitions(page)).toEqual([]);
  });
});
