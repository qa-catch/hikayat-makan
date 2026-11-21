import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import {
  MEDALLION_HEART,
  MEDALLION_SEGMENTS,
  VIEW_BOX,
  polygonPath,
  segmentPose,
} from "@/components/zellige/geometry";

/** Écart entre deux traits successifs. */
const STAGGER_MS = 50;

const traits = MEDALLION_SEGMENTS.map((segment) => ({ ...segment, ...segmentPose(segment) }));
const heart = polygonPath(MEDALLION_HEART);

type ZelligeLoaderProps = { className?: string; "data-testid"?: string };

/**
 * Chargement : le médaillon de zellige se dessine trait par trait, puis s'efface, en boucle.
 * CSS seul, aucun JavaScript. Chaque trait est posé à plat (`<line>` de 0 à sa longueur) puis
 * tourné par son groupe ; l'animation n'agit que sur `transform` (échelle) et `opacity`.
 * Sans animation (avant tout, `prefers-reduced-motion`), le médaillon est fixe et complet :
 * l'animation n'existe que sous `motion-safe:`. Un `className` passé remplace taille et couleur.
 */
export function ZelligeLoader({ className, ...props }: ZelligeLoaderProps) {
  const t = useTranslations("Ui");
  return (
    <div role="status" className={cn("inline-flex", className ?? "size-16 text-bleu")} {...props}>
      <span className="sr-only">{t("loading")}</span>
      <svg viewBox={VIEW_BOX} aria-hidden="true" focusable="false" className="size-full">
        {/* Attributs de trait hérités, posés une fois (poids du balisage). */}
        <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          {traits.map(({ from, length, angle }, index) => (
            <g key={index} transform={`translate(${from[0]} ${from[1]}) rotate(${angle})`}>
              <line
                x2={length}
                vectorEffect="non-scaling-stroke"
                className="origin-[0_50%] [transform-box:fill-box] motion-safe:animate-zellige-trait"
                style={{ animationDelay: `${index * STAGGER_MS}ms` }}
              />
            </g>
          ))}
        </g>
        <path
          d={heart}
          className="fill-safran origin-center [transform-box:fill-box] motion-safe:animate-zellige-coeur"
          style={{ animationDelay: `${traits.length * STAGGER_MS}ms` }}
        />
      </svg>
    </div>
  );
}
