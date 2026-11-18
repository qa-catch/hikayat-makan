# حكاية مكان — Plan de conception produit et technique

> Version révisée. Langue du document : français ; libellés produit : arabe.
> Principe directeur : **simplicité avant complexité** — toute technologie ou fonctionnalité supplémentaire doit répondre à un besoin réel.

---

## 1. Vision

**« حكاية مكان »** est une plateforme numérique marocaine dédiée à la découverte du patrimoine historique, culturel, naturel et artisanal du Maroc.

> **Chaque lieu a une histoire, chaque histoire a des personnages, et chaque territoire possède des lieux, des expériences et des produits à découvrir.**

L'utilisateur part d'un lieu, comprend son histoire, rencontre les personnages et événements qui lui sont liés, puis découvre le territoire autour : sites à visiter, savoir-faire, produits et, à terme, acteurs économiques locaux.

```text
Histoire → Lieu → Culture → Tourisme → Artisanat → Économie locale
```

### Trois piliers, une finalité

```text
                    حكاية مكان
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
     التاريخ          السياحة      الصناعة التقليدية
        │                │                │
     الحكايات         الأماكن          المنتجات
     الشخصيات         التجارب          الحرفيون
     الأحداث       المطاعم والفنادق     التعاونيات
        └────────────────┼────────────────┘
                         ↓
                  الاقتصاد المحلي
```

Trois piliers de contenu (histoire, tourisme, artisanat) au service d'une finalité : l'économie locale.

### Contraintes structurantes

- Projet **mono-dev** : une seule personne doit pouvoir comprendre, faire évoluer et exploiter le produit.
- Priorités : simplicité, faible coût de maintenance, technologies largement documentées, composants réutilisables, sécurité, performance, évolutivité progressive.
- Ne pas surdimensionner l'architecture dès le départ.

---

## 2. Principes de conception

| Principe | Signification concrète |
| --- | --- |
| **Content-first** | Le contenu historique et culturel est le cœur du produit. |
| **Trust-first** | La fiabilité de l'information passe avant la monétisation. |
| **Mobile-first** | Le public marocain navigue majoritairement sur smartphone, souvent en données mobiles : pages légères d'abord. |
| **SEO-first** | Chaque contenu est une page publique indexable, rendue côté serveur. |
| **RTL-first** | L'arabe et le RTL sont la référence, pas une adaptation. |
| **Immersif** | La navigation est animée et mise en scène : on parcourt un récit, on ne fait pas défiler une page classique de haut en bas (§ 19.1). |
| **Simple** | Pas d'abstraction ni d'outil sans besoin immédiat. |
| **Modulaire** | Chaque domaine (lieux, histoires, artisanat…) évolue indépendamment. |
| **Réutilisable** | Composants, services et schémas servent à plusieurs pages, puis au mobile. |
| **Scalable** | La structure supporte une forte croissance du contenu sans refonte (§ 17). |

---

## 3. Public, langues et ancrage marocain

### Plateformes

- **Web responsive** : conçu d'abord pour le mobile, puis tablette et desktop (MVP). Toute page et toute animation fonctionnent au doigt comme à la souris (§ 19.1).
- **iOS et Android** : application React Native (V2), sur la même API.

### Publics

- Marocains curieux de leur patrimoine (résidents et MRE).
- Touristes nationaux puis internationaux (à partir de l'ajout du français et de l'anglais).
- Élèves, étudiants, enseignants.
- À terme : artisans, coopératives et professionnels du tourisme.

### Langues

- **MVP : arabe standard (العربية الفصحى)**, interface RTL, locale `ar-MA`.
- Les noms propres, termes d'artisanat et expressions locales peuvent être donnés dans leur forme marocaine (darija, amazigh) avec explication.
- **Ultérieurement** : français, anglais, puis amazigh (ⵜⴰⵎⴰⵣⵉⵖⵜ, langue officielle — tifinagh).
- Le multilingue n'est pas développé dans le MVP, mais les URLs (`/ar/...`) et le modèle de données le prévoient (voir § 9).

### Conventions locales

- Chiffres occidentaux (0-9), usage courant au Maroc — vérifier le rendu de `Intl` en `ar-MA`.
- Monnaie : dirham (MAD / درهم). Fuseau : `Africa/Casablanca`.
- Dates grégoriennes ; date hégirienne en complément lorsque c'est pertinent pour un contenu historique.
- Contact professionnel : téléphone et **WhatsApp** en priorité (usage dominant chez les artisans et coopératives), puis réseaux sociaux.
- Partage : liens courts et aperçus soignés (Open Graph) pour WhatsApp, Facebook et Instagram.

### Respect de la diversité du patrimoine

Le patrimoine marocain est pluriel : amazigh, arabo-islamique, andalou, hassani-saharien, hébraïque, africain et méditerranéen. La taxonomie (périodes, catégories, tags) doit permettre de représenter toutes ces composantes sans en privilégier une.

