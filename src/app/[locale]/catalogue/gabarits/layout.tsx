import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// Jamais indexés, même sur une preview ; absents de la production (voir ci-dessous).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Gabarits de pages (phase 2) : données factices, donc invisibles en production.
 * `VERCEL_ENV` est lu au build : les pages statiques de production sont des 404.
 */
export default function GabaritsLayout({ children }: { children: ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
