import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";

export type FooterLink = { id: string; href: string; label: string };

/** Pied de page : marque, phrase de présentation et liens (le contenu juridique arrive en phase 9). */
export function Footer({ links = [] }: { links?: readonly FooterLink[] }) {
  const t = useTranslations("Layout");
  const meta = useTranslations("Metadata");

  return (
    <footer
      data-testid="site-footer"
      className="mt-section surface-nuit py-section pb-[max(var(--spacing-section),env(safe-area-inset-bottom))]"
    >
      <Container className="space-y-4">
        {/* Accent : un trait safran, jamais un fond (le zellige arrive en T5). */}
        <div aria-hidden="true" className="h-1 w-12 rounded-full bg-safran" />
        <p className="font-affiche text-xl font-bold text-white">{t("brand")}</p>
        <p className="max-w-prose text-sm text-chaux-douce">{meta("description")}</p>
        {links.length > 0 && (
          <nav aria-label={t("footerNav")} data-testid="nav-footer">
            <ul className="flex flex-wrap gap-x-6">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    data-testid={`nav-footer-${link.id}`}
                    className="inline-flex min-h-touch items-center text-white underline decoration-1 underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </footer>
  );
}
