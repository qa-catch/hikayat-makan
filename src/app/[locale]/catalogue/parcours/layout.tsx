import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// Jamais indexé, même sur une preview ; absent de la production (voir ci-dessous).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Prototype du parcours « الرحلة » (phase 2) : données factices, donc invisible en production.
 * `VERCEL_ENV` est lu au build : les pages statiques de production sont des 404.
 */
export default function ParcoursLayout({ children }: { children: ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
