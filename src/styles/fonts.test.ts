import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const dir = join(__dirname, "fonts");
const files = readdirSync(dir);
const woff2 = files.filter((name) => name.endsWith(".woff2"));

// Budget des polices (T3, relevé à la refonte pour Reem Kufi) : au-delà, discuter avant d'ajouter
// une graisse ou une police.
const BUDGET_OCTETS = 115 * 1024;

describe("polices auto-hébergées", () => {
  it("contient les quatre fichiers attendus", () => {
    expect(woff2.sort()).toEqual([
      "noto-kufi-arabic-700.woff2",
      "noto-sans-arabic-400.woff2",
      "noto-sans-arabic-700.woff2",
      "reem-kufi-700.woff2",
    ]);
  });

  it.each(woff2)("%s est un woff2 valide", (name) => {
    expect(readFileSync(join(dir, name)).subarray(0, 4).toString("latin1")).toBe("wOF2");
  });

  it(`pèse au plus ${BUDGET_OCTETS / 1024} Kio au total`, () => {
    const total = woff2.reduce((somme, name) => somme + statSync(join(dir, name)).size, 0);
    expect(total).toBeLessThanOrEqual(BUDGET_OCTETS);
  });

  it("garde le texte de la licence OFL de chaque famille", () => {
    for (const famille of ["NotoKufiArabic", "NotoSansArabic", "ReemKufi"]) {
      const texte = readFileSync(join(dir, `OFL-${famille}.txt`), "utf8");
      expect(texte).toContain("SIL OPEN FONT LICENSE Version 1.1");
    }
  });
});
