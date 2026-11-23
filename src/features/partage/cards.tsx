import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/ui/brand-mark";
import { ZelligeMedallion } from "@/components/zellige/zellige";

/** Taille de l'image Open Graph (recommandation Open Graph : 1200 × 630, rapport 1,91:1). */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Taille de l'icône d'écran d'accueil iOS (`apple-icon`). */
export const APPLE_ICON_SIZE = 180;

/**
 * Image de partage par défaut (T9), capturée par `pnpm og:image` : logo, nom et description du
 * site (police de titres de T3), médaillon de zellige de T5 en accent, coupé par le bord.
 */
export function OgCard() {
  const t = useTranslations("Metadata");
  return (
    <div
      data-testid="og-card"
      className="relative flex h-[630px] w-[1200px] shrink-0 items-center overflow-hidden bg-bleu-profond"
    >
      <ZelligeMedallion className="absolute -end-36 top-1/2 size-[560px] -translate-y-1/2 text-safran" />
      <div className="relative flex max-w-[680px] flex-col gap-8 ps-24">
        <BrandMark tone="dark" className="size-32" />
        <p className="font-affiche text-[96px] leading-tight font-bold text-chaux">{t("title")}</p>
        <p className="text-[34px] leading-normal text-bleu-clair">{t("description")}</p>
      </div>
    </div>
  );
}

/** Icône d'écran d'accueil iOS : fond plein (iOS arrondit les coins et ne garde pas la transparence). */
export function AppleIconCard() {
  return (
    <div
      data-testid="apple-icon-card"
      className="flex size-[180px] shrink-0 items-center justify-center bg-chaux"
    >
      <BrandMark className="size-[136px]" />
    </div>
  );
}
