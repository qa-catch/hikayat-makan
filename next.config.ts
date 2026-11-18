import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { isIndexable } from "./src/shared/seo/site";

const isDev = process.env.NODE_ENV === "development";

// CSP de base sans nonce (guide « Content Security Policy » de Next 16, § Without Nonces) :
// les pages restent statiques. 'unsafe-inline' couvre les scripts inline injectés par Next.
// La toolbar Vercel des previews est désactivée (docs/deploiement.md) plutôt qu'autorisée ici.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Deux ans, sans includeSubDomains ni preload : à décider une fois le domaine choisi.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

// Vercel l'ajoute déjà aux previews (sauf domaine de branche) : on ne dépend pas de l'hébergeur.
// Calculé au build, où Vercel fournit VERCEL_ENV.
const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: isIndexable(process.env) ? securityHeaders : [...securityHeaders, noindex],
      },
      // Back-office (phase 3) : jamais indexé, même en production. /admin compris.
      { source: "/admin/:path*", headers: [noindex] },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