### Lieux de culte et lieux sensibles

Les fiches de mosquées, zaouïas, mausolées, synagogues et cimetières doivent indiquer les **conditions d'accès** (accès libre, restreint, non ouvert aux visiteurs, tenue attendue) et adopter un ton respectueux.

---

## 4. Objectifs métier

### 4.1 Raconter l'histoire des lieux (pilier 1 — cœur du MVP)

Bibliothèque de contenus couvrant : villes historiques, médinas, places, monuments, palais, kasbahs, ksour, remparts et portes, médersas, fondouks, sites archéologiques, quartiers anciens, événements, traditions, personnages.

Une histoire peut être liée à un ou plusieurs lieux, personnages, événements, à une période historique, à des médias et à des sources.

**Règle absolue** — chaque histoire porte une **nature** explicite, visible par le lecteur :

| Nature | Définition |
| --- | --- |
| `FACT` — وقائع موثّقة | Faits historiques sourcés. |
| `EDITORIAL` — سرد تحريري | Narration éditoriale fondée sur des faits. |
| `LEGEND` — رواية شعبية | Légende ou tradition orale, présentée comme telle. |
| `RECONSTRUCTION` — إعادة تمثيل | Reconstitution ou contenu dramatisé, signalé comme tel. |

Aucune fiction n'est présentée comme un fait. 

### 4.2 Découverte touristique (pilier 2)

Destinations et espaces naturels : plages, montagnes, vallées, gorges, cascades, lacs, oasis, déserts, forêts, parcs, villages, points de vue, stations, circuits et activités.

Une fiche destination contient : description, photos/vidéos, localisation et carte, activités, informations pratiques (meilleure saison, accès, précautions), lieux proches, produits locaux. Restaurants et hébergements arrivent avec les fiches professionnelles (V1.1).

### 4.3 Artisanat et produits du terroir (pilier 3)

Savoir-faire et produits : zellige, poterie, dinanderie, tapis, maroquinerie, vêtements traditionnels, broderie, bijoux, bois, produits agricoles, produits de coopératives et du terroir.

