import { ViewTransition, type ReactNode } from "react";

/**
 * Types de transition à poser sur un lien (`transitionTypes` de `Link`) : `NAV_FORWARD` pour
 * avancer dans le parcours, `NAV_BACK` pour revenir. Le sens du glissement suit la direction
 * de lecture (RTL : on avance vers la gauche) ; voir `src/styles/globals.css`.
 */
export const NAV_FORWARD = "nav-forward";
export const NAV_BACK = "nav-back";
export const forwardTransition = [NAV_FORWARD];
export const backTransition = [NAV_BACK];

const directional = { [NAV_FORWARD]: NAV_FORWARD, [NAV_BACK]: NAV_BACK, default: "none" };

/**
 * Transition de page : le contenu glisse et se fond selon le type de la navigation.
 * À placer dans chaque page (pas dans un layout : un layout persiste, rien n'y entre ni n'en
 * sort). Une navigation sans type (retour du navigateur, rafraîchissement) ne s'anime pas.
 * Repose sur `<ViewTransition>` de React 19.3 ; sans prise en charge, la page change sans
 * animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      {children}
    </ViewTransition>
  );
}
