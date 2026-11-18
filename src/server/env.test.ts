import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

const url = "postgresql://hikayat:s3cret-value@127.0.0.1:5432/hikayat";

describe("parseEnv", () => {
  it("accepte une configuration complète", () => {
    expect(parseEnv({ DATABASE_URL: url })).toEqual({ DATABASE_URL: url });
  });

  it("nomme la variable manquante dans une erreur lisible", () => {
    expect(() => parseEnv({})).toThrowError(/Configuration invalide[\s\S]*DATABASE_URL/);
  });

  it("refuse une variable vide", () => {
    expect(() => parseEnv({ DATABASE_URL: "" })).toThrowError(/DATABASE_URL/);
  });

  it("refuse une URL qui n'est pas PostgreSQL", () => {
    expect(() => parseEnv({ DATABASE_URL: "mysql://u:p@h/db" })).toThrowError(/DATABASE_URL/);
  });

  it("ne reprend jamais la valeur reçue dans l'erreur", () => {
    const secret = "mysql://hikayat:s3cret-value@h/db";
    try {
      parseEnv({ DATABASE_URL: secret });
      expect.unreachable();
    } catch (e) {
      expect((e as Error).message).not.toContain("s3cret-value");
    }
  });
});