Un produit peut être associé à : une région, une ville, un lieu, un savoir-faire/technique, une histoire, des photos, un éventuel **label officiel** (saisi uniquement s'il est vérifiable), et un **producteur** : nom de l'artisan ou de la coopérative et contact (téléphone / WhatsApp), publiés avec son accord. Au MVP ce sont de simples champs du produit ; la fiche professionnelle complète arrive en V1.1.

### 4.4 Objectif économique (après le MVP)

Promouvoir tourisme, patrimoine, restauration, hébergement, artisanat et activités via des fiches professionnelles : hôtels, riads et maisons d'hôtes, restaurants, artisans, coopératives, guides, agences, prestataires.

La publicité reste : contextualisée, **clairement identifiée** (« محتوى مُموَّل »), non intrusive, cohérente avec le contenu consulté. Un contenu sponsorisé n'influence jamais un contenu historique.

---

## 5. Parcours utilisateur

```text
Lieu
  ↓
Son histoire
  ↓
Personnages et événements associés
  ↓
Lieux à visiter autour
  ↓
Savoir-faire et produits locaux
  ↓
(V1.1) Restaurants / hébergements / expériences
```

Questions qui guident la navigation et les blocs « à découvrir aussi ». Elles inspirent la structure des pages ; elles ne sont pas toutes des fonctionnalités du MVP.

| Thème | Question | Version |
| --- | --- | --- |
| Histoire | ما قصة هذا المكان؟ | MVP |
| Personnages | من الشخصيات المرتبطة بهذا المكان؟ | MVP |
| Événements | ما الأحداث التاريخية التي وقعت هنا؟ | MVP |
| Tourisme | ما الأماكن التي يمكنني زيارتها هنا؟ | MVP |
| Culture locale | بماذا تتميز هذه المنطقة؟ | MVP |
| Shopping | ماذا يمكنني أن أشتري من هذه المنطقة؟ | MVP |
| Activités | ما الأنشطة التي يمكنني القيام بها هنا؟ | MVP (informatif) |
| Gastronomie | ماذا يمكنني أن أتذوق هنا؟ | MVP (spécialités) / V1.1 (adresses) |
| Restauration | أين يمكنني تناول الطعام هنا؟ | V1.1 |
| Hébergement | أين يمكنني الإقامة هنا؟ | V1.1 |

Les recommandations du MVP sont **déterministes** : même ville, même région, liens éditoriaux explicites. Pas de moteur de recommandation.

---

## 6. Périmètre

### 6.1 MVP — site public

| Page | Contenu |
| --- | --- |
| **Accueil** | Lieux mis en avant, histoires, destinations, personnages, produits, sélection éditoriale. |
| **Ville / région** | Page pivot du territoire : ses lieux, histoires, destinations, savoir-faire. |
| **Lieux historiques** | Liste paginée, filtres simples (ville, région, catégorie, période), fiche. |
| **Histoires** | Lecture par scènes (§ 19.1), nature affichée, sources, lieux et personnages liés. |
| **Personnages** | Fiche, période, lieux et histoires associés. |
| **Événements** | Fiche courte, rattachée aux lieux, personnages et périodes. |
| **Destinations** | Lieux naturels et touristiques, informations pratiques. |
| **Artisanat et produits** | Savoir-faire, produits, territoire d'origine. |
| **Carte** | Carte interactive des lieux, filtrable par type. |
| **Recherche** | Globale : lieux, histoires, personnages, destinations, produits. |
| **Pages fixes** | À propos, méthodologie éditoriale et sources, mentions légales, confidentialité, contact / signaler une erreur. |

Pas de compte utilisateur public dans le MVP : aucune fonctionnalité ne l'exige, et cela évite de collecter des données personnelles.

« Contenus populaires » = sélection éditoriale manuelle (champ `featured`) tant qu'il n'y a pas de mesure d'audience fiable.

### 6.2 MVP — back-office

Réservé aux rôles `ADMIN` et `EDITOR`.

- Actions : créer, modifier, supprimer, publier, dépublier, archiver.
- Contenus : lieux, histoires, personnages, événements, périodes, savoir-faire, produits, médias, sources, catégories, tags, villes/régions.
- Statuts : `DRAFT` → `PUBLISHED` → `ARCHIVED`. Pas de workflow de validation complexe.
- Prévisualisation d'un brouillon avant publication.
- Journal des actions administratives (qui, quoi, quand).

### 6.3 Hors MVP

| Version | Contenu |
| --- | --- |
| **V1.1** | Fiches professionnelles (`Business`), contenus sponsorisés identifiés, restaurants et hébergements. |
| **V1.2** | Français et anglais. |
| **V2** | Comptes utilisateurs (favoris, parcours enregistrés), application React Native, audio (histoires racontées), amazigh, contributions externes avec validation éditoriale. |

---

## 7. Gouvernance du contenu

### Traçabilité

Tout contenu historique stocke : auteur, sources structurées (voir `Source` § 9), date de publication, date de mise à jour, **date de dernière vérification**, et un **statut de vérification** :

- `UNVERIFIED` — affiché avec la mention « محتوى قيد التحقق » ;
- `VERIFIED` — sources contrôlées.

Une modification importante est tracée dans le journal administratif.

### Règles éditoriales

La plateforme ne doit pas :

- inventer de faits historiques ni de sources ;
- présenter une fiction ou une légende comme un fait ;
- publier une image sans droits vérifiés (auteur, licence et source obligatoires) ;
- publier un label ou une distinction non vérifiable ;
- rendre la publicité trompeuse ou cacher un contenu sponsorisé.

Cette règle s'applique aussi aux données de démonstration (seed) et à tout contenu assisté par IA : relu, sourcé, puis seulement publié.

### Qualité plutôt que volume

Lancement sur un **territoire pilote** (une ville ou une région) traité en profondeur, plutôt qu'une couverture nationale superficielle.

---

## 8. Stack technique

| Besoin | Choix recommandé | Remarque |
| --- | --- | --- |
| Framework web | **Next.js (App Router) + React + TypeScript strict** | SSR/SSG/ISR, SEO, routing. |
| UI | **Tailwind CSS** + composants maison | Propriétés logiques (`ms-`, `pe-`, `start`/`end`) pour le RTL. Primitives accessibles sans style (type Radix) autorisées ; pas de framework UI lourd. |
| Animation | **View Transitions** (composant React `<ViewTransition>`) + **Motion** (ex-Framer Motion) + CSS (`position: sticky`, scroll-snap) | § 19.1. Les View Transitions sont encore expérimentales dans Next.js : statut à vérifier au démarrage, Motion sert de repli ; un navigateur non compatible affiche simplement la page sans animation. GSAP seulement si une scène l'exige. |
| i18n | **next-intl** | Routage `/[locale]/`, `ar` seul au MVP. |
| Validation | **Zod** | Schémas partagés web / API / mobile. |
| ORM / BDD | **Prisma + PostgreSQL** | Relationnel, structuré. |
| API | **Route Handlers Next.js**, REST versionnée `/api/v1` | Consommée par la future app mobile. |
| Auth back-office | **Better Auth** — e-mail + mot de passe | Sessions en cookie `httpOnly`, rôles `ADMIN` / `EDITOR`. |
| Médias | Stockage objet compatible S3 + **`next/image`** | Jamais dans PostgreSQL. |
| Carte | **MapLibre GL** + fournisseur de tuiles | Voir § 11. |
| Recherche | **PostgreSQL Full Text Search** + `pg_trgm` | Voir § 10. |
| Logs | **pino** (JSON structuré) | Voir § 14. |
| Tests | **Vitest** (unit/intégration) + **Playwright** (E2E) | |
| Qualité | ESLint + Prettier | |
| CI/CD | GitHub + GitHub Actions | |
| Hébergement | PaaS Next.js + PostgreSQL managé avec sauvegardes automatiques | Voir § 23, décision 6. |
| Mobile (V2) | **React Native + Expo + TypeScript** | |

Ne pas introduire au départ : NestJS séparé, Redis, Elasticsearch/OpenSearch, PostGIS, microservices, architecture événementielle, Kubernetes, serverless excessif, plusieurs bases spécialisées, Prometheus/Grafana/OpenTelemetry. Chacun pourra être ajouté quand un besoin mesuré le justifiera.

---

## 9. Modèle de données

### Territoire

```text
Region ──< City ──< Place
```

- `Region` : régions administratives du Royaume (référentiel de départ).
- `City` : ville ou commune ; page pivot du territoire.
- `Place` : **toute entité géolocalisée visitable**. Un seul modèle, distingué par `kind` :
  - `HERITAGE` — lieu historique (monument, médina, kasbah…) ;
  - `NATURE` — destination naturelle ou touristique (plage, vallée, oasis…).

« Lieux historiques » et « Destinations » sont donc deux vues du même modèle : une seule carte, une seule recherche, un seul CRUD. La catégorie fine passe par `Category`.

### Entités

| Entité | Rôle | Champs notables |
| --- | --- | --- |
| `Region`, `City` | Territoire | nom, slug, coordonnées du centre |
| `Place` | Lieu / destination | `kind`, catégorie, `latitude`, `longitude`, `address`, ville, infos pratiques, conditions d'accès |
| `Story` | Histoire | `nature`, `verificationStatus`, `lastVerifiedAt`, auteur, **scènes ordonnées** (`StoryScene` : texte, média, type d'effet) |
| `Person` | Personnage historique | période, dates si établies |
| `Event` | Événement historique | date ou période, précision de la date |
| `Period` | Dynastie / époque | ordre chronologique |
| `Craft` | Savoir-faire / technique | |
| `Product` | Produit artisanal ou du terroir | savoir-faire, origine, label éventuel, `producerName`, `producerContact` |
| `Business` (V1.1) | Professionnel | type, contact, WhatsApp, `sponsored` |
| `Media` | Image / vidéo / audio | `url`, `type`, `alt`, `caption`, `source`, `copyright`, `license` |
| `Source` | Référence | type (ouvrage, article, archive, témoignage oral, site), auteur, titre, année, URL, pages |
| `Category`, `Tag` | Classement | |
| `User` | Compte back-office | rôle `ADMIN` / `EDITOR` |
| `AuditLog` | Journal administratif | utilisateur, action, entité, date |

### Champs communs à tout contenu éditorial

```text
id, slug, title, summary, content,
status (DRAFT | PUBLISHED | ARCHIVED), featured,
seoTitle, seoDescription, coverMediaId, aliases,
authorId, publishedAt, createdAt, updatedAt
```

### Relations principales

```text
City
 └── Places (HERITAGE / NATURE)
       ├── Stories   (n-n)
       ├── Persons   (n-n)
       ├── Events    (n-n)
       ├── Products  (n-n)
       ├── Media
       └── Businesses (V1.1)

Story  ── n-n ── Person, Event, Source ;  n-1 ── Period
Event  ── n-1 ── Period ;  n-n ── Person
Person ── n-1 ── Period
Product ── n-1 ── Craft ; n-n ── City / Region
```

### Traductions et slugs

- Les champs de base sont en **arabe** (langue source).
- **Slug unique en caractères latins**, commun à toutes les langues (`/ar/places/bab-boujloud`) : stable, lisible une fois partagé sur WhatsApp, sans encodage `%D9%…`. Le titre arabe est porté par la page et ses métadonnées.
- `aliases` : variantes de nom (arabe, français, translittérations) pour la recherche.
- V1.2 : ajout d'une table `Translation (entityType, entityId, locale, fields JSON)` — migration additive, sans refonte du modèle.

---

## 10. Recherche

PostgreSQL Full Text Search suffit pour le MVP, **à condition de traiter l'arabe correctement** :

- configuration `arabic` de PostgreSQL (racinisation) ;
- colonne de recherche **normalisée** : suppression du tashkīl et du tatwīl, unification des formes d'alef (أ إ آ → ا), de ى/ي et de ة/ه — la même normalisation est appliquée à la requête ;
- `pg_trgm` pour les fautes de frappe et les saisies en caractères latins (« Fes », « Fès », « فاس ») via `aliases` ;
- index GIN créés par migration SQL ; requêtes via SQL brut encapsulé dans un seul service `search`.

Résultats groupés par type, paginés. Un moteur externe ne sera envisagé que si le volume ou la qualité l'exigent.

---

## 11. Carte et géolocalisation

- Stockage simple : `latitude`, `longitude`, `address`, ville, région. Pas de PostGIS au départ ; la proximité se calcule par ville ou par une formule de distance simple.
- Carte chargée en différé (lazy), avec regroupement des marqueurs ; une liste reste toujours disponible sans la carte.
- La géolocalisation de l'utilisateur est **facultative, à la demande**, jamais permanente ni stockée.
- **Critères de choix du fournisseur de tuiles** : représentation des frontières conforme à la cartographie officielle du Royaume (à vérifier visuellement avant tout engagement), libellés en arabe, coût, compatibilité React Native.

---

## 12. Médias

- Stockage objet compatible S3 ; optimisation automatique (formats modernes, tailles adaptées) via `next/image`.
- Upload validé : type MIME réel, taille maximale, dimensions.
- `alt`, `source`, `copyright` et `license` obligatoires avant publication.
- Vidéos : intégrées depuis une plateforme externe au MVP (pas d'hébergement vidéo propre).

---

## 13. Architecture

```text
   Web (Next.js)                  Mobile (React Native, V2)
        │                                   │
        │ Server Components                 │ HTTPS
        │                                   ↓
        │                          API REST /api/v1
        │                          (Route Handlers)
        └───────────────┬───────────────────┘
                        ↓
              Services (logique métier)
                        │
          ┌─────────────┼──────────────┐
          ↓             ↓              ↓
     Prisma ORM    Stockage médias   (auth, logs)
          ↓           (S3)
     PostgreSQL

   Navigateur / app ──→ Fournisseur de tuiles (carte)
```

- **Une seule couche de services** porte la logique métier. Les pages web l'appellent directement côté serveur ; l'API `/api/v1` l'expose au mobile. Aucune logique dans les composants ni dans les handlers.
- Un backend séparé ne sera introduit que si le volume ou l'équipe l'exige.

### Structure du projet

```text
src/
├── app/
│   ├── [locale]/          # site public
│   ├── admin/             # back-office
│   └── api/v1/            # API REST
├── components/
│   ├── ui/  layout/  cards/  maps/  content/  forms/
├── features/
│   ├── places/  stories/  persons/  events/
│   ├── crafts/  products/  search/  businesses/ (V1.1)
├── server/                # services, accès Prisma, auth, logger
├── shared/                # schémas Zod, types, constantes — TypeScript pur
├── lib/  hooks/  styles/
prisma/
├── schema.prisma  migrations/  seed.ts
messages/
└── ar.json
public/
```

`shared/` ne dépend ni de Next.js ni de React ni de Prisma : le jour où l'application mobile démarre, il devient un package de workspace (`packages/shared`) sans réécriture. Le code UI n'est pas partagé artificiellement entre web et mobile.

---

## 14. Journalisation

Logs structurés (JSON) sur la sortie standard, consultables dans la console de l'hébergeur ; pas d'infrastructure d'observabilité.

- Champs : `timestamp`, `level` (`INFO` / `WARN` / `ERROR`), `module`, `action`, `message`, `context`, `userId` et `requestId` si pertinents.
- Événements : erreurs API, exceptions, erreurs JavaScript côté client (remontées par un endpoint dédié), échecs d'authentification, erreurs de validation, erreurs de chargement, erreurs métier inattendues.
- Actions administratives importantes : en base (`AuditLog`), consultables depuis le back-office.
- Aucun secret ni donnée personnelle inutile dans les logs.
- Un service de suivi d'erreurs pourra être ajouté plus tard si nécessaire.

---

## 15. Sécurité et données personnelles

- HTTPS partout ; en-têtes de sécurité (CSP, HSTS).
- Validation Zod de toute entrée, côté serveur.
- Endpoints d'écriture protégés par rôle ; moindre privilège.
- Sessions en cookies `httpOnly`, `secure`, `sameSite` ; mots de passe hachés (argon2 ou bcrypt).
- Limitation de débit sur la connexion et la recherche.
- Validation des uploads (§ 12).
- Secrets en variables d'environnement, jamais dans le dépôt.
- Dépendances mises à jour régulièrement (alertes automatiques).
- Référence : recommandations essentielles de l'OWASP, sans outillage complexe.

**Données personnelles** : conformité à la **loi marocaine 09-08** (CNDP). Collecte minimale, pas de compte public au MVP, mesure d'audience respectueuse de la vie privée, politique de confidentialité en arabe. Les formalités auprès de la CNDP sont à vérifier avant toute collecte (comptes, formulaires, newsletter).

---

## 16. SEO et partage

- URLs propres, stables, préfixées par la langue :

```text
/ar/regions/<slug>
/ar/cities/fes
/ar/places/<slug>
/ar/destinations/<slug>
/ar/stories/<slug>
/ar/persons/<slug>
/ar/events/<slug>
/ar/crafts/<slug>
/ar/products/<slug>
```

- `<html lang="ar" dir="rtl">`, meta title et description par page, URL canonique.
- Open Graph et image de partage par contenu.
- `sitemap.xml` généré, `robots.txt`, `hreflang` dès l'ajout d'une seconde langue.
- Données structurées schema.org lorsque pertinent (`Article`, `Place`/`TouristAttraction`, `Person`, `Product`, `BreadcrumbList`).
- Contenu rendu côté serveur ; brouillons et back-office non indexés.

Le socle SEO (métadonnées, sitemap, canonique) est posé dès la phase 1, pas en fin de projet.

---

## 17. Performance et scalabilité

- Pages de contenu en génération statique avec **revalidation à la publication** (cache Next.js) ; pas de couche de cache supplémentaire.
- Images optimisées et lazy loading ; composants lourds (carte, galerie) chargés en différé.
- Pagination systématique des listes.
- Polices arabes auto-hébergées et sous-ensemblées.
- Budget : Core Web Vitals « bons » sur un smartphone milieu de gamme en 4G.

La scalabilité vient de : l'architecture modulaire, une API propre, PostgreSQL, le stockage externe des médias, le cache Next.js et la pagination — pas d'une infrastructure distribuée.

---

## 18. Accessibilité

Bonnes pratiques WCAG (niveau AA visé) : contraste, navigation clavier, focus visible, textes alternatifs, labels de formulaires, structure HTML sémantique, compatibilité RTL (y compris icônes directionnelles inversées et contenus mixtes arabe/latin avec `dir="auto"`), respect de `prefers-reduced-motion`.

---

## 19. Design et identité visuelle

Combiner patrimoine marocain, élégance, modernité, narration et découverte. Le design est moderne, premium, lisible, chaleureux, mobile-first — jamais folklorique ni surchargé.

- **Références culturelles avec retenue** : géométrie du zellige, arcs, moucharabieh, textures (tadelakt, bois, cuivre) utilisés comme accents — séparateurs, cadres, états vides — et non comme fond permanent.
- **Palette** inspirée des matières et des villes : bleu profond, vert émeraude, ocre/terre, safran, blanc chaux ; une couleur dominante, les autres en accent ; contrastes conformes à l'AA.
- **Typographie arabe** de qualité : une police de titres de caractère (inspiration du style maghrébin possible pour les grands titres), une police de texte très lisible à l'écran ; interlignage généreux adapté à l'arabe.
- **Lecture immersive** pour les histoires : colonne étroite, grandes images, bandeau indiquant la nature du contenu, sources en fin d'article.
- **Photographie authentique** : lieux et artisans réels, crédités ; pas de banque d'images générique.
- Design System léger : jetons (couleurs, espacements, rayons, typographie, **durées et courbes d'animation**) dans Tailwind, composants réutilisables.

### 19.1 Navigation animée et immersive — « الرحلة »

**Vision** : « حكاية مكان » n'est pas un site classique que l'on fait défiler de haut en bas. Le visiteur fait un **voyage** : il entre dans un lieu, traverse son histoire scène par scène, puis est conduit vers l'étape suivante. C'est le principal facteur d'attraction du produit ; il se conçoit dès la phase 2, pas en finition.

Le voyage tient en trois gestes, identiques sur tout le site :

| Geste | Ce que voit le visiteur |
| --- | --- |
| **1. Entrer — الدخول** | Toucher une carte de lieu ne « charge » pas une page : l'image s'agrandit jusqu'à devenir l'en-tête de la fiche, comme si l'on franchissait une porte (*bab*). Le retour fait le chemin inverse. |
| **2. Parcourir — الحكاية** | L'histoire avance par **scènes**. Le visuel (photo, carte, portrait, frise) reste fixé à l'écran et se transforme pendant que de courts textes se succèdent : la photo zoome sur un détail, la carte se déplace vers le lieu cité, le personnage apparaît, la frise situe l'époque. Un indicateur montre la progression. |
| **3. Poursuivre — المواصلة** | La fin d'une histoire n'est pas un pied de page : elle ouvre sur la suite (personnage, lieu voisin, savoir-faire du territoire), et la transition enchaîne sans rupture. |

#### Compléments

- **Carte vivante** : passer d'un lieu à l'autre déplace la caméra au lieu de recharger la page.
- **Accueil** : une scène d'ouverture plein écran, puis les trois piliers présentés comme trois portes.
- **Motif de zellige** qui se dessine trait par trait dans les séparateurs et les chargements — la signature animée de la marque.
- **Micro-interactions** sobres : apparition des blocs, réaction des cartes au toucher.

#### Responsive — mobile d'abord

Chaque animation est conçue sur téléphone puis enrichie sur grand écran, jamais l'inverse.

| Écran | Mise en scène |
| --- | --- |
| **Mobile** | Visuel fixé en haut, texte qui passe dessous ; une scène ≈ un écran ; zones tactiles larges ; navigation principale en bas, à portée de pouce. |
| **Tablette** | Même logique, visuels plus grands, deux colonnes en paysage. |
| **Desktop** | Visuel fixé d'un côté, texte de l'autre (RTL : texte à droite) ; effets de profondeur plus riches. |

- **Le défilement natif est conservé** : c'est le doigt qui fait avancer les scènes. Pas de défilement détourné ni de balayage imposé, qui déroutent sur mobile.
- Toute progression horizontale va de droite à gauche (RTL).
- Hauteurs en unités d'écran dynamiques (`dvh`) pour les barres de navigateur mobiles ; zones sûres (encoche) respectées.

#### Règles pour rester cohérent avec le reste du plan

- **SEO** : tout le contenu reste dans le HTML rendu côté serveur ; l'animation est une couche par-dessus, jamais une condition pour lire.
- **Performance** : animer uniquement `transform` et `opacity` ; code d'animation chargé en différé ; version allégée automatique sur appareil ou connexion modestes ; le budget du § 17 reste la limite.
- **Accessibilité** : avec `prefers-reduced-motion`, le site redevient une page lisible classique, complète ; clavier et lecteur d'écran préservés dans les scènes.
- **Sobriété** : une animation sert le récit ou l'orientation, sinon elle est retirée. Le back-office n'est pas animé.
- **Réutilisation** : quelques primitives (`PageTransition`, `SharedImage`, `Scene`, `Reveal`, `ZelligeLoader`) dans `components/motion/`, utilisées partout — pas d'animation écrite page par page.
- **Contenu** : une histoire est saisie au back-office comme une suite de scènes (texte court + visuel + type d'effet choisi dans une liste), sans code.

#### Prompts à utiliser pour construire ces pages

Ne pas décrire ces écrans à l'IA avec un prompt improvisé. Deux prompts/skills populaires, adaptés à cette orientation :

| Prompt / skill | Rôle | Usage |
| --- | --- | --- |
| **`frontend-design`** — skill officiel d'Anthropic pour Claude Code | Direction artistique : typographie, couleur, composition et animation distinctives, loin du rendu « générique IA » | Pour chaque écran public (accueil, fiche lieu, histoire, carte). Installation via `/plugin` (marketplace officiel Anthropic — vérifier le nom exact proposé par la commande). |
| **`react-view-transitions`** — skill de Vercel (`vercel-labs/agent-skills`) | Transitions de pages et éléments partagés dans React / Next.js | Pour les gestes « Entrer » et « Poursuivre ». |

En complément, déjà installés : `ui-ux-pro-max` (choix UX, préréglages d'animation), `design-critique` (jugement sur capture réelle, mobile d'abord), `expo-animation` (future application).

Ces skills ne connaissent pas le projet : leur donner à chaque fois le **brief** ci-dessous, conservé dans `docs/prompts/brief-design.md` pour que toutes les pages suivent la même direction.

```text
Projet : « حكاية مكان », plateforme marocaine de découverte du patrimoine.
Langue arabe, RTL, mobile d'abord, responsive tablette et desktop.
Identité : patrimoine marocain moderne et premium, jamais folklorique.
  Zellige, arcs et matières en accents seulement. Palette : bleu profond,
  émeraude, ocre, safran, blanc chaux. Typographie arabe soignée.
Navigation « الرحلة » en trois gestes : Entrer (l'image de la carte devient
  l'en-tête, comme une porte), Parcourir (scènes : visuel fixé qui se
  transforme, textes courts qui défilent), Poursuivre (la fin ouvre la suite).
Contraintes : défilement natif conservé ; contenu complet dans le HTML
  serveur ; animer transform/opacity uniquement ; repli complet avec
  prefers-reduced-motion ; rapide sur smartphone milieu de gamme en 4G.
Stack : Next.js App Router, TypeScript, Tailwind (propriétés logiques),
  primitives de components/motion/.
Écran à produire : <nom de l'écran et son contenu>.
```

---

## 20. Tests, CI/CD et exploitation

### Tests (raisonnables pour un mono-dev)

- **Unitaires** : fonctions critiques (normalisation arabe, slugs, validation, règles de publication).
- **Intégration** : principales API et services contre une base de test.
- **E2E** — deux parcours :

```text
Accueil → recherche → lieu → histoire → destination
Lieu → artisanat → produit
```

- **Manuels**, systématiques : desktop, mobile, RTL, navigateurs principaux (Chrome et Safari mobiles en priorité).
- Pas de couverture artificiellement élevée.

### CI/CD

```text
Git → Pull Request → Lint + typecheck → Tests → Build → Déploiement
```

Environnements : `development` (local), **prévisualisation par Pull Request** (fait office de staging), `production`. Pas d'environnement supplémentaire au MVP.

### Exploitation

- Sauvegardes automatiques quotidiennes de la base, **restauration testée** périodiquement.
- Migrations Prisma appliquées au déploiement ; procédure de retour arrière documentée.

### Gouvernance technique (légère)

Obligatoire : README à jour, courte documentation d'architecture, conventions de code, variables d'environnement documentées (`.env.example`), schéma de base documenté, procédure de déploiement, historique Git propre. Les décisions techniques importantes sont notées brièvement (une page de décisions). Code lisible, faible couplage, pas d'abstraction prématurée.

---

## 21. Feuille de route

Chaque phase livre un résultat fonctionnel et se décompose en : objectif, fonctionnalités, tâches techniques, tâches UI/UX, tests, critères d'acceptation, Definition of Done.

| Phase | Contenu | Résultat |
| --- | --- | --- |
| **1. Fondations** | Projet Next.js, TypeScript strict, Tailwind RTL, i18n `ar`, Prisma + PostgreSQL, logger, CI, déploiement, socle SEO | Une page d'accueil vide en production |
| **2. Design System + UX** | Jetons, typographie arabe, composants de base, gabarits de pages, **primitives d'animation et prototype animé du parcours lieu → histoire** (§ 19.1) | Bibliothèque de composants et navigation animée validées sur mobile |
| **3. Données + back-office minimal** | Schéma complet, auth, CRUD générique, médias, sources, statuts | Le contenu peut être saisi |
| **4. Lieux + histoires** | Pages ville, lieu, histoire ; contenu du territoire pilote | Premier parcours complet |
| **5. Personnages + événements + périodes** | Fiches et liens croisés | Navigation historique complète |
| **6. Destinations + carte** | `Place` de type `NATURE`, carte interactive | Découverte géographique |
| **7. Artisanat + produits** | Savoir-faire, produits, liens au territoire | Trois piliers en ligne |
| **8. Recherche + SEO avancé** | Recherche arabe, données structurées, sitemap complet | Contenu trouvable |
| **9. Qualité** | E2E, accessibilité, performance, pages légales | Prêt à lancer |
| **10. Mise en production** | Sauvegardes, surveillance des logs, lancement du territoire pilote | **MVP public** |
| **11. V1.1** | Fiches professionnelles, contenus sponsorisés | Volet économique |
| **12. V1.2** | Français, anglais | Ouverture internationale |
| **13. V2** | Application React Native, comptes, audio, amazigh | Mobile natif |

Le back-office arrive en phase 3, avant la saisie du contenu ; le SEO est traité dès la phase 1 et finalisé en phase 8.

---

## 22. Restrictions

La plateforme ne doit pas :

- inventer de faits historiques ou de sources, ni présenter une fiction comme un fait ;
- utiliser une image sans droits vérifiés ;
- collecter inutilement des données personnelles ;
- rendre la publicité trompeuse ou cacher un contenu sponsorisé ;
- imposer la géolocalisation ;
- introduire une fonctionnalité ou une technologie complexe sans besoin métier clair.

---

## 23. Décisions retenues

Les recommandations sont appliquées. Chaque décision reste révisable si la condition indiquée se présente.

| # | Sujet | Décision retenue | À revoir si |
| --- | --- | --- | --- |
| 1 | Lieux et destinations | **Un seul modèle `Place`**, distingué par `kind` (`HERITAGE` / `NATURE`) | Les destinations exigent des champs très différents |
| 2 | Comptes | **`ADMIN` et `EDITOR` seulement** au MVP ; pas de compte public | Une fonctionnalité publique l'exige (favoris, V2) |
| 3 | Professionnels | Fiches `Business`, restaurants et hébergements en **V1.1** ; le produit porte le nom et le contact du producteur | Un partenaire veut être présent dès le lancement |
| 4 | Back-office | **CRUD maison générique** piloté par les schémas Zod, avec éditeur de scènes | Son coût dépasse la phase 3 : basculer sur un CMS headless |
| 5 | Lancement | **Une ville pilote**, traitée en profondeur | — |
| 6 | Hébergement | **PaaS Next.js + PostgreSQL managé + stockage objet** | La facture dépasse celle d'un VPS |
| 7 | Carte | **MapLibre** + tuiles dont le rendu des frontières a été vérifié | Aucun fournisseur de tuiles ne convient : Google Maps région `MA` |
| 8 | Fiabilité du contenu | **Un relecteur** (historien, guide ou enseignant) valide les histoires ; sinon publication en `UNVERIFIED` avec mention | — |
| 9 | Immersion | **Navigation « الرحلة »** (§ 19.1) : transitions de pages + histoires en scènes, défilement natif conservé | Les mesures mobiles sortent du budget du § 17 : alléger les scènes |
| 10 | Modèle économique (V1.1) | **Fiches professionnelles gratuites**, mise en avant payante clairement identifiée | — |

Reste à choisir par le porteur du projet : **le nom de la ville pilote** et **le relecteur**.
