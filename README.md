# حكاية مكان

Plan de la phase en cours : `PLAN_PHASE_1.md`. Plan produit : `histoir_place_outOfScop.md`.

## Prérequis

Node.js 24 ou plus, pnpm 10 (`corepack enable`), Docker (PostgreSQL 18 local).

## Commandes

`.env` à créer à la racine depuis `.env.example` (jamais commité ; l'application refuse de démarrer si `DATABASE_URL` manque ou est invalide) : `POSTGRES_PASSWORD`, `DATABASE_URL` (base `hikayat`), `TEST_DATABASE_URL` (base `hikayat_test`), tous deux en `postgresql://hikayat:<mot de passe>@127.0.0.1:5432/<base>`, et `SITE_URL` (`http://localhost:3100`, exigée par `pnpm build`).

```bash
pnpm install --frozen-lockfile   # lance aussi prisma generate
docker compose up -d --wait      # PostgreSQL local
pnpm db:deploy                   # applique les migrations
pnpm dev            # http://localhost:3000/ar
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm test                       # unitaires
pnpm test:int                   # intégration (vide puis migre hikayat_test)
PW_CHANNEL=msedge pnpm test:e2e # ou, sans Edge : pnpm exec playwright install chromium puis pnpm test:e2e
pnpm db:migrate                 # nouvelle migration (dev) + generate
```

Installation vérifiée depuis un clone vierge le 2026-11-20 (install, typecheck, test, build, db:deploy, test:int, test:e2e : tout passe).

Santé : `GET /api/v1/health` renvoie 200 si la base répond, sinon 503.

## Règles

- `src/shared/` est du TypeScript pur : ni Next.js, ni React, ni Prisma (règle ESLint).
- Prisma 7 (stable ; la 8 est en RC) : client unique dans `src/server/db/client.ts`, client généré dans `src/server/db/generated/` (ignoré par Git).
- Versions exactes dans `package.json`, figées par `pnpm-lock.yaml`.
- Déploiement (Vercel + Neon) et retour arrière : `docs/deploiement.md`. CI et protection de `main` : `docs/ci.md`.
- Documentation : [architecture](docs/architecture.md), [conventions](docs/conventions.md), [décisions](docs/decisions.md) (Fès, relecteur optionnel, hébergeur).
- Skills : registre et procédure d'audit dans `docs/skills-audit.md`.
