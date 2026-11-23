import { useTranslations } from "next-intl";
import { PlaceCard } from "@/components/cards/place-card";
import { NatureBanner } from "@/components/content/nature-banner";
import { SourceList } from "@/components/content/source-list";
import { SplitLayout } from "@/components/layout/split-layout";
import { backTransition, forwardTransition } from "@/components/motion/page-transition";
import { Scene } from "@/components/motion/scene";
import { SharedImage } from "@/components/motion/shared-image";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { DirectionalIcon } from "@/components/ui/icons";
import { ZelligeDivider } from "@/components/zellige/zellige";
import { demoSources } from "@/features/catalogue/demo-data";
import { DemoVisual } from "@/features/catalogue/specimen";
import { GabaritPage } from "@/features/gabarits/shell";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/shared/i18n/format";
import { nextPlace, type ParcoursPlace } from "./data";
import { parcoursPaths, placeVisual } from "./paths";

/**
 * Histoire d'un lieu (geste « Parcourir ») : une `Scene` par écran, avec sa place dans la
 * progression ; la fin (geste « Poursuivre ») ouvre sur le lieu suivant, dont la carte partage
 * son visuel avec l'en-tête de la fiche d'arrivée.
 */
export function ParcoursHistoire({ place }: { place: ParcoursPlace }) {
  const t = useTranslations("Parcours.histoire");
  const cards = useTranslations("Cards");
  const ui = useTranslations("Ui");
  const { story } = place;
  const next = nextPlace(place.id);
  const total = story.scenes.length;

  return (
    <GabaritPage testId="parcours-histoire">
      <SplitLayout testId="parcours-histoire-header">
        <Link
          href={parcoursPaths.lieu(place.id)}
          transitionTypes={backTransition}
          data-testid="parcours-histoire-back"
          className="inline-flex min-h-touch items-center gap-1 text-base font-bold text-bleu underline decoration-1 underline-offset-4"
        >
          <DirectionalIcon direction="back" width={20} height={20} />
          {t("back", { title: place.title })}
        </Link>
        <header className="space-y-4">
          <NatureBanner nature={story.nature} />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="safran">{ui("demo")}</Badge>
            <span className="text-sm text-encre-douce">
              {cards("readingTime", { minutes: formatNumber(story.minutes) })}
            </span>
          </div>
          <Heading level={1}>{story.title}</Heading>
        </header>
      </SplitLayout>

      {/* Récit : section nuit pleine largeur (refonte), en-tête et suite restent sur chaux. */}
      <div className="surface-nuit">
        {story.scenes.map((scene, index) => (
          <Scene
            key={scene.id}
            testId={`parcours-scene-${scene.id}`}
            effect={scene.effect}
            focus={scene.focus}
            visual={<DemoVisual tone={scene.tone} />}
          >
            {/* Progression sans animation : un trait par scène, de droite à gauche, et le texte. */}
            <p
              data-testid={`parcours-scene-${scene.id}-progress`}
              className="flex items-center gap-3 text-sm font-bold text-chaux-douce"
            >
              <span aria-hidden="true" className="flex gap-1">
                {story.scenes.map((step, stepIndex) => (
                  <span
                    key={step.id}
                    className={cn(
                      "h-1.5 w-6 rounded-full",
                      stepIndex <= index ? "bg-safran" : "bg-encre-douce",
                    )}
                  />
                ))}
              </span>
              {t("progress", { current: formatNumber(index + 1), total: formatNumber(total) })}
            </p>
            <Heading level={2} tone="inverse">
              {scene.title}
            </Heading>
            <p dir="auto" className="text-lg">
              {scene.text}
            </p>
          </Scene>
        ))}
      </div>

      <SplitLayout testId="parcours-histoire-suite">
        <SourceList sources={demoSources} />
        <ZelligeDivider />
        <section aria-labelledby="parcours-suite" className="space-y-4">
          <Heading level={2} id="parcours-suite">
            {t("continueTitle")}
          </Heading>
          <p className="text-base text-encre-douce">{t("continueIntro")}</p>
          <PlaceCard
            id={next.id}
            href={parcoursPaths.lieu(next.id)}
            transitionTypes={forwardTransition}
            title={next.title}
            summary={next.summary}
            category={next.category}
            visual={
              <SharedImage name={placeVisual(next.id)}>
                <DemoVisual tone={next.tone} />
              </SharedImage>
            }
            demo
          />
        </section>
      </SplitLayout>
    </GabaritPage>
  );
}
