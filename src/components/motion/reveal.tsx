import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Apparition à l'entrée dans l'écran : léger fondu et montée, au rythme du défilement natif
 * (animation CSS pilotée par le défilement, aucun JavaScript). Un bloc déjà dans l'écran au
 * chargement est visible tout de suite. Repli : sans prise en charge ou avec
 * `prefers-reduced-motion`, aucun effet ; version allégée : fondu seul.
 */
export function Reveal({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("motion-reveal", className)} {...props} />;
}
