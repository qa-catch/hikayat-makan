import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ogLocales, routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const path = `/${locale}`;

  // openGraph n'est pas fusionné avec celui d'un layout : chaque page le donne en entier.
  return {
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: t("title"),
      locale: ogLocales[locale],
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function HomePage() {
  return <main />;
}
