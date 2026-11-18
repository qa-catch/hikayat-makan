import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/shared/seo/site";

// Même contenu dans tous les environnements : le noindex des previews et de /admin passe par
// l'en-tête X-Robots-Tag (next.config.ts). Un Disallow empêcherait les robots de le lire.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", resolveSiteUrl(process.env)).href,
  };
}
