import { useId } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DirectionalIcon } from "@/components/ui/icons";
import { Container } from "@/components/layout/container";
import { ZelligeMedallion, ZelligeStar } from "@/components/zellige/zellige";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { demoDoors, demoHero, type Tone } from "./demo-data";
import { gabaritPaths } from "./paths";
import { GabaritPage } from "./shell";

// Texte blanc sur chacun de ces fonds : paires vérifiées en AA (src/styles/tokens.test.ts).
const doorTones: Record<Tone, string> = {
  bleu: "from-bleu to-bleu-profond",
  emeraude: "from-emeraude to-bleu-profond",
  ocre: "from-ocre via-ocre via-45% to-bleu-profond",
};

/**
 * Gabarit accueil : une scène d'ouverture plein écran (hauteur en `dvh`, moins l'en-tête et la
 * navigation du bas), puis les trois piliers présentés comme trois portes.
 */
export function Accueil() {
  const t = useTranslations("Gabarits.accueil");
  const ui = useTranslations("Ui");
  const heroId = useId();
  const doorsId = useId();

  return (
    <GabaritPage testId="gabarit-accueil">
      <section
        aria-labelledby={heroId}
        data-testid="gabarit-accueil-hero"
        className="flex min-h-[calc(100dvh_-_3.5rem_-_1px_-_env(safe-area-inset-top)_-_var(--spacing-nav)_-_env(safe-area-inset-bottom))] flex-col-reverse md:min-h-[calc(100dvh_-_3.5rem_-_1px_-_env(safe-area-inset-top))] md:flex-row"
      >
        <div className="flex flex-1 flex-col justify-center gap-6 bg-bleu-profond py-8 text-chaux md:py-section max-md:px-[max(var(--spacing-gutter),env(safe-area-inset-left),env(safe-area-inset-right))] md:basis-1/2 md:px-16">
          <div>
            <Badge tone="safran">{ui("demo")}</Badge>
          </div>
          <Heading level={1} tone="inverse" id={heroId}>
            {demoHero.title}
          </Heading>
          <p dir="auto" className="max-w-prose text-lg text-chaux">
            {demoHero.text}
          </p>
          <div>
            <ButtonLink
              href={gabaritPaths.histoire}
              variant="secondary"
              data-testid="gabarit-accueil-cta"
            >
              {t("cta")}
              <DirectionalIcon direction="forward" width={20} height={20} />
            </ButtonLink>
          </div>
        </div>
        <div
          aria-hidden="true"
          data-testid="gabarit-accueil-hero-visual"
          className="flex min-h-[32dvh] flex-1 items-center justify-center bg-linear-to-br from-bleu via-emeraude to-bleu-profond md:basis-1/2"
        >
          {/* Accent unique : le médaillon, jamais un motif répété. */}
          <ZelligeMedallion className="size-32 text-ocre-clair md:size-48" />
        </div>
      </section>

      <Container as="section" aria-labelledby={doorsId} className="py-section">
        <Heading level={2} id={doorsId} className="mb-8">
          {t("doorsTitle")}
        </Heading>
        <ul className="grid gap-6 md:grid-cols-3">
          {demoDoors.map((door) => (
            <li key={door.id}>
              <article
                data-testid={`gabarit-accueil-door-${door.id}`}
                className={cn(
                  "relative flex h-full flex-col justify-end gap-3 overflow-hidden rounded-t-full rounded-b-lg bg-linear-to-b px-6 pt-[55%] pb-6 text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bleu",
                  doorTones[door.tone],
                )}
              >
                {/* Accent au sommet de la porte, centré sans dépendre de la direction. */}
                <ZelligeStar className="absolute inset-x-0 top-8 mx-auto size-5 text-safran" />
                <Heading level={3} tone="inverse">
                  <Link
                    href={door.href}
                    data-testid={`gabarit-accueil-door-${door.id}-link`}
                    className="inline-flex min-h-touch items-center gap-2 outline-safran after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {door.title}
                    <DirectionalIcon direction="forward" width={20} height={20} />
                  </Link>
                </Heading>
                <p dir="auto" className="text-base">
                  {door.text}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </GabaritPage>
  );
}
