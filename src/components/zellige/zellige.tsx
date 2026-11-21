import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  MEDALLION_HEART,
  MEDALLION_SEGMENTS,
  SMALL_STAR,
  VIEW_BOX,
  polygonPath,
  segmentsPath,
} from "./geometry";

/*
 * Motif de zellige (T5) : accent seulement (séparateur, cadre, état vide), jamais en fond.
 * Décoratif : `aria-hidden`, aucune chaîne. Couleur : `currentColor`. `cn` ne fusionne pas les
 * classes : un `className` passé remplace la taille et la couleur par défaut (les donner toutes deux).
 * Les chemins sont calculés une fois au chargement du module (composants serveur).
 */

const medallionStrokes = segmentsPath(MEDALLION_SEGMENTS);
const medallionHeart = polygonPath(MEDALLION_HEART);
const smallStar = polygonPath(SMALL_STAR);

type MotifProps = { className?: string; "data-testid"?: string };

/** Médaillon complet, fixe : deux étoiles à huit branches et un cœur plein. 56 px au moins (sinon `ZelligeStar`). */
export function ZelligeMedallion({ className, ...props }: MotifProps) {
  return (
    <svg
      viewBox={VIEW_BOX}
      aria-hidden="true"
      focusable="false"
      className={className ?? "size-20 text-bleu"}
      {...props}
    >
      <path
        d={medallionStrokes}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path d={medallionHeart} className="fill-safran" />
    </svg>
  );
}

/** Petite étoile pleine à huit branches (séparateur, coins de cadre). */
export function ZelligeStar({ className, ...props }: MotifProps) {
  return (
    <svg
      viewBox={VIEW_BOX}
      aria-hidden="true"
      focusable="false"
      className={className ?? "size-3 text-ocre"}
      {...props}
    >
      <path d={smallStar} fill="currentColor" />
    </svg>
  );
}

/** Séparateur décoratif entre deux blocs : filet, trois étoiles, filet. */
export function ZelligeDivider({ className, ...props }: MotifProps) {
  const rule = "h-px flex-1 bg-ocre-clair";
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center gap-2 text-ocre", className)}
      {...props}
    >
      <span className={rule} />
      <ZelligeStar className="size-2" />
      <ZelligeStar className="size-4" />
      <ZelligeStar className="size-2" />
      <span className={rule} />
    </div>
  );
}

/**
 * Cadre décoratif autour d'un visuel : double filet, étoile sur chaque coin du filet intérieur.
 * Les étoiles restent dans le cadre (aucun débordement, même en pleine largeur).
 * Le contenu est découpé au filet intérieur ; le cadre n'ajoute aucune sémantique.
 */
export function ZelligeFrame({
  children,
  className,
  ...props
}: MotifProps & { children: ReactNode }) {
  // Étoile de 12 px centrée sur le coin du filet intérieur (8 px de marge + 1 px de filet).
  const corner = "absolute size-3 text-ocre";
  return (
    <div className={cn("relative border border-ocre-clair p-2", className)} {...props}>
      <div className="h-full overflow-hidden border border-ocre-clair">{children}</div>
      <ZelligeStar className={cn(corner, "top-0.5 start-0.5")} />
      <ZelligeStar className={cn(corner, "top-0.5 end-0.5")} />
      <ZelligeStar className={cn(corner, "bottom-0.5 start-0.5")} />
      <ZelligeStar className={cn(corner, "bottom-0.5 end-0.5")} />
    </div>
  );
}
