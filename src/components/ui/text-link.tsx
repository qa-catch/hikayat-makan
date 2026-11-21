import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type TextLinkProps = ComponentProps<typeof Link> & {
  /**
   * Lien au milieu d'une phrase : exception WCAG 2.5.8 à la zone de 44 px. Les autres liens
   * (listes, pied de page) gardent la zone tactile complète.
   */
  inline?: boolean;
};

export function TextLink({ inline = false, className, ...props }: TextLinkProps) {
  return (
    <Link
      data-inline={inline ? "true" : undefined}
      className={cn(
        "text-bleu underline decoration-1 underline-offset-4 hover:text-bleu-profond",
        !inline && "inline-flex min-h-touch items-center",
        className,
      )}
      {...props}
    />
  );
}
