# حكاية مكان — Plan de la phase 1 : Fondations

> Source : `histoir_place_outOfScop.md` (§ 21, phase 1). Projet indépendant de tout autre dépôt.
> Ville pilote : **Fès**. Relecteur : **oui, optionnel**.

## Cadre

**Résultat attendu** : une page d'accueil vide en production sur `/ar`, RTL, indexable, déployée par la CI.

**Hors phase 1** : schéma complet, auth et CRUD (phase 3) ; jetons, typographie et animations (phase 2) ; tout contenu sur Fès.

**Fès et relecteur** : en phase 1, ils n'apparaissent que dans la page de décisions et la configuration du site. Relecteur optionnel = décision 8 du plan produit : sans relecture, une histoire est publiée en `UNVERIFIED` avec la mention « محتوى قيد التحقق ». Aucun texte historique provisoire sur Fès, même en données de démonstration (§ 7).

**Skills et plugins** : aucun plugin n'est installé. Tout skill est audité avant usage (T0), car un skill peut lire ou modifier des données par des requêtes réseau. Les installations `/plugin` citées au § 19.1 du plan produit ne sont pas reprises.

**Versions** : aucune version, aucun statut d'API (View Transitions compris) n'est tenu pour acquis. Chacun est vérifié dans la documentation officielle au démarrage.

## Tâches

### T0 — Audit des skills (avant tout usage)

- **Objectif** : n'utiliser aucun skill non lu.
- **Tâches techniques** :
  - Lire le `SKILL.md` et tous les scripts joints de chaque skill, y compris ceux déjà installés (`ui-ux-pro-max`, `design-critique`, `expo-animation`…).
  - Y chercher les appels réseau (`curl`, `fetch`, `http`, `Invoke-WebRequest`), les commandes shell, les lectures de `.env` ou de secrets, et les instructions cachées.
  - Vérifier les hooks et les permissions dans `settings.json`.
  - Consigner le verdict par skill : autorisé ou refusé, date, version lue.
- **Tests** : relancer la recherche d'appels réseau après chaque mise à jour d'un skill.
- **Critères d'acceptation** : chaque skill utilisé a un verdict écrit ; aucun plugin n'est installé.

### T1 — Socle Next.js

- **Objectif** : un projet qui démarre, typé strictement.
- **Tâches techniques** : Next.js App Router, TypeScript `strict`, ESLint + Prettier, arborescence du § 13 (`app/[locale]`, `server/`, `shared/`…), versions figées par lockfile.
- **Tests** : `lint`, `typecheck` et `build` passent en local.
- **Critères d'acceptation** : `shared/` n'importe ni Next, ni React, ni Prisma (règle ESLint).

### T2 — Tailwind RTL

- **Objectif** : le RTL comme référence.
- **Tâches techniques** : Tailwind, `<html lang="ar" dir="rtl">`, propriétés logiques uniquement (`ms-`, `pe-`, `start`/`end`), règle de lint interdisant `ml-`, `pr-`, `left-`.
- **Tests** : Playwright vérifie `lang` et `dir` ; contrôle manuel sur Chrome et Safari mobiles.
- **Critères d'acceptation** : aucune classe directionnelle physique dans le code.

### T3 — i18n `ar`

- **Objectif** : des URLs prêtes pour le multilingue.
- **Tâches techniques** : next-intl, route `/[locale]/`, `messages/ar.json`, redirection `/` → `/ar`, helpers `Intl` en `ar-MA` (chiffres 0-9, MAD, `Africa/Casablanca`).
- **Tests** : tests unitaires des formats de date, nombre et monnaie ; une locale inconnue renvoie 404.
- **Critères d'acceptation** : aucune chaîne en dur dans les composants ; les chiffres affichés sont occidentaux.

### T4 — Prisma + PostgreSQL

- **Objectif** : une base connectée et migrée, sans modèle métier.
- **Tâches techniques** : Prisma, une migration initiale minimale, client unique dans `server/`, endpoint `/api/v1/health` qui interroge la base.
- **Tests** : test d'intégration du health check sur une base de test.
- **Critères d'acceptation** : la migration s'applique sur une base vide ; le health check renvoie 200, ou 503 si la base est coupée.

### T5 — Configuration et secrets

- **Objectif** : aucun secret dans le dépôt, démarrage refusé si la configuration est incomplète.
- **Tâches techniques** : validation Zod des variables d'environnement au démarrage, `.env.example` documenté, `.env` dans `.gitignore`, détection de secrets dans la CI.
- **Tests** : test unitaire : une variable manquante donne une erreur lisible.
- **Critères d'acceptation** : aucun secret dans l'historique Git.

### T6 — Logger

