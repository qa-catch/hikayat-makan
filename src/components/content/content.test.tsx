import { describe, expect, it } from "vitest";
import messages from "../../../messages/ar.json";
import { NATURES } from "@/shared/content/nature";
import { render } from "@/test/render";
import { natureFrames, natureTones } from "./nature";
import { NatureBanner } from "./nature-banner";
import { SourceList } from "./source-list";
import { UnverifiedNotice } from "./unverified-notice";

describe("natures", () => {
  it.each(NATURES)("%s a un libellé, une description, une couleur et un cadre", (nature) => {
    expect(messages.Content.nature[nature].label).toBeTruthy();
    expect(messages.Content.nature[nature].description).toBeTruthy();
    expect(natureTones[nature]).toBeTruthy();
    expect(natureFrames[nature]).toBeTruthy();
  });
});

describe("NatureBanner", () => {
  it.each(NATURES)("%s : une note qui dit la nature en toutes lettres", (nature) => {
    const html = render(<NatureBanner nature={nature} />);
    expect(html).toContain('role="note"');
    expect(html).toContain(`data-testid="nature-banner-${nature.toLowerCase()}"`);
    expect(html).toContain(`طبيعة المحتوى: ${messages.Content.nature[nature].label}`);
    expect(html).toContain(messages.Content.nature[nature].description);
  });
});

describe("UnverifiedNotice", () => {
  it("affiche « محتوى قيد التحقق »", () => {
    const html = render(<UnverifiedNotice />);
    expect(html).toContain("محتوى قيد التحقق");
    expect(html).toContain('role="note"');
    expect(html).toContain('data-testid="unverified-notice"');
  });
});

describe("SourceList", () => {
  const sources = [
    { id: "a", title: "مصدر", detail: "تفصيل" },
    { id: "b", title: "Source B", href: "https://example.com/" },
  ];

  it("est une section titrée avec une liste numérotée", () => {
    const html = render(<SourceList sources={sources} />);
    const labelledby = /aria-labelledby="([^"]+)"/.exec(html)?.[1];
    expect(labelledby).toBeTruthy();
    expect(html).toContain(`id="${labelledby}"`);
    expect(html).toContain("المصادر");
    expect(html).toContain("<ol");
    expect(html.match(/<li /g)).toHaveLength(2);
    expect(html).toContain('data-testid="source-list-item-a"');
    expect(html).toContain('data-testid="source-list-item-b"');
  });

  it("ouvre les liens externes dans un nouvel onglet, sans fuite du référent", () => {
    const html = render(<SourceList sources={sources} />);
    expect(html).toContain('href="https://example.com/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("يُفتح في نافذة جديدة");
  });

  it("garde dir=auto pour les titres arabes, latins ou mixtes", () => {
    const html = render(<SourceList sources={sources} />);
    expect(html.match(/dir="auto"/g)?.length).toBeGreaterThanOrEqual(3);
  });

  it("dit l'absence de sources au lieu d'une liste vide", () => {
    const html = render(<SourceList sources={[]} />);
    expect(html).toContain("لا توجد مصادر");
    expect(html).not.toContain("<ol");
  });

  it("laisse choisir le data-testid d'une seconde liste", () => {
    expect(render(<SourceList sources={[]} data-testid="source-list-empty" />)).toContain(
      'data-testid="source-list-empty"',
    );
  });
});
