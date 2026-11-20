# Déploiement (T9)

## Décision

Décision 6 du plan produit, tranchée le 2026-11-18 : **Vercel Hobby**, région `fra1` (Francfort), et **Neon Free**, région `aws-eu-central-1` (Francfort). Ce sont les régions les plus proches du Maroc qui existent chez les deux fournisseurs : Neon n'a pas de région à Paris.

Raisons : PostgreSQL est managé, chaque preview a sa propre branche de base, Next.js est géré nativement et Neon garde un historique de restauration. Render et Railway ont été écartés. Chez Render, la base d'une preview n'est séparée qu'en workspace Pro, et il n'y a pas de sauvegarde quotidienne planifiée. Chez Railway, PostgreSQL n'est pas managé et il n'y a pas de SLA.

À revoir si :

- des données réelles arrivent en base (phase 3) : passer à **Neon Launch** _avant_, pour avoir 7 jours d'historique et des snapshots quotidiens planifiés ;
- le site devient commercial (mise en avant payante, V1.1). Les CGU Vercel réservent Hobby à un usage « personnel ou non commercial » : il faudra passer à Pro, 20 $/mois par siège ;
- la facture dépasse celle d'un VPS ;
- des données personnelles arrivent en base (phase 3). Une branche de preview Neon copie les données de la production : il faudra alors des previews sans données réelles.

Tarifs relevés sur neon.com/pricing le 2026-11-18 : Vercel Hobby 0 $. Neon Free : 0 $, 1 Go de stockage par projet, 100 CU-heures par mois, 10 branches par projet, 6 h d'historique de restauration, 1 snapshot manuel ; un dépassement bloque les écritures sans facturer ([plans Neon](https://neon.com/docs/introduction/plans)). Neon Launch, pour plus tard, facture à l'usage : 0,106 $ par CU-heure de calcul, 0,35 $ par Go-mois de stockage, 0,09 $ par Go-mois de snapshots, soit environ 15 $/mois pour une petite base qui s'éteint au repos.

### Alternative : Cloudflare Workers

Écartée pour la phase 1, à reconsidérer au passage commercial (V1.1) ou si Vercel devient trop cher. Relevé le 2026-11-18 :

