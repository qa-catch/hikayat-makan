import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/ui/brand-mark";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";
import { NavLink, type NavItem } from "./nav-link";

/** Cible du lien d'évitement : le `<main>` de la page porte cet `id` et `tabIndex={-1}`. */
export const MAIN_CONTENT_ID = "contenu";

/**
 * En-tête du site : lien d'évitement, marque, et navigation principale en haut à partir de
 * la tablette (sur mobile, la navigation est en bas : `BottomNav`).
 */
export function Header({ items }: { items: readonly NavItem[] }) {
  const t = useTranslations("Layout");

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-30 border-b border-chaux-sombre bg-chaux pt-[env(safe-area-inset-top)]"
    >
      <a
        href={`#${MAIN_CONTENT_ID}`}
        data-testid="site-header-skip"
        className="sr-only focus:not-sr-only focus:absolute focus:start-gutter focus:top-2 focus:z-40 focus:inline-flex focus:min-h-touch focus:items-center focus:rounded-md focus:bg-bleu focus:px-4 focus:text-white"
      >
        {t("skipToContent")}
      </a>
      <Container className="flex min-h-14 items-center gap-6">
        <Link
          href="/"
          data-testid="site-header-brand"
          className="inline-flex min-h-touch items-center gap-2 font-affiche text-lg font-bold text-bleu-profond"
        >
          <BrandMark className="size-8" />
          {t("brand")}
        </Link>
        <nav aria-label={t("mainNav")} data-testid="nav-header" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <NavLink item={item} placement="header" />
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
