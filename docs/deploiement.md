# Déploiement (T9)

## Décision

Décision 6 du plan produit, tranchée le 2026-11-18 : **Vercel Hobby**, région `fra1` (Francfort), et **Neon Launch**, région `aws-eu-central-1` (Francfort). Ce sont les régions les plus proches du Maroc qui existent chez les deux fournisseurs : Neon n'a pas de région à Paris.

Raisons : PostgreSQL est managé, chaque preview a sa propre branche de base, Next.js est géré nativement et Neon fait des sauvegardes quotidiennes planifiées. Render et Railway ont été écartés. Chez Render, la base d'une preview n'est séparée qu'en workspace Pro, et il n'y a pas de sauvegarde quotidienne planifiée. Chez Railway, PostgreSQL n'est pas managé et il n'y a pas de SLA.

À revoir si :

- le site devient commercial (mise en avant payante, V1.1). Les CGU Vercel réservent Hobby à un usage « personnel ou non commercial » : il faudra passer à Pro, 20 $/mois par siège ;
- la facture dépasse celle d'un VPS ;
- des données personnelles arrivent en base (phase 3). Une branche de preview Neon copie les données de la production : il faudra alors des previews sans données réelles.

Tarifs relevés sur neon.com/pricing le 2026-11-18 : Vercel Hobby 0 $. Neon Launch facture à l'usage : 0,106 $ par CU-heure de calcul, 0,35 $ par Go-mois de stockage, 0,09 $ par Go-mois de snapshots. Neon estime une petite base qui s'éteint au repos à environ 15 $/mois.

## Mise en place (une fois, après la création du dépôt GitHub)

1. **Vercel** : importer le dépôt. Next.js est détecté, et `vercel.json` fixe la région et la commande de build.
2. **Neon** : l'ajouter depuis le Vercel Marketplace avec ces réglages :
   - région AWS Frankfurt ;
   - plan Launch. S'il n'est pas proposé par cette voie, utiliser l'intégration gérée par Neon ;
   - environnements Production et Preview ;
   - sous « Create database branch for deployment », cocher **Preview**. Chaque preview reçoit alors sa branche `preview/<branche>`, et la production garde la branche par défaut.
