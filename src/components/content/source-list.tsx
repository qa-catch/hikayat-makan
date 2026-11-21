import { useId } from "react";
import { useTranslations } from "next-intl";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/cn";

export type Source = {
  /** Identifiant stable : sert au `data-testid` (`source-list-item-<id>`). */
  id: string;
  title: string;
  /** Auteur, éditeur, date… tel que fourni, sans reformatage. */
  detail?: string;
  /** Lien externe facultatif : s'ouvre dans un nouvel onglet. */
  href?: string;
};

/** Sources en fin d'article, numérotées en chiffres occidentaux. */
export function SourceList({
  sources,
  className,
  ...props
}: {
  sources: readonly Source[];
  className?: string;
  "data-testid"?: string;
}) {
  const t = useTranslations("Content");
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      data-testid="source-list"
      className={cn("space-y-3", className)}
      {...props}
    >
      <Heading level={2} size="xl" id={headingId}>
        {t("sources")}
      </Heading>
      {sources.length === 0 ? (
        <p className="text-base text-encre-douce">{t("noSources")}</p>
      ) : (
        <ol className="list-decimal space-y-3 ps-6 text-base text-encre marker:text-encre-douce">
          {sources.map((source) => (
            <li key={source.id} data-testid={`source-list-item-${source.id}`}>
              {source.href ? (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="auto"
                  className="inline-flex min-h-touch items-center text-bleu underline decoration-1 underline-offset-4 hover:text-bleu-profond"
                >
                  {source.title}
                  <span className="sr-only">{t("externalLink")}</span>
                </a>
              ) : (
                <span dir="auto">{source.title}</span>
              )}
              {source.detail && (
                <p dir="auto" className="text-sm text-encre-douce">
                  {source.detail}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
