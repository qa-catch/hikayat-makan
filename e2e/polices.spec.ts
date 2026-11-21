import { expect, test } from "@playwright/test";

// Polices servies par le site lui-même (T3) : aucune requête vers un domaine tiers.
test("les polices viennent du site, sans domaine tiers", async ({ page, baseURL }) => {
  const origine = new URL(baseURL!).origin;
  const tiers: string[] = [];
  page.on("request", (requete) => {
    const url = new URL(requete.url());
    if (url.protocol.startsWith("http") && url.origin !== origine) tiers.push(requete.url());
  });

  await page.goto("/ar", { waitUntil: "networkidle" });

  // Chaque @font-face à fichier du site : font-display défini et jamais « block » ni « auto » (texte invisible).
  const affichages = await page.evaluate(() =>
    [...document.styleSheets].flatMap((feuille) =>
      [...feuille.cssRules]
        .filter((regle): regle is CSSFontFaceRule => regle instanceof CSSFontFaceRule)
        // Les polices de repli métrique de Next (local(Arial)) n’ont pas de fichier à charger.
        .filter((regle) => regle.style.getPropertyValue("src").includes("url("))
        .map((regle) => regle.style.getPropertyValue("font-display")),
    ),
  );
  expect(affichages.length).toBeGreaterThanOrEqual(3);
  for (const affichage of affichages) expect(["swap", "fallback", "optional"]).toContain(affichage);

  // Chargement forcé de chaque police déclarée : elle doit être servie par le site.
  const etats = await page.evaluate(async () => {
    const faces = [...document.fonts].filter((face) => !face.family.endsWith("Fallback"));
    await Promise.all(faces.map((face) => face.load()));
    return faces.map((face) => face.status);
  });
  expect(etats).toHaveLength(3);
  expect(etats.every((etat) => etat === "loaded")).toBe(true);

  const fichiers = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entree) => entree.name)
      .filter((url) => url.endsWith(".woff2")),
  );
  expect(fichiers).toHaveLength(3);
  for (const url of fichiers) expect(new URL(url).origin).toBe(origine);

  expect(tiers).toEqual([]);
});
