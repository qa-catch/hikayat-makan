import { useTranslations } from "next-intl";
import { SplitLayout } from "@/components/layout/split-layout";
import { PlaceCard } from "@/components/cards/place-card";
import { Scene } from "@/components/motion/scene";
import { NatureBanner } from "@/components/content/nature-banner";
import { SourceList } from "@/components/content/source-list";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { LongText } from "@/components/ui/long-text";
import { ZelligeDivider } from "@/components/zellige/zellige";
import { demoSources } from "@/features/catalogue/demo-data";
import { DemoVisual } from "@/features/catalogue/specimen";
import { formatNumber } from "@/shared/i18n/format";
import { demoNextPlace, demoStory } from "./demo-data";
import { gabaritPaths } from "./paths";
import { GabaritPage } from "./shell";

/**
 * Gabarit histoire (lecture immersive) : bandeau de nature en tête, colonne de lecture étroite,
 * une scène par écran (visuel et texte court), sources en fin d'article, puis la suite du
 * parcours. Chaque scène est une `Scene` : visuel fixé qui se transforme au défilement.
 */

export function Histoire() {
  const t = useTranslations("Gabarits.histoire");
  const cards = useTranslations("Cards");
  const ui = useTranslations("Ui");

  return (
    <GabaritPage testId="gabarit-histoire">
      <SplitLayout testId="gabarit-histoire-header">
        <header className="space-y-4">
          <NatureBanner nature={demoStory.nature} />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="safran">{ui("demo")}</Badge>
            <span className="text-sm text-encre-douce">
              {cards("readingTime", { minutes: formatNumber(demoStory.minutes) })}
            </span>
          </div>
          <Heading level={1}>{demoStory.title}</Heading>
        </header>
      </SplitLayout>

      {/* Récit : section nuit pleine largeur (refonte), en-tête et suite restent sur chaux. */}
      <div className="surface-nuit">
        {demoStory.scenes.map((scene) => (
          <Scene
            key={scene.id}
            testId={`gabarit-histoire-scene-${scene.id}`}
            effect={scene.effect}
            focus={scene.focus}
            visual={<DemoVisual tone={scene.tone} />}
          >
            <Heading level={2} tone="inverse">
              {scene.title}
            </Heading>
            <LongText paragraphs={scene.paragraphs} />
          </Scene>
        ))}
      </div>

      <SplitLayout testId="gabarit-histoire-suite">
        <SourceList sources={demoSources} />
        <ZelligeDivider />
        <section aria-labelledby="histoire-suite" className="space-y-4">
          <Heading level={2} id="histoire-suite">
            {t("continueTitle")}
          </Heading>
          <p className="text-base text-encre-douce">{t("continueIntro")}</p>
          <PlaceCard
            id={demoNextPlace.id}
            href={gabaritPaths.lieu}
            title={demoNextPlace.title}
            summary={demoNextPlace.summary}
            category={demoNextPlace.category}
            visual={<DemoVisual tone="ocre" />}
            demo
          />
        </section>
      </SplitLayout>
    </GabaritPage>
  );
}
