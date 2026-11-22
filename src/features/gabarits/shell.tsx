import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { Header, MAIN_CONTENT_ID } from "@/components/layout/header";
import type { NavItem } from "@/components/layout/nav-link";
import { Icon } from "@/components/ui/icons";
import { PageTransition } from "@/components/motion/page-transition";
import { gabaritPaths } from "./paths";

/**
 * Cadre commun des gabarits : en-tête, `<main>`, pied de page, navigation du bas.
 * `<main>` glisse selon le type de navigation (`PageTransition`) ; en-tête et
 * barres restent en place. Les pages de production reprendront ce cadre (phase 4).
 */
export function GabaritPage({ testId, children }: { testId: string; children: ReactNode }) {
  const t = useTranslations("Gabarits");

  const nav: NavItem[] = [
    { id: "home", href: gabaritPaths.accueil, label: t("nav.home"), icon: <Icon name="home" /> },
    {
      id: "stories",
      href: gabaritPaths.liste,
      label: t("nav.stories"),
      icon: <Icon name="book" />,
    },
    { id: "map", href: "/", label: t("nav.map"), icon: <Icon name="map" /> },
    { id: "search", href: "/", label: t("nav.search"), icon: <Icon name="search" /> },
  ];

  return (
    <>
      <Header items={nav} />
      {/*
        `PageTransition` autour de `<main>`, en tête de ce que la navigation insère : un
        `<ViewTransition>` placé sous un élément DOM lui-même nouveau (ici `<main>`) ne joue ni
        l'entrée ni la sortie, et la page changeait sans glisser.
      */}
      <PageTransition>
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          data-testid={testId}
          className="focus:outline-none"
        >
          {children}
        </main>
      </PageTransition>
      <Footer links={[{ id: "catalogue", href: "/catalogue", label: t("footerLink") }]} />
      <BottomNav items={nav} />
    </>
  );
}
