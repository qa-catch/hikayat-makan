import { describe, expect, it } from "vitest";
import { MASK, maskString, maskValue } from "./mask";

describe("maskValue", () => {
  it("masque les clés sensibles, à tout niveau", () => {
    const out = maskValue({
      password: "p1",
      nested: { apiKey: "k", Authorization: "Bearer abc", items: [{ sessionToken: "t" }] },
      ok: "visible",
    });
    expect(out).toEqual({
      password: MASK,
      nested: { apiKey: MASK, Authorization: MASK, items: [{ sessionToken: MASK }] },
      ok: "visible",
    });
  });

  it("n'altère pas l'objet reçu", () => {
    const input = { token: "t" };
    maskValue(input);
    expect(input).toEqual({ token: "t" });
  });

  it("sérialise les erreurs et masque leur message", () => {
    const out = maskValue(new Error("échec sur postgresql://u:s3cret@h:5432/db")) as {
      message: string;
      stack: string;
    };
    expect(out.message).not.toContain("s3cret");
    expect(out.stack).not.toContain("s3cret");
  });

  it("supporte les références circulaires et limite la profondeur", () => {
    const a: Record<string, unknown> = {};
    a.self = a;
    expect(maskValue(a)).toEqual({ self: "[circulaire]" });
    expect(JSON.stringify(maskValue({ a: { b: { c: { d: { e: { f: { g: 1 } } } } } } }))).toContain(
      "[trop profond]",
    );
  });
});

describe("maskString", () => {
  it.each([
    ["postgresql://hikayat:s3cret@127.0.0.1:5432/db", "s3cret"],
    ["Authorization: Bearer abc.def-123", "abc.def-123"],
    ["jeton eyJhbGciOi.eyJzdWIiOi.SflKxwRJSM fin", "eyJhbGciOi"],
    ["contact : jean.dupont@example.com", "jean.dupont"],
  ])("masque %s", (input, leaked) => {
    expect(maskString(input)).not.toContain(leaked);
  });

  it("garde le reste du texte", () => {
    expect(maskString("connexion à postgresql://u:p@h/db refusée")).toBe(
      `connexion à postgresql://${MASK}@h/db refusée`,
    );
  });

  it("tronque les textes trop longs", () => {
    expect(maskString("x".repeat(5_000)).length).toBeLessThan(4_100);
  });
});
