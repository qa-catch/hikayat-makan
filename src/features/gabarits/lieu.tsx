import { useTranslations } from "next-intl";
import { StoryCard } from "@/components/cards/story-card";
import { SplitLayout } from "@/components/layout/split-layout";
import { backTransition } from "@/components/motion/page-transition";
import { SharedImage } from "@/components/motion/shared-image";
import { SourceList } from "@/components/content/source-list";
import { UnverifiedNotice } from "@/components/content/unverified-notice";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { DirectionalIcon, Icon } from "@/components/ui/icons";
import { LongText } from "@/components/ui/long-text";
import { ZelligeDivider } from "@/components/zellige/zellige";
import { Link } from "@/i18n/navigation";
import { demoSources } from "@/features/catalogue/demo-data";
import { DemoVisual } from "@/features/catalogue/specimen";
import { demoPlace, demoRelatedStories } from "./demo-data";
import { LIEU_VISUAL, gabaritPaths } from "./paths";
import { GabaritPage } from "./shell";

/**
 * Gabarit fiche lieu : le visuel d'en-tête est partagé (`SharedImage`, nom `LIEU_VISUAL`) ; la
 * carte qui y mène portera le même nom (T8). Mobile :
 * visuel en haut, texte dessous ; tablette et desktop : visuel d'un côté, texte de l'autre.
 */
export function Lieu() {
  const t = useTranslations("Gabarits.lieu");
  const ui = useTranslations("Ui");

  return (
    <GabaritPage name="lieu">
      <SplitLayout
        testId="gabarit-lieu-split"
        visual={
          <SharedImage name={LIEU_VISUAL}>
            <DemoVisual tone="emeraude" />
          </SharedImage>
        }
      >
        <Link
          href={gabaritPaths.liste}
          transitionTypes={backTransition}
          data-testid="gabarit-lieu-back"
          className="inline-flex min-h-touch items-center gap-1 text-base font-bold text-bleu underline decoration-1 underline-offset-4"
        >
          <DirectionalIcon direction="back" width={20} height={20} />
          {t("back")}
        </Link>
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="bleu">
              <Icon name="pin" width={16} height={16} className="me-1" />
              {demoPlace.category}
            </Badge>
            <Badge tone="safran">{ui("demo")}</Badge>
          </div>
          <Heading level={1}>{demoPlace.title}</Heading>
          <p dir="auto" className="text-lg text-encre-douce">
            {demoPlace.summary}
          </p>
        </header>
        <UnverifiedNotice />
        <ZelligeDivider className="max-w-xs" />
        <section aria-labelledby="lieu-apropos" className="space-y-4">
          <Heading level={2} id="lieu-apropos">
            {t("aboutTitle")}
          </Heading>
          <LongText paragraphs={demoPlace.paragraphs} />
        </section>
        <section aria-labelledby="lieu-histoires" className="space-y-4">
          <Heading level={2} id="lieu-histoires">
            {t("storiesTitle")}
          </Heading>
          <div className="space-y-4">
            {demoRelatedStories.map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                href={gabaritPaths.histoire}
                title={story.title}
                summary={story.summary}
                nature={story.nature}
                minutes={story.minutes}
                demo
              />
            ))}
          </div>
        </section>
        <SourceList sources={demoSources} />
      </SplitLayout>
    </GabaritPage>
  );
}
