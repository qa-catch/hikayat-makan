import type { BadgeTone } from "@/components/ui/badge";
import type { Nature } from "@/shared/content/nature";

/** Couleur de la nature d'un contenu. Le libellé écrit reste l'information : la couleur n'est qu'un renfort. */
export const natureTones: Record<Nature, BadgeTone> = {
  FACT: "emeraude",
  EDITORIAL: "bleu",
  LEGEND: "ocre",
  RECONSTRUCTION: "safran",
};

/** Cadre du bandeau (bordure de début + fond clair) selon la nature. */
export const natureFrames: Record<Nature, string> = {
  FACT: "border-emeraude bg-emeraude-clair",
  EDITORIAL: "border-bleu bg-bleu-clair",
  LEGEND: "border-ocre bg-ocre-clair",
  RECONSTRUCTION: "border-safran bg-safran-clair",
};
