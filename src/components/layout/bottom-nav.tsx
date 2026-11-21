import { useTranslations } from "next-intl";
import { NavLink, type NavItem } from "./nav-link";

/**
 * Navigation principale en bas sur mobile, à portée de pouce ; masquée à partir de la tablette
 * (la navigation passe dans l'en-tête). Zone sûre du bas respectée : exige `viewport-fit=cover`
 * (voir `viewport` dans app/[locale]/layout.tsx).
 *
 * À placer en dernier dans le `<body>` : l'espaceur qui précède la barre (fixe) évite qu'elle
 * ne recouvre la fin de la page.
 */
export function BottomNav({ items }: { items: readonly NavItem[] }) {
  const t = useTranslations("Layout");

  return (
    <>
      <div
        aria-hidden="true"
        className="h-[calc(var(--spacing-nav)+env(safe-area-inset-bottom))] md:hidden"
      />
      <nav
        aria-label={t("mainNav")}
        data-testid="nav-bottom"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-chaux-sombre bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="mx-auto flex max-w-lg">
          {items.map((item) => (
            <li key={item.id} className="flex-1">
              <NavLink item={item} placement="bottom" />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
