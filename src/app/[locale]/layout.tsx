import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { directions, routing } from "@/i18n/routing";
import { resolveSiteUrl } from "@/shared/seo/site";
import { texte, titre } from "@/styles/fonts";
import "@/styles/globals.css";

// `cover` : le contenu occupe tout l'écran, les zones sûres (encoche, barre de geste) se lisent
// par `env(safe-area-inset-*)` (barre de navigation du bas, conteneur).
export const viewport: Viewport = { viewportFit: "cover" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    // Base des URL relatives (canonique, Open Graph) de toutes les pages.
    metadataBase: resolveSiteUrl(process.env),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} dir={directions[locale]} className={`${texte.variable} ${titre.variable}`}>
      <body>
        {/*
          Les composants client (liens, chemin courant) ont besoin de la langue. `messages={{}}` :
          aucun message n'est envoyé au navigateur ; un composant client qui doit traduire reçoit
          ses libellés en props, ou son espace de noms via `pick` (next-intl).
        */}
        <NextIntlClientProvider messages={{}}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
