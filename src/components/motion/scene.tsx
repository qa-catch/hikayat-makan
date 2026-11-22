import type { CSSProperties, ReactNode } from "react";
import { SplitLayout } from "@/components/layout/split-layout";
import { cn } from "@/lib/cn";

/**
 * Effets de scène, limités à la photo en phase 2 : `zoom` (vers un détail), `pan` (déplacement,
 * de droite à gauche en RTL), `appear` (apparition). Carte et frise attendront leurs phases.
 */
export const SCENE_EFFECTS = ["zoom", "pan", "appear"] as const;
export type SceneEffect = (typeof SCENE_EFFECTS)[number];

type SceneProps = {
  testId: string;
  effect: SceneEffect;
  /** Visuel décoratif (`aria-hidden`) : le texte de la scène porte tout le sens. */
  visual: ReactNode;
  /** Point du détail visé par `zoom`, en % du visuel depuis son coin haut gauche (l'image ne s'inverse pas en RTL). */
  focus?: { x: number; y: number };
  className?: string;
  children: ReactNode;
};

/**
 * Scène d'une histoire (geste « Parcourir ») : visuel fixé qui se transforme pendant que le
 * texte défile, au rythme du défilement natif (animation CSS pilotée par le défilement, aucun
 * JavaScript). Le texte n'est jamais animé : il est complet et visible dès le HTML serveur.
 * Repli : sans prise en charge, version allégée ou `prefers-reduced-motion`, visuel immobile.
 */
export function Scene({ testId, effect, visual, focus, className, children }: SceneProps) {
  const style = focus
    ? ({ "--scene-focus": `${focus.x}% ${focus.y}%` } as CSSProperties)
    : undefined;
  return (
    <SplitLayout
      testId={testId}
      align="center"
      stickyOnMobile
      className={cn("motion-scene", className)}
      visual={
        <div className="motion-scene-visual size-full" data-effect={effect} style={style}>
          {visual}
        </div>
      }
    >
      {children}
    </SplitLayout>
  );
}
