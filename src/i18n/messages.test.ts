import { describe, expect, it } from "vitest";
import ar from "../../messages/ar.json";

// Les nombres et dates des messages passeraient par le formateur de next-intl (locale `ar`),
// sans garantie de chiffres occidentaux : on les formate avec `@/shared/i18n/format`.
const ICU_FORMATTED_ARG = /\{\s*\w+\s*,\s*(?:number|date|time)\b|#/;

function entries(node: unknown, path: string[] = []): [string, string][] {
  if (typeof node === "string") return [[path.join("."), node]];
  return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
    entries(value, [...path, key]),
  );
}

describe("messages/ar.json", () => {
  it.each(entries(ar))("%s ne formate ni nombre ni date", (_key, message) => {
    expect(message).not.toMatch(ICU_FORMATTED_ARG);
  });
});
