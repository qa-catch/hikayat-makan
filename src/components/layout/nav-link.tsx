"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type NavItem = {
  /** Identifiant stable : sert au `data-testid` (`nav-bottom-<id>`, `nav-header-<id>`). */
  id: string;
  /** Chemin sans préfixe de langue. */
  href: string;
  /** Libellé déjà traduit : ce composant client n'a pas accès aux messages. */
  label: string;
  icon: ReactNode;
};

/** Page courante : le chemin exact, ou une page enfant (sauf pour l'accueil). */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Lien de navigation principale. Client seulement pour lire le chemin courant et poser
 * `aria-current="page"` ; le libellé et l'icône viennent du serveur.
 */
export function NavLink({
  item,
  placement,
}: {
  item: NavItem;
  /** `bottom` : barre du bas (mobile) ; `header` : barre du haut (tablette et bureau). */
  placement: "bottom" | "header";
}) {
  const active = isActive(usePathname(), item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      data-testid={`nav-${placement}-${item.id}`}
      className={cn(
        "flex min-h-touch min-w-touch items-center justify-center",
        placement === "bottom"
          ? "relative h-nav flex-col gap-1 text-xs"
          : "gap-2 rounded-md px-3 text-base",
        active
          ? "font-bold text-bleu-profond"
          : "text-encre-douce hover:bg-bleu-clair hover:text-bleu-profond",
        // Repère non coloré de la page courante : trait en haut (barre du bas) ou fond (barre du haut).
        active &&
          (placement === "bottom"
            ? "before:absolute before:inset-x-3 before:top-0 before:h-1 before:rounded-full before:bg-bleu"
            : "bg-bleu-clair"),
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}
