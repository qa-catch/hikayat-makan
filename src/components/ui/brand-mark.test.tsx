import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@/test/render";
import { BrandMark, MARK_BUBBLE, MARK_STAR } from "./brand-mark";

const root = join(__dirname, "..", "..");
const icon = readFileSync(join(root, "app", "icon.svg"), "utf8");
const css = readFileSync(join(root, "styles", "globals.css"), "utf8");
const token = (name: string) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6});`))?.[1];

describe("BrandMark", () => {
  it("est décoratif : le nom du site est écrit à côté", () => {
    expect(render(<BrandMark />)).toMatch(/^<svg[^>]*aria-hidden="true"/);
  });

  it("passe la bulle en blanc chaux sur fond sombre", () => {
    expect(render(<BrandMark />)).toContain('class="fill-emeraude"');
    expect(render(<BrandMark tone="dark" />)).toContain('class="fill-chaux"');
  });
});

describe("icône d'onglet (app/icon.svg)", () => {
  it("reprend les tracés du composant", () => {
    expect(icon).toContain(`d="${MARK_BUBBLE}"`);
    expect(icon).toContain(`d="${MARK_STAR}"`);
  });

  it("reprend les couleurs des jetons", () => {
    for (const name of ["emeraude", "safran", "chaux"]) {
      expect(icon).toContain(token(name)!);
    }
  });
});
