import { describe, expect, it } from "vitest";
import { motionLevel } from "./level";

describe("motionLevel (repli des animations)", () => {
  it("prefers-reduced-motion l'emporte sur tout : aucune animation", () => {
    expect(
      motionLevel({
        reducedMotion: true,
        effectiveType: "4g",
        deviceMemory: 8,
        hardwareConcurrency: 8,
      }),
    ).toBe("none");
    expect(motionLevel({ reducedMotion: true, saveData: true })).toBe("none");
  });

  it("sans aucun signal d'appareil : version complète", () => {
    expect(motionLevel({ reducedMotion: false })).toBe("full");
  });

  it("smartphone milieu de gamme en 4G : version complète", () => {
    expect(
      motionLevel({
        reducedMotion: false,
        effectiveType: "4g",
        deviceMemory: 4,
        hardwareConcurrency: 8,
      }),
    ).toBe("full");
  });

  it("économie de données demandée : version allégée", () => {
    expect(motionLevel({ reducedMotion: false, saveData: true, effectiveType: "4g" })).toBe("lite");
  });

  it.each(["slow-2g", "2g", "3g"])("connexion %s : version allégée", (effectiveType) => {
    expect(motionLevel({ reducedMotion: false, effectiveType })).toBe("lite");
  });

  it("2 Gio de mémoire ou moins : version allégée", () => {
    expect(motionLevel({ reducedMotion: false, deviceMemory: 2 })).toBe("lite");
    expect(motionLevel({ reducedMotion: false, deviceMemory: 0.5 })).toBe("lite");
    expect(motionLevel({ reducedMotion: false, deviceMemory: 4 })).toBe("full");
  });

  it("2 cœurs ou moins : version allégée ; 0 (inconnu) ne compte pas", () => {
    expect(motionLevel({ reducedMotion: false, hardwareConcurrency: 2 })).toBe("lite");
    expect(motionLevel({ reducedMotion: false, hardwareConcurrency: 4 })).toBe("full");
    expect(motionLevel({ reducedMotion: false, hardwareConcurrency: 0 })).toBe("full");
  });
});
