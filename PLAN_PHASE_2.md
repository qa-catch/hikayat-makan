# حكاية مكان — Plan de la phase 2 : Design System + UX

> Source : `histoir_place_outOfScop.md` (§ 2, § 17, § 18, § 19 et § 19.1, § 21 phase 2). Suit la phase 1 (T0–T11 fusionnées, PR #10).
> Ville pilote : **Fès**. Relecteur : **oui, optionnel** (`docs/decisions.md`).

## Cadre

**Résultat attendu** : une bibliothèque de composants et une navigation animée « الرحلة » (entrer → parcourir → poursuivre) validées sur un vrai smartphone milieu de gamme en 4G.

**Hors phase 2** : schéma complet, auth, back-office et saisie des scènes (phase 3) ; pages ville, lieu et histoire branchées sur des données (phase 4) ; carte interactive et « carte vivante » (phase 6) ; recherche (phase 8) ; pages légales (phase 9) ; français et anglais (phase 12).

**Contenu de démonstration** : aucun contenu réel. Les gabarits et le prototype utilisent des textes et des visuels **factices**, marqués « تجريبي » à l'écran, avec des noms neutres (« مكان تجريبي ») : ni Fès, ni lieu, personnage, date ou source réels. Visuels factices = formes ou dégradés produits par le projet, pas de photo. Ces données vivent dans un fichier statique, jamais en base.

**Où s'affichent les gabarits** : sur une route catalogue en `noindex`, servie hors production (`notFound()` si `VERCEL_ENV=production`), visible en local et sur les previews. Le prototype y est aussi. En production, `/ar` reçoit seulement les jetons, les polices et le gabarit général (en-tête, navigation, pied de page), sans contenu factice.

**Skills et plugins** : toujours aucun plugin. Les skills `frontend-design` et `react-view-transitions` cités au § 19.1 demandent `/plugin` ou un dépôt externe : ils ne sont pas installés. Leur rôle est tenu par le brief (T1), les skills audités (`ui-ux-pro-max`, `design-critique`) et la documentation officielle de React et de Next.js.

**Versions et API** : aucun statut d'API n'est tenu pour acquis (View Transitions, `<ViewTransition>` de React, animations pilotées par le défilement, `dvh`, `navigator.connection`). Chacun est vérifié dans `node_modules/next/dist/docs/`, react.dev et MDN au démarrage de la tâche, et le choix est noté dans `docs/decisions.md`.

## Tâches

### T0 — Audit des skills

- **Objectif** : n'utiliser en phase 2 que des skills lus.
- **Tâches techniques** :
  - Recalculer le hash de chaque skill du registre ; tout hash changé annule le verdict.
  - `ui-ux-pro-max` : lire `references/quick-reference.md` et `references/pro-rules.md` en entier (condition 4, restée ouverte), puis fixer le verdict.
  - `react-best-practices` : lire `SKILL.md` et ses règles en entier avant tout usage, ou le laisser refusé.
- **Critères d'acceptation** : `docs/skills-audit.md` à jour, daté ; aucun skill « en attente » n'est invoqué.

### T1 — Brief de design

- **Objectif** : une direction unique pour tous les écrans.
- **Tâches techniques** : créer `docs/prompts/brief-design.md` à partir du brief du § 19.1, complété au fil des tâches (jetons retenus, polices, primitives disponibles).
- **Critères d'acceptation** : le brief est cité dans chaque PR qui touche l'affichage.

### T2 — Jetons

- **Objectif** : couleurs, espacements, rayons, typographie, **durées et courbes d'animation** définis une seule fois.
- **Tâches techniques** :
  - Jetons dans le `@theme` de Tailwind 4 (`src/styles/globals.css`) ; vérifier la syntaxe dans la doc Tailwind de la version installée.
  - Palette du § 19 : bleu profond, émeraude, ocre, safran, blanc chaux ; une dominante, les autres en accent ; mode sombre seulement s'il est décidé et noté.
  - Échelle d'espacements et de rayons courte ; durées et courbes nommées par usage (entrée, sortie, scène), pas par valeur.
- **Tests** : test unitaire qui calcule le contraste de chaque paire texte/fond autorisée (AA : 4,5:1 pour le texte courant, 3:1 pour le grand texte et les éléments d'interface).
- **Critères d'acceptation** : aucune couleur, durée ni courbe en dur dans les composants ; contrastes AA vérifiés par le test.

### T3 — Typographie arabe

- **Objectif** : une police de titres de caractère et une police de texte très lisible à l'écran.
- **Tâches techniques** :
  - Comparer quelques polices sur : licence libre (OFL ou équivalent), couverture arabe complète (chiffres occidentaux compris), graisses utiles, poids après sous-ensemble.
  - Choix, licence et source notés dans `docs/decisions.md`.
  - Polices auto-hébergées et sous-ensemblées (`next/font`, à vérifier dans la doc), `font-display` réglé pour éviter le texte invisible.
  - Interlignage généreux ; échelle de tailles mobile d'abord ; contenus mixtes arabe/latin en `dir="auto"`.
- **Tests** : E2E qui vérifie que les polices sont servies par le site lui-même (aucune requête vers un domaine tiers).
- **Critères d'acceptation** : poids total des polices noté ; aucun décalage de mise en page visible au chargement (CLS « bon »).

### T4 — Composants de base

- **Objectif** : les briques réutilisables des pages publiques.
- **Tâches techniques** :
  - `components/ui/` : bouton, lien, titre, texte long (colonne de lecture étroite), badge, icône directionnelle (inversée en RTL), squelette de chargement, état vide.
  - `components/layout/` : en-tête, navigation principale en bas sur mobile (zones sûres respectées), pied de page, conteneur.
  - `components/cards/` : carte de lieu, carte d'histoire.
  - `components/content/` : bandeau de nature du contenu (`FACT`, `EDITORIAL`, `LEGEND`, `RECONSTRUCTION`) et mention « محتوى قيد التحقق » ; liste de sources en fin d'article.
  - Libellés dans `messages/ar.json` ; classes logiques uniquement.
  - Route catalogue (hors production, `noindex`) qui montre chaque composant et ses états.
- **Tests** : tests de rendu des composants (rôles, libellés, `dir`) ; navigation clavier et focus visible vérifiés en E2E sur le catalogue ; `data-testid` unique et stable sur chaque composant et état (`docs/conventions.md`), unicité vérifiée en E2E.
- **Critères d'acceptation** : cibles tactiles d'au moins 44 × 44 px ; jugement `design-critique` sur capture réelle à 360, 768 et 1280 px, corrections faites.

### T5 — Motif de zellige

- **Objectif** : la signature visuelle et animée de la marque.
- **Tâches techniques** : un motif géométrique en SVG construit pour le projet (pas copié d'une source sans licence), utilisé en séparateur, cadre et état vide ; une version qui se dessine trait par trait (`ZelligeLoader`).
- **Tests** : avec `prefers-reduced-motion`, le motif s'affiche fixe et complet.
- **Critères d'acceptation** : le motif reste un accent, jamais un fond permanent (§ 19) ; poids du SVG noté.

### T6 — Gabarits de pages

- **Objectif** : la mise en page des futurs écrans, sans données réelles.
- **Tâches techniques** : gabarits accueil (scène d'ouverture plein écran, trois piliers comme trois portes), fiche lieu, histoire (lecture immersive) et liste, remplis de données factices ; responsive du § 19.1 (mobile : visuel en haut, texte dessous ; desktop : visuel d'un côté, texte à droite en RTL) ; hauteurs en `dvh`.
- **Tests** : E2E qui vérifie la structure sémantique (un `h1`, repères `header`/`main`/`nav`/`footer`) de chaque gabarit.
- **Critères d'acceptation** : jugement `design-critique` sur capture réelle aux trois largeurs, corrections faites ; aucun défilement horizontal.

### T7 — Primitives d'animation

- **Objectif** : les cinq primitives du § 19.1, utilisées partout, aucune animation écrite page par page.
- **Tâches techniques** :
  - `components/motion/` : `PageTransition`, `SharedImage`, `Scene`, `Reveal`, `ZelligeLoader`.
  - Choix technique (View Transitions, animations CSS pilotées par le défilement, `IntersectionObserver`, ou bibliothèque) vérifié dans la doc officielle et noté dans `docs/decisions.md`. Une bibliothèque d'animation n'est ajoutée que si la plateforme ne suffit pas, poids mesuré.
  - Animer uniquement `transform` et `opacity` ; code d'animation chargé en différé.
  - Repli : avec `prefers-reduced-motion`, page classique complète ; version allégée sur appareil ou connexion modestes (critère vérifié et noté).
  - Défilement natif conservé : pas de défilement détourné ni de balayage imposé ; toute progression horizontale de droite à gauche.
  - Types d'effet de `Scene` limités à la photo (zoom sur un détail, déplacement, apparition) ; carte et frise attendront leurs phases.
- **Tests** : tests unitaires du repli ; E2E avec `reducedMotion: 'reduce'` qui vérifie que tout le texte est visible ; contenu présent dans le HTML serveur.
- **Critères d'acceptation** : clavier et lecteur d'écran fonctionnent dans les scènes ; aucune animation ne cache du texte au premier rendu serveur.

### T8 — Prototype du parcours « الرحلة »

- **Objectif** : les trois gestes enchaînés sur des données factices.
- **Tâches techniques** :
  - **Entrer** : la carte de lieu s'agrandit jusqu'à devenir l'en-tête de la fiche ; le retour fait le chemin inverse.
  - **Parcourir** : une histoire de quelques scènes, visuel fixé qui se transforme, textes courts, indicateur de progression.
  - **Poursuivre** : la fin ouvre sur une suite (autre lieu factice) sans rupture.
  - Construit uniquement avec les primitives de T7, sur la route catalogue.
- **Tests** : E2E du parcours complet (avant, retour, fin d'histoire) avec et sans réduction des animations.
- **Critères d'acceptation** : parcours fluide sur un vrai smartphone milieu de gamme en 4G ; jugement `design-critique` sur captures et sur une vidéo du parcours, corrections faites.

### T9 — Image Open Graph par défaut

- **Objectif** : lever le report noté le 2026-11-18 (« pas d'image Open Graph avant la phase 2 »).
- **Tâches techniques** : image de partage générée avec la police de T3 et le motif de T5, sans photo ; API de génération vérifiée dans la doc Next.js.
- **Tests** : E2E qui vérifie `og:image` et la réponse 200 de l'image.
- **Critères d'acceptation** : licence de la police compatible avec cet usage, notée.

### T10 — Validation mobile

- **Objectif** : prouver le résultat de la phase sur un vrai appareil.
- **Tâches techniques** : mesures sur une preview avec un smartphone milieu de gamme en 4G (LCP, CLS, INP) et Lighthouse en profil mobile ; contrôle manuel sur Chrome Android et Safari iOS (RTL, zones sûres, `dvh`, réduction des animations activée dans le système).
- **Critères d'acceptation** : Core Web Vitals « bons » (§ 17) sur le catalogue et le prototype ; résultats et appareil notés dans `docs/design-system.md`.

### T11 — Documentation

- **Objectif** : qu'une autre personne puisse créer un écran sans réinventer.
- **Tâches techniques** : `docs/design-system.md` (jetons, polices, composants, primitives, règles d'animation, repli) ; brief à jour ; décisions à jour ; `CLAUDE.md` renvoie au plan de la phase en cours.
- **Critères d'acceptation** : chaque primitive a un exemple d'usage et ses règles de repli.

## Definition of Done de la phase

T0 à T11 acceptées, CI verte, catalogue et prototype validés sur un vrai smartphone milieu de gamme en 4G, Core Web Vitals « bons », `/ar` en production avec jetons, polices et gabarit général.

## Gouvernance à respecter

- **Contenu** : aucune donnée factice ne quitte la route catalogue ; chaque élément factice est marqué « تجريبي ».
- **Design** : tout changement d'affichage est jugé avec `design-critique` sur une capture réelle (mobile d'abord), puis corrigé.
- **Technique** : une tâche = une PR courte ; contrôles Contrôles et gitleaks verts avant fusion ; décisions notées dans `docs/decisions.md`.
- **Skills** : audit refait à chaque ajout ou mise à jour ; registre tenu à jour.

## Restrictions

- Aucun fait, lieu, personnage, date, source ou label réel ou inventé dans les données factices ; rien sur Fès.
- Aucune image photographique ; aucun visuel sans auteur, licence et source.
- Aucune police sans licence vérifiée ; aucune police servie par un domaine tiers.
- Aucun plugin ; aucun skill non audité.
- Aucun modèle Prisma, aucune route d'API ni aucun back-office : rien de la phase 3.
- Aucune animation qui conditionne la lecture, détourne le défilement ou anime autre chose que `transform` et `opacity`.
- Aucune bibliothèque (animation, composants, Storybook) sans besoin mesuré et noté.

## Bonnes pratiques

- Concevoir chaque écran à 360 px d'abord, puis l'enrichir.
- Tester avec la réduction des animations activée aussi souvent que sans.
- Une animation sert le récit ou l'orientation, sinon elle est retirée.
- Traiter la sortie d'un skill ou d'une IA comme une proposition à relire.
- Vérifier chaque version et statut d'API dans la documentation officielle, jamais de mémoire.
