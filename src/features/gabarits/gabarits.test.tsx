import { describe, expect, it } from "vitest";
import { render, testIds } from "@/test/render";
import { Accueil } from "./accueil";
import { Histoire } from "./histoire";
import { Lieu } from "./lieu";
import { Liste } from "./liste";

const gabarits = [
  ["accueil", <Accueil key="accueil" />],
  ["lieu", <Lieu key="lieu" />],
  ["histoire", <Histoire key="histoire" />],
  ["liste", <Liste key="liste" />],
] as const;

describe.each(gabarits)("gabarit %s", (name, element) => {
  const html = render(element);

  it("a un seul h1 et les repères header, main, nav, footer", () => {
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html.match(/<header[ >]/g)?.length).toBeGreaterThanOrEqual(1);
    expect(html.match(/<main[ >]/g)).toHaveLength(1);
    expect(html.match(/<footer[ >]/g)).toHaveLength(1);
    expect(html.match(/<nav[ >]/g)?.length).toBeGreaterThanOrEqual(2);
    expect(testIds(html)).toContain(`gabarit-${name}`);
  });

  it("n'a aucun data-testid en double", () => {
    const ids = testIds(html);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  });

  it("marque le contenu factice et ne saute aucun niveau de titre", () => {
    expect(html).toContain("تجريبي");
    const niveaux = [...html.matchAll(/<h([1-4])[ >]/g)].map((m) => Number(m[1]));
    niveaux.forEach((niveau, index) => {
      if (index > 0) expect(niveau - niveaux[index - 1]!).toBeLessThanOrEqual(1);
    });
  });
});

describe("gabarit accueil", () => {
  const html = render(<Accueil />);

  it("a la scène d'ouverture en dvh et trois portes", () => {
    expect(html).toContain("100dvh");
    expect(testIds(html).filter((id) => /^gabarit-accueil-door-[a-z]+$/.test(id))).toHaveLength(3);
  });
});
