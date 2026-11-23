import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppleIconCard, OgCard } from "@/features/partage/cards";

// Outil de génération (T9) : jamais indexé, absent de la production (`VERCEL_ENV` lu au build).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Modèles des images de partage, capturés par `pnpm og:image` (scripts/og-image.mjs). */
export default function PartagePage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <main className="flex flex-col items-start gap-8 overflow-x-auto p-8">
      <OgCard />
      <AppleIconCard />
    </main>
  );
}
