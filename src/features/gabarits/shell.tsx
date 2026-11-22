import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { Header, MAIN_CONTENT_ID } from "@/components/layout/header";
import type { NavItem } from "@/components/layout/nav-link";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { gabaritPaths, type GabaritName } from "./paths";

/** Marge latérale d'une zone pleine largeur sur mobile (zones sûres comprises). */
export const MOBILE_SIDE_PADDING =
  "max-md:px-[max(var(--spacing-gutter),env(safe-area-inset-left),env(safe-area-inset-right))]";

/**
 * Cadre commun des gabarits : en-tête, `<main>`, pied de page, navigation du bas.
 * Les pages de production reprendront ce cadre avec de vraies données (phase 4).
 */
export function GabaritPage({ name, children }: { name: GabaritName; children: ReactNode }) {
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
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        data-testid={`gabarit-${name}`}
        className="focus:outline-none"
      >
        {children}
      </main>
      <Footer links={[{ id: "catalogue", href: "/catalogue", label: t("footerLink") }]} />
      <BottomNav items={nav} />
    </>
  );
}

/**
 * Visuel d'un côté, texte de l'autre. Mobile : visuel en haut (pleine largeur, 40 dvh), texte
 * dessous. À partir de la tablette : deux colonnes, visuel fixé pendant que le texte défile ;
 * en RTL le texte (premier dans le DOM) est à droite.
 */
export function SplitLayout({
  testId,
  visual,
  align = "start",
  children,
}: {
  testId: string;
  /** Sans visuel, la colonne de texte garde sa largeur et s'aligne avec celle des scènes voisines. */
  visual?: ReactNode;
  /** `center` : texte court centré en hauteur face au visuel. */
  align?: "start" | "center";
  children: ReactNode;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col-reverse md:flex-row md:gap-12 md:px-gutter md:py-section",
        align === "center" ? "md:items-center" : "md:items-start",
      )}
    >
      <div className={cn("min-w-0 space-y-6 py-section md:flex-1 md:py-0", MOBILE_SIDE_PADDING)}>
        {children}
      </div>
      {visual === undefined ? (
        <div aria-hidden="true" className="hidden md:block md:w-1/2 md:flex-none" />
      ) : (
        <div
          aria-hidden="true"
          data-testid={`${testId}-visual`}
          className="h-[40dvh] max-h-[26rem] min-h-48 w-full overflow-hidden md:sticky md:top-20 md:h-[calc(100dvh_-_7rem)] md:max-h-[40rem] md:w-1/2 md:flex-none md:rounded-lg"
        >
          {visual}
        </div>
      )}
    </div>
  );
}
