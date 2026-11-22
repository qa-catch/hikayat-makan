import { describe, expect, it } from "vitest";
import { render } from "@/test/render";
import { PageTransition } from "./page-transition";
import { Reveal } from "./reveal";
import { SCENE_EFFECTS, Scene } from "./scene";
import { SharedImage } from "./shared-image";

const TEXT = "نص تجريبي";

/** Aucun style en ligne qui masquerait le contenu au premier rendu serveur. */
function hidesContent(html: string): boolean {
  return /opacity:\s*0|visibility:\s*hidden|display:\s*none|hidden=""/.test(html);
}

describe("primitives d'animation : contenu complet dans le HTML serveur", () => {
  it("PageTransition et SharedImage rendent leurs enfants tels quels", () => {
    const html = render(
      <PageTransition>
        <SharedImage name="visuel">
          <div data-testid="visuel">{TEXT}</div>
        </SharedImage>
      </PageTransition>,
    );
    expect(html).toBe(`<div data-testid="visuel">${TEXT}</div>`);
  });

  it("Reveal garde son texte visible et ne pose qu'une classe", () => {
    const html = render(<Reveal data-testid="bloc">{TEXT}</Reveal>);
    expect(html).toBe(`<div class="motion-reveal" data-testid="bloc">${TEXT}</div>`);
  });

  it.each(SCENE_EFFECTS)(
    "Scene « %s » : texte visible, visuel décoratif et effet nommé",
    (effect) => {
      const html = render(
        <Scene testId="scene" effect={effect} visual={<span />} focus={{ x: 30, y: 40 }}>
          <p>{TEXT}</p>
        </Scene>,
      );
      expect(html).toContain(`<p>${TEXT}</p>`);
      expect(html).toContain(`data-effect="${effect}"`);
      expect(html).toContain("--scene-focus:30% 40%");
      expect(html).toMatch(/aria-hidden="true" data-testid="scene-visual"/);
      expect(hidesContent(html)).toBe(false);
    },
  );

  it("Scene sans point de détail : aucun style en ligne", () => {
    const html = render(
      <Scene testId="scene" effect="pan" visual={<span />}>
        {TEXT}
      </Scene>,
    );
    expect(html).not.toContain("style=");
  });
});