- **Objectif** : des logs exploitables dès le premier déploiement.
- **Tâches techniques** : pino en JSON sur la sortie standard avec les champs du § 14, `requestId` par requête, masquage des secrets, endpoint des erreurs client limité en débit.
- **Tests** : test unitaire du format et du masquage.
- **Critères d'acceptation** : une erreur provoquée apparaît dans la console de l'hébergeur avec son `requestId`, sans secret ni donnée personnelle.

### T7 — Tests

- **Objectif** : le filet minimal.
- **Tâches techniques** : Vitest, Playwright avec un profil mobile, un test de fumée sur `/ar`.
- **Tests** : le test de fumée vérifie le statut 200, `lang="ar"`, `dir="rtl"` et le titre.
- **Critères d'acceptation** : les deux suites passent en local et en CI.

### T8 — CI

- **Objectif** : rien n'entre sur `main` sans contrôle.
- **Tâches techniques** : GitHub Actions (lint, typecheck, tests, build), protection de `main`, alertes de dépendances, actions épinglées par SHA.
- **Tests** : une Pull Request volontairement cassée est bloquée.
- **Critères d'acceptation** : la fusion est impossible si un contrôle échoue.

### T9 — Déploiement

- **Objectif** : la production et une prévisualisation par Pull Request.
- **Tâches techniques** :
  - Choisir le PaaS et le PostgreSQL managé selon la décision 6 (coût, sauvegardes automatiques, région).
  - Appliquer les migrations au déploiement.
  - Mettre HTTPS, HSTS et une CSP de base.
  - Écrire la procédure de retour arrière.
- **Tests** : test de fumée sur l'URL de production ; un retour arrière réellement exécuté une fois.
- **Critères d'acceptation** : `/ar` répond en HTTPS en production ; une sauvegarde quotidienne est active.

### T10 — Socle SEO

- **Objectif** : une page indexable dès le départ.
- **Tâches techniques** : métadonnées (titre, description, canonique), Open Graph, `sitemap.xml`, `robots.txt`, `noindex` sur les prévisualisations et sur `/admin`.
- **Tests** : Playwright vérifie les balises ; le sitemap est valide.
- **Critères d'acceptation** : le HTML serveur contient tout le contenu ; les prévisualisations ne sont pas indexables.

### T11 — Documentation

- **Objectif** : un mono-dev s'y retrouve dans six mois.
- **Tâches techniques** : README, note d'architecture d'une page, conventions, procédure de déploiement, page de décisions (Fès, relecteur optionnel, hébergeur choisi).
- **Tests** : installer le projet sur un poste vierge en suivant le README seul.
- **Critères d'acceptation** : l'installation aboutit sans aide.

## Definition of Done de la phase

T0 à T11 acceptées, CI verte, `/ar` en production, retour arrière testé.

## Gouvernance à respecter

- **Contenu** : chaque histoire porte sa nature (`FACT`, `EDITORIAL`, `LEGEND`, `RECONSTRUCTION`), ses sources, son statut et sa date de vérification.
- **IA** : tout contenu assisté par IA est relu et sourcé avant publication, données de démonstration comprises.
- **Technique** : toute modification passe par une Pull Request avec CI ; les décisions sont notées sur une page ; `.env.example` et le schéma restent documentés.
- **Skills** : audit T0 refait à chaque ajout ou mise à jour ; registre des verdicts tenu à jour.
- **Données personnelles** : loi 09-08, formalités CNDP vérifiées avant toute collecte.
- **Exploitation** : sauvegardes quotidiennes, restauration testée périodiquement, actions d'administration tracées dans `AuditLog`.

## Restrictions

- Aucun fait, source ou label inventé ; aucune fiction présentée comme un fait.
- Aucune image sans auteur, licence et source.
- Aucun compte public ni collecte de données au MVP ; géolocalisation jamais imposée.
- Aucun plugin ; aucun skill non audité ; aucun skill n'accède aux secrets ni à la base de production.
- Aucun secret dans le dépôt, les logs ou un prompt.
- Aucune technologie exclue par le § 8 (Redis, Elasticsearch, PostGIS, microservices, Kubernetes…) sans besoin mesuré.
- Aucune anticipation des phases 2 et 3 dans la phase 1.

## Bonnes pratiques

- Une tâche = une Pull Request courte, fusionnée seulement quand ses critères sont remplis.
- Vérifier chaque version et chaque statut d'API dans la documentation officielle, jamais de mémoire.
- Tester sur un vrai smartphone milieu de gamme en 4G dès la phase 1.
- Traiter la sortie d'un skill ou d'une IA comme une proposition à relire, pas comme une vérité.
- Moindre privilège : jetons CI et accès base limités au strict nécessaire, production séparée des prévisualisations.
- Déployer tôt et souvent : la page vide en production vient avant toute fonctionnalité.
