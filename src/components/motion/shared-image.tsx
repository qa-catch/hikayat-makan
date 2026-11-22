import { ViewTransition, type ReactNode } from "react";

/**
 * Visuel partagé entre deux pages : la vignette d'une carte devient l'en-tête de la page
 * suivante (geste « Entrer »), le retour fait le chemin inverse. Les deux côtés portent le même
 * `name`, unique sur chaque page. `default="none"` : le visuel ne s'anime pas lors des autres
 * transitions ; `share="morph"` : la morphose garde la classe stylée dans `globals.css`.
 * La morphose ne joue que si la page d'arrivée est rendue dans la même validation (page
 * préchargée) ; sinon le visuel apparaît sans animation.
 */
export function SharedImage({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
