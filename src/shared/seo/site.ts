// Configuration SEO, pure : l'environnement est passé en paramètre. Hors de src/server/env.ts,
// car next.config.ts l'importe aussi, sans DATABASE_URL (typegen, lint).

type SiteEnv = Record<string, string | undefined>;

/**
 * Origine publique du site, base des URL absolues (canonique, Open Graph, sitemap).
 * SITE_URL d'abord ; sinon, sur Vercel, le domaine de production, fourni même aux previews :
 * la canonique d'une preview désigne donc la production.
 */
export function resolveSiteUrl(env: SiteEnv): URL {
  if (env.SITE_URL) {
    let url: URL;
    try {
      url = new URL(env.SITE_URL);
    } catch {
      throw new Error("SITE_URL invalide : URL absolue attendue, ex. https://exemple.ma");
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("SITE_URL invalide : protocole http ou https attendu");
    }
    if (url.pathname !== "/" || url.search || url.hash) {
      throw new Error("SITE_URL invalide : origine seule attendue, sans chemin");
    }
    return new URL(url.origin);
  }
  if (env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  throw new Error("SITE_URL obligatoire hors Vercel (voir .env.example)");
}

/** Faux sur un déploiement Vercel hors production (preview, `vercel dev`). */
export function isIndexable(env: SiteEnv): boolean {
  return !env.VERCEL_ENV || env.VERCEL_ENV === "production";
}
