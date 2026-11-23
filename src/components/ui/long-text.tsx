import { cn } from "@/lib/cn";

/**
 * Texte long en colonne de lecture étroite (≈ 65 caractères). Chaque paragraphe porte
 * `dir="auto"` : un paragraphe latin ou mixte prend sa propre direction. Couleur héritée (encre sur
 * chaux, chaux sur une section nuit).
 */
export function LongText({
  paragraphs,
  className,
  ...props
}: {
  paragraphs: readonly string[];
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-prose space-y-5 text-base", className)} {...props}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} dir="auto" className="text-start">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
