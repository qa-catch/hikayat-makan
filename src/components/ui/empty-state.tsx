import type { ReactNode } from "react";
import { ZelligeMedallion } from "@/components/zellige/zellige";
import { cn } from "@/lib/cn";
import { Heading } from "./heading";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Bouton ou lien proposant la suite. */
  action?: ReactNode;
  /** Illustration décorative ; par défaut le médaillon de zellige, `null` pour aucune. */
  visual?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  className?: string;
  "data-testid"?: string;
};

/** Écran sans contenu : dit pourquoi c'est vide et propose une suite. */
export function EmptyState({
  title,
  description,
  action,
  visual = <ZelligeMedallion />,
  headingLevel = 2,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border border-ocre-clair bg-white p-8 text-center",
        className,
      )}
      {...props}
    >
      {visual && <div aria-hidden="true">{visual}</div>}
      <Heading level={headingLevel} size="xl" className="text-center">
        {title}
      </Heading>
      {description && (
        <p dir="auto" className="max-w-prose text-base text-encre-douce">
          {description}
        </p>
      )}
      {action}
    </section>
  );
}
