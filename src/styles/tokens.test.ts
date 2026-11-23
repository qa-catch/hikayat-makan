import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "globals.css"), "utf8");

/** Couleurs hexadécimales de `--color-<nom>: #rrggbb;` dans le @theme. */
const colors = new Map<string, string>(
  [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6});/g)].map((m) => [m[1]!, m[2]!]),
);

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const get = (name: string): string => {
  const hex = colors.get(name);
  if (!hex) throw new Error(`Jeton --color-${name} introuvable`);
  return hex;
};

// AA : 4,5:1 texte courant ; 3:1 grand texte et éléments d'interface.
const TEXT = 4.5;
const LARGE_OR_UI = 3;

// Paires texte/fond autorisées. Toute nouvelle paire utilisée dans un composant s'ajoute ici.
const pairs: [text: string, background: string, min: number][] = [
  ...["chaux", "chaux-sombre", "white"].flatMap((bg): [string, string, number][] => [
    ["encre", bg, TEXT],
    ["encre-douce", bg, TEXT],
    ["bleu", bg, TEXT],
    ["bleu-profond", bg, TEXT],
    ["emeraude", bg, TEXT],
    ["ocre", bg, TEXT],
    ["erreur", bg, TEXT],
  ]),
  ["white", "bleu", TEXT],
  ["white", "bleu-profond", TEXT],
  ["white", "emeraude", TEXT],
  ["white", "ocre", TEXT],
  ["white", "erreur", TEXT],
  ["chaux", "bleu", TEXT],
  ["chaux", "bleu-profond", TEXT],
  ["bleu-clair", "bleu-profond", TEXT],
  ["encre", "safran", TEXT],
  ["bleu-profond", "safran", TEXT],
  ["encre", "safran-clair", TEXT],
  ["encre", "bleu-clair", TEXT],
  ["bleu-profond", "bleu-clair", TEXT],
  ["emeraude", "emeraude-clair", TEXT],
  ["encre", "emeraude-clair", TEXT],
  ["ocre", "ocre-clair", TEXT],
  ["encre", "ocre-clair", TEXT],
  ["erreur", "erreur-clair", TEXT],
  // Éléments d'interface (bordures, icônes, focus) sur les fonds de page.
  ["bleu", "chaux", LARGE_OR_UI],
  ["emeraude", "chaux", LARGE_OR_UI],
  ["ocre", "chaux", LARGE_OR_UI],
  ["safran", "bleu-profond", LARGE_OR_UI],
  ["safran", "bleu", LARGE_OR_UI],
  // Sections nuit : texte, accents et focus (safran : le bleu n'y passe pas).
  ...["nuit", "nuit-claire"].flatMap((bg): [string, string, number][] => [
    ["chaux", bg, TEXT],
    ["chaux-douce", bg, TEXT],
    ["safran", bg, TEXT],
    ["emeraude-nuit", bg, TEXT],
  ]),
  ["nuit", "safran", TEXT],
  ["nuit", "safran-clair", TEXT],
  ["white", "nuit", TEXT],
];

describe("contraste AA des jetons de couleur", () => {
  it("lit les jetons du @theme", () => {
    expect(colors.size).toBeGreaterThanOrEqual(15);
  });

  it.each(pairs)("%s sur %s ≥ %s:1", (text, background, min) => {
    expect(contrast(get(text), get(background))).toBeGreaterThanOrEqual(min);
  });
});

// Aucune couleur, durée ni courbe en dur dans les composants.
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "generated" ? [] : sources(path);
    return /\.(tsx|css)$/.test(name) && path !== join(__dirname, "globals.css") ? [path] : [];
  });
}

describe("aucune valeur de design en dur", () => {
  const forbidden: [string, RegExp][] = [
    ["couleur hexadécimale", /#[0-9a-fA-F]{3,8}\b/],
    ["rgb()/hsl()/oklch()", /\b(rgba?|hsla?|oklch)\(/],
    ["cubic-bezier", /cubic-bezier\(/],
    ["durée arbitraire", /\b(duration|delay)-\[|\d+m?s\b(?=\s*(ease|cubic))/],
    ["couleur arbitraire", /\b(bg|text|border|fill|stroke|from|to|via)-\[#/],
  ];

  it.each(sources(join(__dirname, "..")).map((p) => [p.replaceAll("\\", "/"), p]))(
    "%s",
    (_label, path) => {
      const text = readFileSync(path!, "utf8");
      for (const [name, re] of forbidden) expect(text, name).not.toMatch(re);
    },
  );
});
