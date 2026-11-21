import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentProps<"div"> & {
  as?: "div" | "main" | "section";
};

/**
 * Conteneur de page : largeur maximale centrée, marge latérale d'au moins `gutter`, élargie
 * par les zones sûres (encoche en paysage).
 */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-6xl px-[max(var(--spacing-gutter),env(safe-area-inset-left),env(safe-area-inset-right))]",
        className,
      )}
      {...props}
    />
  );
}
