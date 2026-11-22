import type { ComponentProps, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type PlaceCardProps = {
  /** Identifiant du lieu : sert au `data-testid` (`place-card-<id>`). */
  id: string;
  /** Chemin sans préfixe de langue. */
  href: string;
  title: string;
  summary: string;
  /** Type de lieu, en étiquette. */
  category?: string;
  /** Visuel (forme ou dégradé en phase 2, image ensuite) ; décoratif, le titre nomme la carte. */
  visual?: ReactNode;
  /** Types de la transition de vue du lien (`forwardTransition`, `backTransition`). */
  transitionTypes?: ComponentProps<typeof Link>["transitionTypes"];
  /** Donnée factice : ajoute l'étiquette « تجريبي ». */
  demo?: boolean;
  className?: string;
};

/**
 * Carte de lieu : toute la carte est cliquable par un seul lien (le titre), le focus clavier
 * entoure la carte entière.
 */
export function PlaceCard({
  id,
  href,
  title,
  summary,
  category,
  visual,
  transitionTypes,
  demo = false,
  className,
}: PlaceCardProps) {
  const t = useTranslations("Ui");

  return (
    <article
      data-testid={`place-card-${id}`}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border border-chaux-sombre bg-white hover:border-bleu has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bleu",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="aspect-video w-full overflow-hidden bg-bleu-clair md:aspect-[4/3]"
      >
        {visual}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {(category || demo) && (
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Badge tone="bleu">
                <Icon name="pin" width={16} height={16} className="me-1" />
                {category}
              </Badge>
            )}
            {demo && <Badge tone="safran">{t("demo")}</Badge>}
          </div>
        )}
        <Heading level={3} size="xl">
          {/* Lien étiré : la zone cliquable couvre toute la carte (min. 44 px, de loin). */}
          <Link
            href={href}
            transitionTypes={transitionTypes}
            data-testid={`place-card-${id}-link`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {title}
          </Link>
        </Heading>
        <p dir="auto" className="text-sm text-encre-douce">
          {summary}
        </p>
      </div>
    </article>
  );
}
