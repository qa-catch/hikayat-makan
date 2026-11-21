import { useTranslations } from "next-intl";
import { PlaceCard } from "@/components/cards/place-card";
import { StoryCard } from "@/components/cards/story-card";
import { NatureBanner } from "@/components/content/nature-banner";
import { SourceList } from "@/components/content/source-list";
import { UnverifiedNotice } from "@/components/content/unverified-notice";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { Header, MAIN_CONTENT_ID } from "@/components/layout/header";
import type { NavItem } from "@/components/layout/nav-link";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { DIRECTIONAL_SHAPES, DirectionalIcon, ICON_NAMES, Icon } from "@/components/ui/icons";
import { LongText } from "@/components/ui/long-text";
import { Skeleton } from "@/components/ui/skeleton";
import { TextLink } from "@/components/ui/text-link";
import { NATURES } from "@/shared/content/nature";
import {
  demoLatinParagraphs,
  demoParagraphs,
  demoPlaces,
  demoSources,
  demoStories,
} from "./demo-data";
import { DemoVisual, Section, Specimen } from "./specimen";

const tones: BadgeTone[] = ["neutre", "bleu", "emeraude", "ocre", "safran"];

/**
 * Catalogue des composants (T4) : chaque composant et chaque état, avec des données factices.
 * La page elle-même est montée avec l'en-tête, la navigation du bas et le pied de page.
 */
