import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Paires texte/fond vérifiées en AA par src/styles/tokens.test.ts.
const tones = {
  neutre: "bg-chaux-sombre text-encre",
  bleu: "bg-bleu-clair text-bleu-profond",
  emeraude: "bg-emeraude-clair text-emeraude",
  ocre: "bg-ocre-clair text-ocre",
  safran: "bg-safran-clair text-encre",
} as const;

export type BadgeTone = keyof typeof tones;

type BadgeProps = Omit<ComponentProps<"span">, "dir"> & { tone?: BadgeTone };

/** Étiquette courte, non interactive. */
export function Badge({ tone = "neutre", className, ...props }: BadgeProps) {
  return (
    <span
      dir="auto"
      className={cn(
        "inline-flex items-center rounded-full px-3 text-sm font-bold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
