# Architecture (une page)

Application **Next.js 16** (App Router) en arabe, RTL, sur `/ar`. Phase 1 : socle sans contenu (page d'accueil vide, SEO, santé, journaux, CI, déploiement).

## Vue d'ensemble

```
Navigateur ──► Vercel (fra1) ──► Next.js ──► Prisma 7 ──► Neon PostgreSQL (aws-eu-central-1)
                   │
        src/proxy.ts (next-intl : préfixe de langue /ar)
```

## Découpage de `src/`

| Dossier                                      | Rôle                                          | Contrainte                                                                  |
| -------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `app/`                                       | routes, `robots.ts`, `sitemap.ts`, `api/v1/*` | pages statiques, pas de nonce CSP                                           |
| `shared/`                                    | TypeScript pur (format, SEO)                  | ni Next, ni React, ni Prisma ; importe uniquement depuis `shared/` (ESLint) |
| `server/`                                    | env, client Prisma, santé, journaux           | jamais importé côté client                                                  |
| `i18n/`                                      | routage et chargement des messages            | textes dans `messages/ar.json`                                              |
| `components/`, `features/`, `hooks/`, `lib/` | vides en phase 1                              | réservés aux phases suivantes                                               |
| `styles/`                                    | `globals.css` (Tailwind)                      | classes logiques uniquement                                                 |

## Points clés

- **Configuration** : `src/server/env.ts` valide `DATABASE_URL` (zod) et refuse de démarrer sinon ; les messages d'erreur ne reprennent jamais la valeur. `SITE_URL` est lue par `src/shared/seo/site.ts`, car `next.config.ts` l'importe aussi.
- **Base** : un seul client, `src/server/db/client.ts`. Client généré dans `src/server/db/generated/` (ignoré par Git). Migrations : `prisma/migrations`, appliquées au build (`vercel.json`) via `DATABASE_URL_UNPOOLED`.
- **Journalisation** : `src/server/logging/` (JSON, chaque niveau via sa méthode `console.*`, `requestId` par requête, masquage des secrets et données personnelles, limitation de débit sur `/api/v1/client-errors`).
- **Santé** : `GET /api/v1/health` → 200 si la base répond, sinon 503.
- **SEO** : métadonnées, canonique, Open Graph dans le HTML statique ; `noindex, nofollow` sur les previews et `/admin` (`next.config.ts`). Détails : `docs/deploiement.md`.
- **Sécurité HTTP** : CSP de base, HSTS, `nosniff`, `Referrer-Policy` (`next.config.ts`).
- **Tests** : Vitest (unitaires `*.test.ts`, intégration `*.int.test.ts` sur `hikayat_test`), Playwright (`e2e/`, port 3100).
- **CI/CD** : `.github/workflows/` : `ci.yml` (contrôles), `secrets.yml` (gitleaks), `deploiement.yml` (fumée en production). Voir `docs/ci.md` et `docs/deploiement.md`.
