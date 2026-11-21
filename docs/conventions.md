# Conventions

## Code

- Commentaires et messages de code en **français**.
- **RTL d'abord** : classes Tailwind logiques (`ms-`, `pe-`, `start-`, `text-start`). `ml-`, `pr-`, `left-`… font échouer ESLint.
- **Aucune chaîne en dur** dans les composants : tout passe par `messages/ar.json`.
- **Typographie** : familles `font-texte` et `font-titre`, graisses `font-normal` et `font-bold` seulement (les seules chargées), tailles `text-xs` à `text-3xl`. Jamais d’espacement de lettres (`tracking-*`, `letter-spacing`) : il casse la liaison des lettres arabes. Tout contenu mêlant arabe et latin (noms, sigles, nombres) porte `dir="auto"`.
- Dates, nombres, monnaie : `@/shared/i18n/format` (ar-MA, chiffres occidentaux). `useFormatter` et `getFormatter` sont interdits.
- `src/shared/` : TypeScript pur, sans Next, React ni Prisma.
- Un seul client Prisma (`src/server/db/client.ts`). Prisma 7 ne charge pas `.env` : c'est `prisma.config.ts` qui le fait.
- Versions **exactes** (`.npmrc` `save-exact`), figées par `pnpm-lock.yaml`. Toute version ou API se vérifie dans la documentation officielle, pas de mémoire. Next.js 16 : lire `node_modules/next/dist/docs/` avant de coder ; `src/proxy.ts` remplace le middleware.
- Une migration reste compatible avec le code précédent (retour arrière possible).
- **`data-testid` unique et stable** sur chaque élément qu'un test ou un automate doit viser : champs, boutons, liens de navigation, composants (carte, scène, bandeau, liste de sources), zones de contenu. Format `kebab-case`, du général au particulier, par exemple `place-card-<id>`, `story-scene-<n>`, `nav-bottom-home`. Jamais de valeur dépendant de la langue, du style ou de l'ordre d'affichage ; l'identifiant vient des données quand il existe. Les libellés restent dans `messages/ar.json`, pas dans le `data-testid`. Un test E2E vérifie l'unicité sur chaque page. Raison : tests E2E stables, et futur automate de rédaction (`docs/decisions.md`, 2026-11-21) qui navigue et remplit les pages sans dépendre des classes ni du texte arabe.

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
