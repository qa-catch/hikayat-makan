import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { Nature } from "@/shared/content/nature";
import { natureFrames } from "./nature";

/**
 * Bandeau de nature du contenu (`FACT`, `EDITORIAL`, `LEGEND`, `RECONSTRUCTION`) : règle absolue
 * du produit, aucune fiction présentée comme un fait. Le libellé dit la nature, la couleur la renforce.
 */
export function NatureBanner({ nature, className }: { nature: Nature; className?: string }) {
  const t = useTranslations("Content");

  return (
    <div
      role="note"
      data-testid={`nature-banner-${nature.toLowerCase()}`}
      className={cn(
        "space-y-1 rounded-md border-s-4 p-4 text-encre",
        natureFrames[nature],
        className,
      )}
    >
      <p className="text-base font-bold">
        {t("natureLabel")}: {t(`nature.${nature}.label`)}
      </p>
      <p className="text-sm">{t(`nature.${nature}.description`)}</p>
    </div>
  );
}
