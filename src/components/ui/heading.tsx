import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Reem Kufi (affiche) dès 2xl seulement : en dessous, ج et ب initiaux se confondent (docs/polices.md).
const sizes = {
  "3xl": "font-affiche text-3xl",
  "2xl": "font-affiche text-2xl",
  xl: "text-xl",
  lg: "text-lg",
} as const;

export type HeadingSize = keyof typeof sizes;

// Taille par défaut selon le niveau : le niveau décrit la structure, la taille l'apparence.
const defaultSize: Record<1 | 2 | 3 | 4, HeadingSize> = { 1: "3xl", 2: "2xl", 3: "xl", 4: "lg" };

type HeadingProps = Omit<ComponentProps<"h1">, "dir"> & {
  level: 1 | 2 | 3 | 4;
  size?: HeadingSize;
  /** `inverse` : blanc, pour un fond bleu profond, bleu, émeraude ou ocre (paires vérifiées en AA). */
  tone?: "default" | "inverse";
};

/** Titre : police et graisse viennent de globals.css ; `dir="auto"` pour les titres mêlant arabe et latin. */
export function Heading({ level, size, tone = "default", className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      dir="auto"
      className={cn(
        "text-start",
        tone === "inverse" ? "text-white" : "text-bleu-profond",
        sizes[size ?? defaultSize[level]],
        className,
      )}
      {...props}
    />
  );
}