- Next.js passe par l'adaptateur [OpenNext](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/), avec le drapeau `nodejs_compat`. La page Cloudflare oriente désormais les nouveaux projets vers vinext et garde OpenNext pour les applications existantes ;
- **Bloquant à vérifier** : la doc Cloudflare indique que le middleware Node.js de Next.js n'est pas encore géré, et des sources communautaires disent qu'OpenNext ne reconnaît pas `proxy.ts` (issue #1277). Le projet s'appuie sur `src/proxy.ts` ;
- Prisma sur Workers demande un adaptateur de pilote et une configuration spécifique (sources communautaires, à confirmer dans la doc de Prisma) ;
- tarifs ([doc Cloudflare](https://developers.cloudflare.com/workers/platform/pricing/)) : plan gratuit limité à 100 000 requêtes par jour ; plan payant à 5 $/mois minimum, 10 millions de requêtes incluses, sans frais de bande passante. Les conditions d'usage commercial sont à lire dans les CGU Cloudflare ;
- la migration réécrirait `vercel.json`, `.github/workflows/deploiement.yml` et la logique `noindex` fondée sur `VERCEL_ENV` (T10), et il faudrait remplacer les branches de preview Neon automatiques de Vercel.

## Mise en place (une fois, après la création du dépôt GitHub)

1. **Vercel** : importer le dépôt. Next.js est détecté, et `vercel.json` fixe la région et la commande de build.
2. **Neon** : l'ajouter depuis le Vercel Marketplace avec ces réglages :
   - région AWS Frankfurt ;
   - plan Free. S'il n'est pas proposé par cette voie, utiliser l'intégration gérée par Neon ;
   - environnements Production et Preview ;
   - sous « Create database branch for deployment », cocher **Preview**. Chaque preview reçoit alors sa branche `preview/<branche>`, et la production garde la branche par défaut.
3. **Variables** :
   - Neon injecte `DATABASE_URL` (avec pooler, utilisée par l'application) et `DATABASE_URL_UNPOOLED` (connexion directe, utilisée par les migrations via `prisma.config.ts`) ;
   - ajouter `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` pour l'environnement Preview. Cela coupe la toolbar Vercel, que la CSP bloquerait ;
   - laisser cochée « Enable access to System Environment Variables » : le build lit `VERCEL_ENV` et `VERCEL_PROJECT_PRODUCTION_URL` (voir [Indexation](#indexation-t10)) ;
   - `SITE_URL` (optionnelle sur Vercel) : origine canonique, `https://…` sans chemin. À défaut, Vercel fournit son plus court domaine de production personnalisé, sinon le domaine `vercel.app`.
4. **Sauvegarde** : le plan Free n'a **pas** de snapshot quotidien planifié. On dispose de 6 h d'historique (restauration à un instant donné) et d'un snapshot manuel. C'est suffisant tant que la base ne contient aucune donnée réelle (phase 1). **Avant la phase 3**, passer à Launch et planifier les snapshots. Exemple tiré de la doc Neon, rétention de 7 jours :

   ```bash
   neon snapshots schedule set --branch main --frequency daily --hour 23 --retention 604800
   ```

   Launch permet aussi une restauration à un instant donné jusqu'à 7 jours en arrière.

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

## Logs (T6)

Les logs sont des lignes JSON (`src/server/logging/`). Chaque niveau passe par sa méthode `console.*`, car c'est elle que Vercel lit pour fixer le niveau (voir `docs/decisions.md`). Chaque route API renvoie son `requestId` dans l'en-tête `x-request-id`. Pour retrouver une ligne : Vercel, _Logs_, puis filtrer sur le `requestId`.

Vérifier en production (provoque une ligne `error`) :

```bash
curl -si -X POST "$PRODUCTION_URL/api/v1/client-errors" -H "content-type: application/json" \
  -d '{"message":"Test T6"}' | grep -i x-request-id   # attendu : 204 et un requestId
```

Vérifié le 2026-11-20 sur le déploiement `74ae9a5` : la ligne apparaît dans les logs Vercel au niveau `error` (source `function`, chemin `/api/v1/client-errors`), avec son `requestId` et sans secret.

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

- [x] `/ar` répond en HTTPS en production : workflow « Fumée en production » vert (run 44405940399, 2026-11-18, déploiement `74ae9a5`).
- [x] Sauvegarde : **écart assumé** avec le critère « sauvegarde quotidienne » du plan (Neon Free n'en a pas). À la place, une restauration à un instant donné est testée une fois dans les 6 h d'historique. La sauvegarde quotidienne devient obligatoire en Launch avant la phase 3.
  - Testée le 2026-11-20 par l'API Neon : branche temporaire créée depuis `main` à 11:00 UTC (une heure en arrière), avec le même contenu que `main` (1 migration, table `_prisma_migrations`), puis supprimée. `main` n'a pas été touchée.
- [x] Un retour arrière a été exécuté une fois : déployer un changement anodin, faire le retour arrière, vérifier `/ar`, puis `vercel promote`. Le noter ci-dessous.

| Date                 | Déploiement de départ    | Retour vers              | Vérification                                    | Promote                             |
| -------------------- | ------------------------ | ------------------------ | ----------------------------------------------- | ----------------------------------- |
| 2026-11-20 12:30 UTC | `dpl_CkbG2…` (`74ae9a5`) | `dpl_BPqUe…` (`d484c91`) | domaine de prod sur `dpl_BPqUe…`, `/ar` 200 RTL | `dpl_CkbG2…` rétabli, `/ar` 200 RTL |

Exécuté par l'API REST Vercel : `POST /v1/projects/{projectId}/rollback/{deploymentId}`, puis `POST /v10/projects/{projectId}/promote/{deploymentId}`, chacun avec le corps `{}` (sans corps, Vercel répond 415). Vérification : `GET /v13/deployments/{domaine de prod}` renvoie le déploiement servi.

Sources (2026-11-18) : vercel.com/docs (regions, instant-rollback, cli/rollback, vercel-toolbar, cdn-security/encryption, deployment-protection, legal/terms), neon.com/docs (vercel-managed-integration, regions, guides/backup-restore, pricing), prisma.io/docs/orm/v7 (pgbouncer, prisma-config-reference).

## Acceptation T10

Vérifié le 2026-11-20, en lecture seule (requêtes GET et HEAD), sur la production (déploiement `2a441b0`, `https://hikayat-makan-pi.vercel.app`) et sur la preview `t9-retour-arriere` (`dpl_EGn3qjjrVX851y9CR3kFpLZoTkag`).

- [x] **Le HTML serveur contient tout le contenu** : `/ar` répond 200, `<html lang="ar" dir="rtl">`, un seul `<main>`, titre, description, canonique et Open Graph présents dans la réponse sans JavaScript.
- [x] **Production indexable** : ni `X-Robots-Tag` ni `<meta name="robots">` sur `/ar` ; `robots.txt` (`Allow: /`, ligne `Sitemap`) et `sitemap.xml` (`application/xml`, `urlset`, une `<loc>` : `/ar`) répondent 200.
- [x] **`/admin` non indexable** : `/admin` et `/admin/connexion` renvoient `X-Robots-Tag: noindex, nofollow` en production.
- [x] **Tests** : `e2e/smoke.spec.ts` et `e2e/seo.spec.ts` lancés contre la production : 7 réussis, 0 échec.
- [x] **Prévisualisations non indexables** : sans contournement, la preview renvoie un `302` vers l'authentification Vercel, avec `X-Robots-Tag: noindex` posé par Vercel. Avec le secret de contournement (en-tête `x-vercel-protection-bypass`), `/ar` répond 200 avec `X-Robots-Tag: noindex, nofollow`, l'en-tête de `next.config.ts`. Vérifié par le propriétaire du dépôt.
