import { useTranslations } from "next-intl";
import { UnverifiedNotice } from "@/components/content/unverified-notice";
import { SplitLayout } from "@/components/layout/split-layout";
import { backTransition, forwardTransition } from "@/components/motion/page-transition";
import { SharedImage } from "@/components/motion/shared-image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DirectionalIcon, Icon } from "@/components/ui/icons";
import { DemoVisual } from "@/features/catalogue/specimen";
import { GabaritPage } from "@/features/gabarits/shell";
import { Link } from "@/i18n/navigation";
import type { ParcoursPlace } from "./data";
import { parcoursPaths, placeVisual } from "./paths";

/** Fiche d'un lieu du parcours : l'en-tête reprend le visuel de sa carte (`SharedImage`). */
export function ParcoursLieu({ place }: { place: ParcoursPlace }) {
  const t = useTranslations("Parcours.lieu");
  const ui = useTranslations("Ui");

  return (
    <GabaritPage testId="parcours-lieu">
      <SplitLayout
        testId="parcours-lieu-split"
        visual={
          <SharedImage name={placeVisual(place.id)}>
            <DemoVisual tone={place.tone} />
          </SharedImage>
        }
      >
        <Link
          href={parcoursPaths.depart}
          transitionTypes={backTransition}
          data-testid="parcours-lieu-back"
          className="inline-flex min-h-touch items-center gap-1 text-base font-bold text-bleu underline decoration-1 underline-offset-4"
        >
          <DirectionalIcon direction="back" width={20} height={20} />
          {t("back")}
        </Link>
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="bleu">
              <Icon name="pin" width={16} height={16} className="me-1" />
              {place.category}
            </Badge>
            <Badge tone="safran">{ui("demo")}</Badge>
          </div>
          <Heading level={1}>{place.title}</Heading>
          <p dir="auto" className="text-lg text-encre-douce">
            {place.summary}
          </p>
        </header>
        <UnverifiedNotice />
        <ButtonLink
          href={parcoursPaths.histoire(place.id)}
          transitionTypes={forwardTransition}
          data-testid="parcours-lieu-story"
        >
          {t("readStory", { title: place.story.title })}
        </ButtonLink>
      </SplitLayout>
    </GabaritPage>
  );
}
