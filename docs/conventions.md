# Conventions

## Code

- Commentaires et messages de code en **français**.
- **RTL d'abord** : classes Tailwind logiques (`ms-`, `pe-`, `start-`, `text-start`). `ml-`, `pr-`, `left-`… font échouer ESLint.
- **Aucune chaîne en dur** dans les composants : tout passe par `messages/ar.json`.
- Dates, nombres, monnaie : `@/shared/i18n/format` (ar-MA, chiffres occidentaux). `useFormatter` et `getFormatter` sont interdits.
- `src/shared/` : TypeScript pur, sans Next, React ni Prisma.
- Un seul client Prisma (`src/server/db/client.ts`). Prisma 7 ne charge pas `.env` : c'est `prisma.config.ts` qui le fait.
- Versions **exactes** (`.npmrc` `save-exact`), figées par `pnpm-lock.yaml`. Toute version ou API se vérifie dans la documentation officielle, pas de mémoire. Next.js 16 : lire `node_modules/next/dist/docs/` avant de coder ; `src/proxy.ts` remplace le middleware.
- Une migration reste compatible avec le code précédent (retour arrière possible).

## Secrets

`.env` n'est jamais commité ni affiché. `.gitignore` ignore `.env*` ; `.env.example` est réintégré par `!.env.example` et doit rester à jour avec chaque variable.

## Contenu (gouvernance)

- Chaque histoire porte sa nature (`FACT`, `EDITORIAL`, `LEGEND`, `RECONSTRUCTION`), ses sources, son statut et sa date de vérification.
- Contenu assisté par IA : relu et sourcé avant publication, données de démonstration comprises.
- Aucun fait, source ou contenu historique inventé, y compris provisoire.
- Aucune anticipation des phases 2 et 3.

## Git

- Une tâche = une PR courte, CI verte obligatoire (`main` protégée : `docs/ci.md`).
- Branches `t<N>-<sujet>`. Commits en Conventional Commits, en français : `feat:`, `fix:`, `docs:`…
- Aucun plugin ; tout skill est audité et inscrit dans `docs/skills-audit.md` avant usage.

## Vérifier un changement

Dans l'ordre : `pnpm lint` (0 warning) → `pnpm typecheck` → `pnpm format:check` → `pnpm test` → `pnpm test:int` → `pnpm build` (puis `pnpm test:e2e`).
