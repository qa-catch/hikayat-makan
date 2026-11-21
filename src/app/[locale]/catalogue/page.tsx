import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalogue } from "@/features/catalogue/catalogue";

// Jamais indexé, même sur une preview ; absent de la production (voir ci-dessous).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Catalogue des composants (phase 2) : données factices, donc invisible en production.
 * `VERCEL_ENV` est lu au build : la page statique de production est un 404.
 */
export default function CataloguePage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <Catalogue />;
}
