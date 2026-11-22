import { useId } from "react";
import { useTranslations } from "next-intl";
import { PlaceCard } from "@/components/cards/place-card";
import { Container } from "@/components/layout/container";
import { forwardTransition } from "@/components/motion/page-transition";
import { SharedImage } from "@/components/motion/shared-image";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { ZelligeDivider } from "@/components/zellige/zellige";
import { DemoVisual } from "@/features/catalogue/specimen";
import { GabaritPage } from "@/features/gabarits/shell";
import { parcoursPlaces } from "./data";
import { parcoursPaths, placeVisual } from "./paths";

/**
 * Départ du parcours « الرحلة » : les cartes de lieu. Geste « Entrer » : le visuel d'une carte
 * (`SharedImage`) devient l'en-tête de la fiche ; le retour depuis la fiche fait le chemin inverse.
 */
export function ParcoursDepart() {
  const t = useTranslations("Parcours.depart");
  const ui = useTranslations("Ui");
  const placesId = useId();

  return (
    <GabaritPage testId="parcours-depart">
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
        <section aria-labelledby={placesId} className="space-y-4">
          <Heading level={2} id={placesId} className="sr-only">
            {t("placesTitle")}
          </Heading>
          <ul className="grid gap-6 sm:grid-cols-2">
            {parcoursPlaces.map((place) => (
              <li key={place.id} className="flex">
                <PlaceCard
                  id={place.id}
                  href={parcoursPaths.lieu(place.id)}
                  transitionTypes={forwardTransition}
                  title={place.title}
                  summary={place.summary}
                  category={place.category}
                  visual={
                    <SharedImage name={placeVisual(place.id)}>
                      <DemoVisual tone={place.tone} />
                    </SharedImage>
                  }
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
