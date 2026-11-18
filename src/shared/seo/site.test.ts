import { describe, expect, it } from "vitest";
import { isIndexable, resolveSiteUrl } from "./site";

describe("resolveSiteUrl", () => {
  it("prend SITE_URL en priorité et n'en garde que l'origine", () => {
    const url = resolveSiteUrl({
      SITE_URL: "https://exemple.ma/",
      VERCEL_PROJECT_PRODUCTION_URL: "autre.vercel.app",
    });
    expect(url.href).toBe("https://exemple.ma/");
  });

  it("se rabat sur le domaine de production Vercel, en HTTPS", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "exemple.ma" }).href).toBe(
      "https://exemple.ma/",
    );
  });

  it("exige SITE_URL hors Vercel", () => {
    expect(() => resolveSiteUrl({})).toThrowError(/SITE_URL obligatoire/);
  });

  it.each(["exemple.ma", "ftp://exemple.ma", "https://exemple.ma/ar", "https://exemple.ma/?a=1"])(
    "refuse SITE_URL=%s",
    (value) => {
      expect(() => resolveSiteUrl({ SITE_URL: value })).toThrowError(/SITE_URL invalide/);
    },
  );
});

describe("isIndexable", () => {
  it.each([
    [undefined, true],
    ["production", true],
    ["preview", false],
    ["development", false],
  ])("VERCEL_ENV=%s → %s", (vercelEnv, expected) => {
    expect(isIndexable({ VERCEL_ENV: vercelEnv })).toBe(expected);
  });
});
