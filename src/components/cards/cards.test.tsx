import { describe, expect, it } from "vitest";
import { NATURES } from "@/shared/content/nature";
import { render, testIds } from "@/test/render";
import { PlaceCard } from "./place-card";
import { StoryCard } from "./story-card";

describe("PlaceCard", () => {
  const props = { id: "p1", href: "/lieu", title: "عنوان", summary: "ملخص" };

  it("est un article avec un seul lien, porté par le titre", () => {
    const html = render(<PlaceCard {...props} />);
    expect(html).toContain('data-testid="place-card-p1"');
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toMatch(/<h3 dir="auto"[^>]*><a href="\/lieu"[^>]*>عنوان<\/a><\/h3>/);
    expect(html).toContain('<p dir="auto"');
  });

  it("n'ajoute l'étiquette « تجريبي » que pour une donnée factice", () => {
    expect(render(<PlaceCard {...props} />)).not.toContain("تجريبي");
    expect(render(<PlaceCard {...props} demo />)).toContain("تجريبي");
  });

  it("affiche le type de lieu et garde le visuel décoratif", () => {
    const html = render(<PlaceCard {...props} category="نوع" visual={<i />} />);
    expect(html).toContain("نوع");
    expect(html).toMatch(/<div aria-hidden="true"[^>]*><i><\/i><\/div>/);
  });

  it("garde des data-testid uniques", () => {
    const ids = testIds(render(<PlaceCard {...props} category="x" demo />));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("StoryCard", () => {
  const props = { id: "s1", href: "/histoire", title: "عنوان", summary: "ملخص" };

  it.each(NATURES)("affiche la nature %s en toutes lettres", (nature) => {
    const html = render(<StoryCard {...props} nature={nature} />);
    expect(html).toContain('data-testid="story-card-s1-nature"');
    expect(html).toContain(
      {
        FACT: "وقائع موثّقة",
        EDITORIAL: "سرد تحريري",
        LEGEND: "رواية شعبية",
        RECONSTRUCTION: "إعادة تمثيل",
      }[nature],
    );
  });

  it("formate la durée en chiffres occidentaux", () => {
    expect(render(<StoryCard {...props} nature="FACT" minutes={12} />)).toContain(
      "مدة القراءة: 12 د",
    );
    expect(render(<StoryCard {...props} nature="FACT" />)).not.toContain("مدة القراءة");
  });

  it("a un seul lien et une icône « suivant » décorative", () => {
    const html = render(<StoryCard {...props} nature="FACT" />);
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('data-direction="forward"');
    expect(html).toContain("rtl:-scale-x-100");
  });
});