3. **Variables** :
   - Neon injecte `DATABASE_URL` (avec pooler, utilisée par l'application) et `DATABASE_URL_UNPOOLED` (connexion directe, utilisée par les migrations via `prisma.config.ts`) ;
   - ajouter `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` pour l'environnement Preview. Cela coupe la toolbar Vercel, que la CSP bloquerait ;
   - laisser cochée « Enable access to System Environment Variables » : le build lit `VERCEL_ENV` et `VERCEL_PROJECT_PRODUCTION_URL` (voir [Indexation](#indexation-t10)) ;
   - `SITE_URL` (optionnelle sur Vercel) : origine canonique, `https://…` sans chemin. À défaut, Vercel fournit son plus court domaine de production personnalisé, sinon le domaine `vercel.app`.
4. **Sauvegarde quotidienne** : dans Neon, planifier des snapshots quotidiens de la branche de production, gardés au plus 35 jours. Exemple tiré de la doc, rétention de 7 jours :

   ```bash
   neon snapshots schedule set --branch main --frequency daily --hour 23 --retention 604800
   ```

   En plus, l'historique de Neon Launch permet une restauration à un instant donné, jusqu'à 7 jours en arrière (1 jour par défaut).

5. **Protection des déploiements** : Standard Protection. Les previews sont protégées et le domaine de production reste public.
6. **GitHub** : créer la variable de dépôt `PRODUCTION_URL` (`https://…`, domaine public de production, égal à l'origine canonique). Le workflow `.github/workflows/deploiement.yml` s'en sert.
7. **Premier déploiement de production** : vérifier que le workflow « Fumée en production » s'est lancé. S'il a été ignoré, lire `deployment.environment` dans l'événement `deployment_status`, puis corriger la condition `== 'Production'`.

## Migrations au déploiement

La commande de build est définie dans `vercel.json` : `pnpm db:deploy && pnpm build`. Elle lance `prisma migrate deploy` avant `next build`. Une preview migre sa propre branche Neon, la production migre la sienne.

Une migration est donc appliquée avant que le build ait réussi. Si le build échoue, la base a déjà la nouvelle structure alors que l'ancien code tourne encore. D'où la règle : **toute migration reste compatible avec le code précédent**. On ajoute d'abord, puis on supprime ou renomme dans un déploiement ultérieur, une fois que plus aucun code n'utilise l'ancienne structure.

## Retour arrière

**Application** (Vercel) :

1. Revenir en arrière par l'une de ces deux voies :
   - Tableau de bord : _Deployments_, déploiement de production précédent, _Instant Rollback_ ;
   - CLI : `vercel rollback [id ou url]`, puis `vercel rollback status`.
2. En Hobby, on ne peut revenir qu'au **déploiement de production précédent**.
3. Après un retour arrière, Vercel coupe l'affectation automatique du domaine de production : les nouveaux pushes sur `main` ne passent plus en production. Corriger sur `main`, puis lancer `vercel promote [id ou url]` pour la réactiver.
4. Les variables d'environnement ne sont pas restaurées.

**Base** (Neon) : un retour arrière de l'application ne touche pas la base. Grâce à la règle des migrations compatibles, l'ancien code fonctionne avec la nouvelle structure. En cas de données perdues ou corrompues, restaurer depuis un snapshot, ou depuis l'historique à un instant donné. Suivre la procédure de la doc Neon en vigueur : <https://neon.com/docs/guides/backup-restore>.

## Test de fumée

Après chaque déploiement de production réussi, `.github/workflows/deploiement.yml` lance `e2e/smoke.spec.ts` et `e2e/seo.spec.ts` contre `PRODUCTION_URL`. Ils vérifient : statut 200, `lang="ar"`, `dir="rtl"`, le titre, HTTPS, les en-têtes de sécurité, les métadonnées, `robots.txt`, `sitemap.xml` et l'absence de `noindex`. On peut aussi le lancer à la main (onglet Actions, _Run workflow_) ou en local :

```bash
E2E_BASE_URL=https://… PW_CHANNEL=msedge pnpm exec playwright test e2e/smoke.spec.ts e2e/seo.spec.ts
```

## Indexation (T10)

- **Production** : indexable. Titre, description, canonique et Open Graph sont dans le HTML statique ; `robots.txt` autorise tout et désigne `sitemap.xml`. Base des URL absolues : `SITE_URL`, sinon `VERCEL_PROJECT_PRODUCTION_URL` (`src/shared/seo/site.ts`). Une preview a donc pour canonique la production.
- **Previews** : en-tête `X-Robots-Tag: noindex, nofollow` sur toutes les réponses, quand `VERCEL_ENV` vaut autre chose que `production` (`next.config.ts`, calculé au build). Vercel l'ajoute déjà, sauf sur un domaine de branche ; le nôtre ne dépend pas de l'hébergeur. Standard Protection bloque en plus les robots.
- **`/admin`** : même en-tête dans tous les environnements.
- Pas de `Disallow` dans `robots.txt` : il empêcherait les robots de lire le `noindex`.
- Pas d'image Open Graph : elle demande une police arabe (phase 2) et, comme toute image, un auteur, une licence et une source.

Vérifier une preview (avec le lien de contournement de la protection) :

```bash
curl -sI "https://<preview>/ar" | grep -i x-robots-tag   # attendu : noindex, nofollow
```

## Sécurité HTTP

En-têtes définis dans `next.config.ts` :

- **CSP de base**, sans nonce, pour que les pages restent statiques ;
- **HSTS** sur 2 ans, sans `includeSubDomains` ni `preload`, à décider une fois le domaine choisi ;
- `X-Content-Type-Options: nosniff` ;
- `Referrer-Policy`.

Vercel sert tout en HTTPS.

## Acceptation T9

- [ ] `/ar` répond en HTTPS en production : workflow « Fumée en production » vert.
- [ ] Une sauvegarde quotidienne est active : la planification est visible dans Neon et un premier snapshot existe le lendemain.
- [ ] Un retour arrière a été exécuté une fois : déployer un changement anodin, faire le retour arrière, vérifier `/ar`, puis `vercel promote`. Le noter ci-dessous.

| Date | Déploiement de départ | Retour vers | Vérification | Promote |
| ---- | --------------------- | ----------- | ------------ | ------- |
|      |                       |             |              |         |

Sources (2026-11-18) : vercel.com/docs (regions, instant-rollback, cli/rollback, vercel-toolbar, cdn-security/encryption, deployment-protection, legal/terms), neon.com/docs (vercel-managed-integration, regions, guides/backup-restore, pricing), prisma.io/docs/orm/v7 (pgbouncer, prisma-config-reference).
