"use client";

import { useEffect } from "react";
import { motionLevel, type MotionSignals } from "@/shared/motion/level";

type NavigatorSignals = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function readSignals(): MotionSignals {
  const nav = navigator as NavigatorSignals;
  return {
    reducedMotion: matchMedia(REDUCED_MOTION).matches,
    saveData: nav.connection?.saveData,
    effectiveType: nav.connection?.effectiveType,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
  };
}

function apply() {
  document.documentElement.dataset.motion = motionLevel(readSignals());
}

/**
 * Pose `data-motion` (`full`, `lite`, `none`) sur `<html>` une fois la page au repos.
 * Ne rend rien ; sans JavaScript ou avant son passage, le CSS suit `prefers-reduced-motion`
 * seul. Suit aussi un changement de préférence pendant la visite.
 */
export function MotionLevel() {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(apply);
    const query = matchMedia(REDUCED_MOTION);
    query.addEventListener("change", apply);
    return () => {
      cancel(handle);
      query.removeEventListener("change", apply);
    };
  }, []);
  return null;
}
