# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Plan de la phase en cours : `PLAN_PHASE_1.md` (tâches T0–T11, critères d'acceptation, restrictions). Plan produit : `histoir_place_outOfScop.md` (long : ne lire que le § visé). Commentaires et messages de code en français.

## Vérifier un changement

Ordre : `pnpm lint` (0 warning toléré) → `pnpm typecheck` (lance `next typegen`) → `pnpm format:check` → `pnpm test` → `pnpm test:int` → `pnpm build`.

- `pnpm test:int` exige PostgreSQL (`docker compose up -d --wait`) et **vide le schéma `public`** de `TEST_DATABASE_URL`, qui doit finir par `_test` (sinon le setup refuse).
- `pnpm test:e2e` lance `next start` sur le port 3100 : faire `pnpm build` avant. En local : `PW_CHANNEL=msedge pnpm test:e2e`.
- Déploiement (Vercel + Neon, migrations au build, retour arrière) : `docs/deploiement.md`. Toute migration reste compatible avec le code précédent.
- Nouvelle migration : `pnpm db:migrate` (dev). Le client Prisma généré (`src/server/db/generated/`) est ignoré par Git : `pnpm db:generate` s'il manque.

## Règles non évidentes

- `.env` contient des secrets : ne jamais l'afficher ni le lire en entier. `.gitignore` ignore `.env*`, donc aussi `.env.example` : ajouter `!.env.example`.
- `src/shared/` = TypeScript pur (ni Next, ni React, ni Prisma, n'importe que depuis `shared/`) ; imposé par ESLint.
- Un seul client Prisma : `src/server/db/client.ts`. Prisma 7 ne charge pas `.env` : c'est `prisma.config.ts` qui le fait.
- RTL d'abord : classes Tailwind logiques uniquement (`ms-`, `pe-`, `start-`, `text-start`) ; `ml-`, `pr-`, `left-`… font échouer ESLint.
- Aucune chaîne en dur dans les composants (`messages/ar.json`). Dates, nombres, monnaie : `@/shared/i18n/format` (ar-MA, chiffres occidentaux) ; `useFormatter`/`getFormatter` sont interdits.
- Versions exactes (`.npmrc` `save-exact`), figées par `pnpm-lock.yaml`. Vérifier toute version ou API dans la doc officielle, jamais de mémoire.
- Next.js 16 : `src/proxy.ts` remplace le middleware ; lire `node_modules/next/dist/docs/` avant de coder.

## Gouvernance (PLAN_PHASE_1.md)

- Aucune anticipation des phases 2 et 3 ; aucun contenu historique sur Fès, aucun fait ni source inventé.
- Aucun plugin ; tout skill est audité et inscrit dans `docs/skills-audit.md` avant usage.
- Une tâche = une PR courte. Commits : Conventional Commits en français (`feat:`, `fix:`, `docs:`…), branches `t<N>-<sujet>`. Dépôt : github.com/qa-catch/hikayat-makan (public) ; `main` est protégé : tout passe par une PR dont les contrôles Contrôles et gitleaks sont verts.
