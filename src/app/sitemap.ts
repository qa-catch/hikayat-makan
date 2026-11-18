import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { resolveSiteUrl } from "@/shared/seo/site";

// Sans lastModified : aucune date de mise à jour fiable tant qu'il n'y a pas de contenu.
// hreflang (alternates.languages) à l'arrivée d'une seconde langue.
export default function sitemap(): MetadataRoute.Sitemap {
  const site = resolveSiteUrl(process.env);
  return routing.locales.map((locale) => ({ url: new URL(`/${locale}`, site).href }));
}
