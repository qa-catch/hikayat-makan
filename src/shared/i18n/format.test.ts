import { describe, expect, it } from "vitest";
import { dateFormatter, formatCurrency, formatDate, formatNumber, numberFormatter } from "./format";

// Chiffres arabes-indiens (U+0660–0669) et persans (U+06F0–06F9).
const NON_LATIN_DIGIT = /[٠-٩۰-۹]/;

describe("formatNumber", () => {
  it("utilise les chiffres occidentaux et les séparateurs ar-MA", () => {
    expect(formatNumber(1234567.89)).toBe("1.234.567,89");
  });

  it("garde les chiffres occidentaux avec des options", () => {
    const out = formatNumber(0.256, { style: "percent" });
    expect(out).toContain("26");
    expect(out).not.toMatch(NON_LATIN_DIGIT);
  });

  it("impose latn même si un appelant force un autre système", () => {
    const options = { numberingSystem: "arab" } as Intl.NumberFormatOptions;
    expect(numberFormatter(options).resolvedOptions().numberingSystem).toBe("latn");
  });
});

describe("formatCurrency", () => {
  it("formate en dirhams avec des chiffres occidentaux", () => {
    const out = formatCurrency(1234.5);
    expect(out).toContain("1.234,50");
    expect(out).toContain("د.م.");
    expect(out).not.toMatch(NON_LATIN_DIGIT);
  });
});

describe("formatDate", () => {
  it("affiche l'heure de Casablanca, pas celle du serveur", () => {
    const formatter = dateFormatter();
    expect(formatter.resolvedOptions().timeZone).toBe("Africa/Casablanca");
    expect(formatter.resolvedOptions().numberingSystem).toBe("latn");
  });

  it("change de jour selon le fuseau de Casablanca (UTC+1 en janvier 2026)", () => {
    const out = formatDate(new Date("2026-01-15T23:30:00Z"), {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    expect(out).toMatch(/^16\D+1\D+2026$/);
  });

  it("donne un mois en arabe et des chiffres occidentaux", () => {
    const out = formatDate(new Date("2026-01-15T12:00:00Z"));
    expect(out).toContain("2026");
    expect(out).toMatch(/[؀-ۿ]/);
    expect(out).not.toMatch(NON_LATIN_DIGIT);
  });
});