export function Catalogue() {
  const t = useTranslations("Catalogue");
  const demo = useTranslations("Catalogue.demo");
  const s = useTranslations("Catalogue.states");
  const ui = useTranslations("Ui");

  // Pages à venir : les entrées hors catalogue pointent vers l'accueil, seule autre page existante.
  const nav: NavItem[] = [
    { id: "home", href: "/", label: t("nav.home"), icon: <Icon name="home" /> },
    { id: "stories", href: "/catalogue", label: t("nav.stories"), icon: <Icon name="book" /> },
    { id: "map", href: "/", label: t("nav.map"), icon: <Icon name="map" /> },
    { id: "search", href: "/", label: t("nav.search"), icon: <Icon name="search" /> },
  ];

  return (
    <>
      <Header items={nav} />
      <Container
        as="main"
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="space-y-section py-section focus:outline-none"
      >
        <div className="space-y-3">
          <Heading level={1}>{t("title")}</Heading>
          <p dir="auto" className="max-w-prose text-base text-encre-douce">
            {t("intro")}
          </p>
        </div>

        <Section id="buttons" title={t("sections.buttons")}>
          <div className="flex flex-wrap items-start gap-4">
            <Specimen label={s("primary")}>
              <Button data-testid="catalogue-button-primary">{demo("buttonLabel")}</Button>
            </Specimen>
            <Specimen label={s("secondary")}>
              <Button variant="secondary" data-testid="catalogue-button-secondary">
                {demo("buttonLabel")}
              </Button>
            </Specimen>
            <Specimen label={s("ghost")}>
              <Button variant="ghost" data-testid="catalogue-button-ghost">
                {demo("buttonLabel")}
              </Button>
            </Specimen>
            <Specimen label={s("disabled")}>
              <Button disabled data-testid="catalogue-button-disabled">
                {demo("buttonLabel")}
              </Button>
            </Specimen>
            <Specimen label={s("withIcon")}>
              <Button data-testid="catalogue-button-icon">
                <Icon name="search" />
                {demo("buttonLabel")}
              </Button>
            </Specimen>
            <Specimen label={s("linkButton")}>
              <ButtonLink href="/" variant="secondary" data-testid="catalogue-button-link">
                {demo("linkLabel")}
                <DirectionalIcon shape="arrow" />
              </ButtonLink>
            </Specimen>
          </div>
        </Section>

        <Section id="links" title={t("sections.links")}>
          <Specimen label={s("standalone")}>
            <TextLink href="/" data-testid="catalogue-link-standalone">
              {demo("linkLabel")}
            </TextLink>
          </Specimen>
          <Specimen label={s("inline")}>
            <p className="max-w-prose">
              {demo("inlineBefore")}{" "}
              <TextLink href="/" inline data-testid="catalogue-link-inline">
                {demo("inlineLink")}
              </TextLink>{" "}
              {demo("inlineAfter")}
            </p>
          </Specimen>
        </Section>

        <Section id="headings" title={t("sections.headings")}>
          <Specimen label={s("headingLarge")}>
            <Heading level={3} size="3xl" data-testid="catalogue-heading-large">
              {demo("buttonLabel")}
            </Heading>
          </Specimen>
          <Specimen label={s("headingMedium")}>
            <Heading level={3} size="2xl" data-testid="catalogue-heading-medium">
              {demo("buttonLabel")}
            </Heading>
          </Specimen>
          <Specimen label={s("headingSmall")}>
            <Heading level={3} size="xl" data-testid="catalogue-heading-small">
              {demo("buttonLabel")}
            </Heading>
          </Specimen>
          <Specimen label={s("headingMinor")}>
            <Heading level={4} size="lg" data-testid="catalogue-heading-minor">
              {demo("buttonLabel")}
            </Heading>
          </Specimen>
          <Specimen label={s("headingMixed")}>
            <Heading level={3} size="xl" data-testid="catalogue-heading-mixed">
              {demo("buttonLabel")} (Demo 2026)
            </Heading>
          </Specimen>
        </Section>

        <Section id="long-text" title={t("sections.longText")}>
          <Specimen label={s("readingColumn")}>
            <LongText paragraphs={demoParagraphs} data-testid="catalogue-long-text" />
          </Specimen>
          <Specimen label={s("latinParagraph")}>
            <LongText paragraphs={demoLatinParagraphs} data-testid="catalogue-long-text-latin" />
          </Specimen>
        </Section>

        <Section id="badges" title={t("sections.badges")}>
          <Specimen label={s("tones")}>
            <div className="flex flex-wrap gap-2">
              {tones.map((tone) => (
                <Badge key={tone} tone={tone} data-testid={`catalogue-badge-${tone}`}>
                  {ui("demo")}
                </Badge>
              ))}
            </div>
          </Specimen>
        </Section>

        <Section id="icons" title={t("sections.icons")}>
          <Specimen label={s("plainIcons")}>
            <div className="flex flex-wrap gap-4 text-bleu">
              {ICON_NAMES.map((name) => (
                <Icon key={name} name={name} data-testid={`catalogue-icon-${name}`} />
              ))}
            </div>
          </Specimen>
          <Specimen label={s("directionalIcons")}>
            <div className="flex flex-wrap gap-4 text-bleu">
              {DIRECTIONAL_SHAPES.flatMap((shape) =>
                (["forward", "back"] as const).map((direction) => (
                  <DirectionalIcon
                    key={`${shape}-${direction}`}
                    shape={shape}
                    direction={direction}
                    data-testid={`catalogue-icon-${shape}-${direction}`}
                  />
                )),
              )}
            </div>
          </Specimen>
        </Section>

        <Section id="skeleton" title={t("sections.skeleton")}>
          <div className="grid gap-6 md:grid-cols-3">
            <Specimen label={s("skeletonText")}>
              <Skeleton variant="text" data-testid="catalogue-skeleton-text" />
            </Specimen>
            <Specimen label={s("skeletonVisual")}>
              <Skeleton variant="visual" data-testid="catalogue-skeleton-visual" />
            </Specimen>
            <Specimen label={s("skeletonCard")}>
              <Skeleton variant="card" lines={2} data-testid="catalogue-skeleton-card" />
            </Specimen>
          </div>
        </Section>

        <Section id="empty-state" title={t("sections.emptyState")}>
          <Specimen label={s("emptyDefault")}>
            <EmptyState
              title={demo("emptyTitle")}
              description={demo("emptyDescription")}
              action={<Button variant="secondary">{demo("emptyAction")}</Button>}
              headingLevel={3}
              data-testid="catalogue-empty-state"
            />
          </Specimen>
          <Specimen label={s("emptyMinimal")}>
            <EmptyState
              title={demo("emptyTitle")}
              headingLevel={3}
              data-testid="catalogue-empty-state-minimal"
            />
          </Specimen>
        </Section>

        <Section id="layout" title={t("sections.layout")}>
          <p dir="auto" className="max-w-prose text-base text-encre-douce">
            {s("layoutNote")}
          </p>
          <Specimen label={s("container")}>
            <Container
              data-testid="catalogue-container"
              className="rounded-md border border-dashed border-ocre py-4 text-sm"
            >
              {demo("containerNote")}
            </Container>
          </Specimen>
        </Section>

        <Section id="cards" title={t("sections.cards")}>
          <Specimen label={s("placeCard")}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demoPlaces.map((place, index) => (
                <PlaceCard
                  key={place.id}
                  id={place.id}
                  href="/"
                  title={place.title}
                  summary={place.summary}
                  category={place.category}
                  visual={<DemoVisual tone={index === 0 ? "bleu" : "ocre"} />}
                  demo
                />
              ))}
            </div>
          </Specimen>
          <Specimen label={s("storyCards")}>
            <div className="grid gap-4 md:grid-cols-2">
              {demoStories.map((story) => (
                <StoryCard
                  key={story.id}
                  id={story.id}
                  href="/"
                  title={story.title}
                  summary={story.summary}
                  nature={story.nature}
                  minutes={story.minutes}
                  demo
                />
              ))}
            </div>
          </Specimen>
        </Section>

        <Section id="content" title={t("sections.content")}>
          <Specimen label={s("natureBanners")}>
            <div className="grid gap-4 md:grid-cols-2">
              {NATURES.map((nature) => (
                <NatureBanner key={nature} nature={nature} />
              ))}
            </div>
          </Specimen>
          <Specimen label={s("unverified")}>
            <UnverifiedNotice />
          </Specimen>
          <Specimen label={s("sourceList")}>
            <SourceList sources={demoSources} />
          </Specimen>
          <Specimen label={s("sourceListEmpty")}>
            <SourceList sources={[]} data-testid="source-list-empty" />
          </Specimen>
        </Section>
      </Container>
      <Footer links={[{ id: "catalogue", href: "/catalogue", label: t("footerLink") }]} />
      <BottomNav items={nav} />
    </>
  );
}
