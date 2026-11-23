import { polygonPath, starOutline, type Point } from "@/components/zellige/geometry";
import { cn } from "@/lib/cn";

/**
 * Logo « الحكي » (choix C, docs/decisions.md), repère 64 × 64 : une bulle de parole en arc,
 * percée d'une porte (حكاية et مكان). La porte est un vrai trou (evenodd) : le fond passe au travers.
 */
export const MARK_BUBBLE =
  "M9 54V36A25 25 0 1 1 55 36V54H53L56 63L45 54ZM23 54V42A10 10 0 1 1 41 42V54Z";

const STAR_CENTER: Point = [32, 15];

/**
 * Étoile de zellige à huit branches (deux carrés, comme le motif de T5), évidée au centre par
 * une étoile plus petite : un trou (evenodd) qui laisse voir la bulle.
 */
export const MARK_STAR =
  polygonPath(starOutline(10.5, -90, STAR_CENTER)) +
  polygonPath(starOutline(5.5, -90, STAR_CENTER));

/**
 * Symbole seul, décoratif : le nom du site est toujours écrit à côté (lien de l'en-tête).
 * `tone="dark"` : bulle en blanc chaux, pour les fonds sombres.
 */
export function BrandMark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      data-testid="brand-mark"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        d={MARK_BUBBLE}
        className={tone === "dark" ? "fill-chaux" : "fill-emeraude"}
      />
      <path fillRule="evenodd" d={MARK_STAR} className="fill-safran" />
    </svg>
  );
}
