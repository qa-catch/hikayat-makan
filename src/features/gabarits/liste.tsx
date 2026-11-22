import { useId } from "react";
import { useTranslations } from "next-intl";
import { PlaceCard } from "@/components/cards/place-card";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { ZelligeDivider } from "@/components/zellige/zellige";
import { DemoVisual } from "@/features/catalogue/specimen";
import { formatNumber } from "@/shared/i18n/format";
import { demoList } from "./demo-data";
import { gabaritPaths } from "./paths";
import { GabaritPage } from "./shell";

const tones = ["bleu", "emeraude", "ocre"] as const;

/** Gabarit liste : titre, nombre de résultats, grille de cartes (1, 2 puis 3 colonnes). */
export function Liste() {
  const t = useTranslations("Gabarits.liste");
  const ui = useTranslations("Ui");
  const resultsId = useId();

  return (
    <GabaritPage testId="gabarit-liste">
      <Container className="space-y-6 py-section">
        <header className="space-y-3">
          <div>
            <Badge tone="safran">{ui("demo")}</Badge>
          </div>
          <Heading level={1}>{t("title")}</Heading>
          <p dir="auto" className="max-w-prose text-base text-encre-douce">
            {t("intro")}
          </p>
        </header>
        <ZelligeDivider className="max-w-xs" />
        <section aria-labelledby={resultsId} className="space-y-4">
          <Heading level={2} id={resultsId} className="sr-only">
            {t("resultsTitle")}
          </Heading>
          <p data-testid="gabarit-liste-count" className="text-sm font-bold text-encre-douce">
            {t("count", { count: formatNumber(demoList.length) })}
          </p>
          <ul data-testid="gabarit-liste-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoList.map((place, index) => (
              <li key={place.id} className="flex">
                <PlaceCard
                  id={place.id}
                  href={gabaritPaths.lieu}
                  title={place.title}
                  summary={place.summary}
                  category={place.category}
                  visual={<DemoVisual tone={tones[index % tones.length]} />}
                  demo
                  className="w-full"
                />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </GabaritPage>
  );
}
