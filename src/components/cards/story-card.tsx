import { useTranslations } from "next-intl";
import { natureTones } from "@/components/content/nature";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { DirectionalIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/shared/i18n/format";
import type { Nature } from "@/shared/content/nature";

type StoryCardProps = {
  /** Identifiant de l'histoire : sert au `data-testid` (`story-card-<id>`). */
  id: string;
  /** Chemin sans préfixe de langue. */
  href: string;
  title: string;
  summary: string;
  /** Nature du contenu : toujours visible (règle absolue du produit). */
  nature: Nature;
  /** Durée de lecture en minutes. */
  minutes?: number;
  /** Donnée factice : ajoute l'étiquette « تجريبي ». */
  demo?: boolean;
  className?: string;
};

/** Carte d'histoire : nature en tête, titre, résumé, durée ; toute la carte est un seul lien. */
export function StoryCard({
  id,
  href,
  title,
  summary,
  nature,
  minutes,
  demo = false,
  className,
}: StoryCardProps) {
  const t = useTranslations("Cards");
  const content = useTranslations("Content");
  const ui = useTranslations("Ui");

  return (
    <article
      data-testid={`story-card-${id}`}
      className={cn(
        "relative flex items-center gap-4 rounded-lg border border-chaux-sombre bg-white p-4 hover:border-bleu has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bleu",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={natureTones[nature]} data-testid={`story-card-${id}-nature`}>
            {content(`nature.${nature}.label`)}
          </Badge>
          {demo && <Badge tone="safran">{ui("demo")}</Badge>}
        </div>
        <Heading level={3} size="xl">
          <Link
            href={href}
            data-testid={`story-card-${id}-link`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {title}
          </Link>
        </Heading>
        <p dir="auto" className="text-sm text-encre-douce">
          {summary}
        </p>
        {minutes !== undefined && (
          <p className="text-sm text-encre-douce">
            {t("readingTime", { minutes: formatNumber(minutes) })}
          </p>
        )}
      </div>
      <DirectionalIcon shape="chevron" direction="forward" className="text-bleu" />
    </article>
  );
}
