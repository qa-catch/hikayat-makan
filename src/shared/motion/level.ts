/**
 * Niveau d'animation d'une visite (T7). Décidé une fois après l'hydratation, posé sur `<html>`
 * (`data-motion`), lu par le CSS des primitives (`src/styles/globals.css`).
 *
 * - `full` : toutes les primitives.
 * - `lite` : appareil ou connexion modestes : fondus seulement (ni glissement, ni morphose,
 *   ni effet de scène).
 * - `none` : `prefers-reduced-motion: reduce` : page classique complète, aucune animation.
 */
export type MotionLevel = "full" | "lite" | "none";

/** Ce que le navigateur dit de l'appareil ; chaque champ peut manquer (API limitées). */
export type MotionSignals = {
  reducedMotion: boolean;
  /** `navigator.connection.saveData` (Network Information, disponibilité limitée). */
  saveData?: boolean;
  /** `navigator.connection.effectiveType` : `slow-2g`, `2g`, `3g` ou `4g`. */
  effectiveType?: string;
  /** `navigator.deviceMemory` en Gio (non standard, Chromium). */
  deviceMemory?: number;
  /** `navigator.hardwareConcurrency` (Baseline). */
  hardwareConcurrency?: number;
};

/** Connexions jugées modestes. La 4G (`4g`) garde la version complète. */
const SLOW_CONNECTIONS = new Set(["slow-2g", "2g", "3g"]);

/** Seuils « appareil modeste » : 2 Gio de mémoire ou moins, 2 cœurs ou moins. */
export const LITE_MAX_DEVICE_MEMORY = 2;
export const LITE_MAX_CORES = 2;

/** Sans signal, la version complète : un signal absent n'est pas une preuve de faiblesse. */
export function motionLevel(signals: MotionSignals): MotionLevel {
  if (signals.reducedMotion) return "none";
  if (signals.saveData) return "lite";
  if (signals.effectiveType !== undefined && SLOW_CONNECTIONS.has(signals.effectiveType)) {
    return "lite";
  }
  if (signals.deviceMemory !== undefined && signals.deviceMemory <= LITE_MAX_DEVICE_MEMORY) {
    return "lite";
  }
  if (
    signals.hardwareConcurrency !== undefined &&
    signals.hardwareConcurrency > 0 &&
    signals.hardwareConcurrency <= LITE_MAX_CORES
  ) {
    return "lite";
  }
  return "full";
}
