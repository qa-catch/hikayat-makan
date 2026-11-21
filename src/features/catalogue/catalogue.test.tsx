import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { render, testIds } from "@/test/render";
import { Catalogue } from "./catalogue";

describe("Catalogue", () => {
  const html = render(<Catalogue />);

  it("a un seul h1 et les repères header, main, nav, footer", () => {
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html.match(/<header[ >]/g)).toHaveLength(1);
    expect(html.match(/<main[ >]/g)).toHaveLength(1);
    expect(html.match(/<footer[ >]/g)).toHaveLength(1);
    expect(html.match(/<nav[ >]/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("n'a aucun data-testid en double", () => {
    const ids = testIds(html);
    expect(ids.length).toBeGreaterThan(40);
    const doublons = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(doublons).toEqual([]);
  });

  it("montre chaque nature, chaque état de bouton et la mention de vérification", () => {
    expect(testIds(html)).toEqual(
      expect.arrayContaining([
        "nature-banner-fact",
        "nature-banner-editorial",
        "nature-banner-legend",
        "nature-banner-reconstruction",
        "unverified-notice",
        "catalogue-button-primary",
        "catalogue-button-disabled",
        "catalogue-skeleton-card",
        "catalogue-empty-state",
        "place-card-demo-1",
        "story-card-demo-fact",
      ]),
    );
  });

  it("marque chaque carte factice « تجريبي »", () => {
    const cartes = html.split(/<article /).slice(1);
    expect(cartes.length).toBe(6);
    for (const carte of cartes) expect(carte).toContain("تجريبي");
  });
});

// « Aucune chaîne en dur dans les composants » : tout texte arabe vient de messages/ar.json.
// Les données factices (demo-data.ts) sont le seul fichier du catalogue autorisé à en contenir.
describe("aucune chaîne arabe en dur dans les composants", () => {
  const ARABE = /[؀-ۿ]/;

  function fichiers(dossier: string): string[] {
    return readdirSync(dossier).flatMap((nom) => {
      const chemin = join(dossier, nom);
      if (statSync(chemin).isDirectory()) return fichiers(chemin);
      return /\.tsx$/.test(nom) && !/\.test\.tsx$/.test(nom) ? [chemin] : [];
    });
  }

  const racine = join(__dirname, "..", "..");
  it.each(
    [
      ...fichiers(join(racine, "components")),
      ...fichiers(join(racine, "features", "catalogue")),
    ].map((chemin) => [chemin.replaceAll("\\", "/").split("/src/")[1], chemin] as const),
  )("%s", (_nom, chemin) => {
    // Les commentaires peuvent citer l'arabe (« تجريبي ») : seul le code compte.
    const code = readFileSync(chemin, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s\/\/.*$/gm, "");
    expect(code).not.toMatch(ARABE);
  });
});
