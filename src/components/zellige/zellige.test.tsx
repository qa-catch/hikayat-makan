import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { ZelligeLoader } from "@/components/motion/zellige-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { render } from "@/test/render";
import {
  INNER_RATIO,
  MEDALLION_HEART,
  MEDALLION_SEGMENTS,
  SMALL_STAR,
  segmentPose,
  type Point,
} from "./geometry";
import { ZelligeDivider, ZelligeFrame, ZelligeMedallion, ZelligeStar } from "./zellige";

const radius = ([x, y]: Point) => Math.hypot(x, y);

describe("géométrie du zellige", () => {
  it("place les sommets de chaque étoile sur deux cercles, au rapport cos 45° / cos 22,5°", () => {
    const outer = MEDALLION_SEGMENTS.slice(0, 8).map(({ from }) => radius(from));
    const inner = MEDALLION_SEGMENTS.slice(8).map(({ from }) => radius(from));
    outer.forEach((r) => expect(r).toBeCloseTo(46, 0));
    inner.forEach((r) => expect(r).toBeCloseTo(46 * INNER_RATIO, 0));
  });

  it("est symétrique : seize traits de même longueur par étoile", () => {
    expect(MEDALLION_SEGMENTS).toHaveLength(16);
    const lengths = MEDALLION_SEGMENTS.map((s) => segmentPose(s).length);
    lengths.slice(1, 8).forEach((l) => expect(l).toBeCloseTo(lengths[0]!, 0));
    lengths.slice(9).forEach((l) => expect(l).toBeCloseTo(lengths[8]!, 0));
  });

  it("ferme les étoiles pleines sur seize sommets dans le repère", () => {
    for (const star of [SMALL_STAR, MEDALLION_HEART]) {
      expect(star).toHaveLength(16);
      star.forEach((point) => expect(radius(point)).toBeLessThanOrEqual(50));
    }
  });
});

describe("motifs fixes", () => {
  it("sont décoratifs : masqués aux lecteurs d'écran, sans texte", () => {
    for (const html of [
      render(<ZelligeMedallion />),
      render(<ZelligeStar />),
      render(<ZelligeDivider />),
    ]) {
      expect(html).toMatch(/^<(svg|div) [^>]*aria-hidden="true"/);
      expect(html.replace(/<[^>]+>/g, "")).toBe("");
    }
  });

  it("n'ont aucune animation", () => {
    const html = render(
      <ZelligeFrame>
        <ZelligeMedallion />
      </ZelligeFrame>,
    );
    expect(html).not.toContain("animate-");
  });

  it("gardent leurs défauts sans className, les remplacent sinon", () => {
    expect(render(<ZelligeMedallion />)).toContain('class="size-20 text-bleu"');
    expect(render(<ZelligeMedallion className="size-32 text-emeraude" />)).toContain(
      'class="size-32 text-emeraude"',
    );
  });

  it("cadre : étoiles en positions logiques, contenu découpé", () => {
    const html = render(
      <ZelligeFrame data-testid="cadre">
        <p>contenu</p>
      </ZelligeFrame>,
    );
    expect(html).toContain('data-testid="cadre"');
    expect(html).toContain("overflow-hidden");
    expect(html.match(/start-0\.5|end-0\.5/g)).toHaveLength(4);
  });

  it("restent légers (poids noté dans le brief de design)", () => {
    const weights = {
      medallion: render(<ZelligeMedallion />).length,
      star: render(<ZelligeStar />).length,
      loader: render(<ZelligeLoader />).length,
    };
    expect(weights.medallion).toBeLessThan(1024);
    expect(weights.star).toBeLessThan(512);
    expect(weights.loader).toBeLessThan(4.5 * 1024);
    expect(gzipSync(render(<ZelligeLoader />)).length).toBeLessThan(1024);
  });
});

describe("ZelligeLoader", () => {
  it("annonce le chargement une fois, le dessin restant masqué", () => {
    const html = render(<ZelligeLoader data-testid="chargement" />);
    expect(html).toMatch(/^<div role="status"/);
    expect(html).toContain('<span class="sr-only">جارٍ التحميل…</span>');
    expect(html).toContain('<svg viewBox="-50 -50 100 100" aria-hidden="true"');
    expect(html).toContain('data-testid="chargement"');
  });

  it("dessine seize traits puis le cœur, animés seulement sous motion-safe", () => {
    const html = render(<ZelligeLoader />);
    expect(html.match(/<line /g)).toHaveLength(16);
    expect(html.match(/motion-safe:animate-zellige-trait/g)).toHaveLength(16);
    expect(html).toContain("motion-safe:animate-zellige-coeur");
    // Aucune classe d'animation hors du préfixe motion-safe : sans lui, le motif est fixe.
    expect(html.match(/(?<!motion-safe:)animate-/g)).toBeNull();
    expect(html).toContain('style="animation-delay:750ms"');
    expect(html).toContain('style="animation-delay:800ms"');
  });
});

describe("EmptyState et zellige", () => {
  it("montre le médaillon par défaut, masqué aux lecteurs d'écran", () => {
    const html = render(<EmptyState title="Titre" />);
    expect(html).toMatch(/<div aria-hidden="true"><svg viewBox="-50 -50 100 100"/);
  });

  it("le retire avec visual={null}", () => {
    expect(render(<EmptyState title="Titre" visual={null} />)).not.toContain("<svg");
  });
});
