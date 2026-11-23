# Brief de design — « حكاية مكان »

Direction unique de tous les écrans publics. Source : `histoir_place_outOfScop.md` § 19 et § 19.1, resserrée par `PLAN_PHASE_2.md`. Complété au fil des tâches de la phase 2 (§ « À compléter »).

## Mode d'emploi

- À donner **en entier** à toute IA ou tout skill qui produit ou juge un écran : le bloc « Brief » ci-dessous, puis l'écran voulu.
- Cité dans chaque PR qui touche l'affichage (case du modèle de PR).
- Skills utilisables : `ui-ux-pro-max` (choix UX, avec les réserves de `docs/skills-audit.md`) et `design-critique` (jugement sur capture réelle, mobile d'abord). `frontend-design` et `react-view-transitions` ne sont pas installés (aucun plugin) : leur rôle est tenu par ce brief et par la documentation officielle de React et de Next.js.
- La sortie d'un skill ou d'une IA reste une proposition à relire.

## Brief

```text
Projet : « حكاية مكان », plateforme marocaine de découverte du patrimoine.
Langue arabe, RTL, mobile d'abord (360 px), responsive tablette et desktop.
Identité : patrimoine marocain moderne et premium, jamais folklorique.
  Zellige, arcs et matières en accents seulement (séparateurs, cadres,
  états vides), jamais en fond permanent. Palette : bleu cobalt dominant,
  émeraude, ocre, safran en accent, fond blanc chaux ; des sections pleine
  largeur en nuit (accueil, récit), sans mode sombre ; contrastes AA. Typographie arabe soignée : police de titres de caractère,
  police de texte très lisible à l'écran, interlignage généreux.
Navigation « الرحلة » en trois gestes : Entrer (l'image de la carte devient
  l'en-tête, comme une porte), Parcourir (scènes : visuel fixé qui se
  transforme, textes courts qui défilent), Poursuivre (la fin ouvre la suite).
Contraintes : défilement natif conservé ; contenu complet dans le HTML
  serveur ; animer transform et opacity uniquement ; repli complet avec
  prefers-reduced-motion ; version allégée sur appareil ou connexion
  modestes ; rapide sur smartphone milieu de gamme en 4G.
Stack : Next.js 16 App Router, TypeScript, Tailwind 4 (propriétés logiques
  uniquement : ms-, pe-, start-, text-start), primitives de
  components/motion/.
Données : aucune donnée réelle en phase 2. Textes et visuels factices,
  marqués « تجريبي », noms neutres (« مكان تجريبي »), formes ou dégradés
  produits par le projet, pas de photo.
Écran à produire : <nom de l'écran et son contenu>.
```

## Règles de composition

- **Lecture immersive** (histoires) : colonne étroite, grandes images, bandeau indiquant la nature du contenu (`FACT`, `EDITORIAL`, `LEGEND`, `RECONSTRUCTION`), sources en fin d'article.
- **Mobile** : visuel fixé en haut, texte dessous, une scène ≈ un écran, zones tactiles d'au moins 44 × 44 px, navigation principale en bas à portée de pouce. **Tablette** : même logique, visuels plus grands, deux colonnes en paysage. **Desktop** : visuel d'un côté, texte de l'autre (RTL : texte à droite), profondeur plus riche.
- Hauteurs en `dvh` ; zones sûres (encoche) respectées.
- Toute progression horizontale va de droite à gauche. Icônes directionnelles inversées en RTL ; contenus mixtes arabe/latin en `dir="auto"`.
- Une animation sert le récit ou l'orientation, sinon elle est retirée. Le back-office n'est pas animé.
- Aucune chaîne en dur : `messages/ar.json`. Dates, nombres, monnaie : `@/shared/i18n/format`.
- `data-testid` unique et stable sur chaque élément interactif ou structurant (règle et format : `docs/conventions.md`), pour les tests et pour un futur automate de rédaction.

## Règles d'animation

- `transform` et `opacity` seulement ; code d'animation chargé en différé.
- Aucune animation ne conditionne la lecture ni ne cache du texte au premier rendu serveur ; aucun défilement détourné ni balayage imposé.
- `prefers-reduced-motion` : page classique complète, testée aussi souvent que sans.
- Cinq primitives, utilisées partout, aucune animation écrite page par page : `PageTransition`, `SharedImage`, `Scene`, `Reveal`, `ZelligeLoader` (`components/motion/`).

## Restrictions

- Aucun fait, lieu, personnage, date ou source réels ou inventés ; rien sur Fès.
- Aucune photographie ; aucun visuel sans auteur, licence et source.
- Aucune police sans licence vérifiée ni servie par un domaine tiers.
- Aucune bibliothèque (animation, composants, Storybook) sans besoin mesuré et noté dans `docs/decisions.md`.
- Aucune donnée factice hors de la route catalogue (`noindex`, hors production).

## À compléter

Chaque tâche remplit sa ligne en fin de PR. Rien n'est supposé avant la tâche.

| Rubrique                                   | Tâche | État              |
| ------------------------------------------ | ----- | ----------------- |
| Jetons retenus (couleurs, durées, courbes) | T2    | fait (ci-dessous) |
| Polices retenues (titres, texte)           | T3    | fait (ci-dessous) |
| Composants disponibles                     | T4    | fait (ci-dessous) |
| Motif de zellige                           | T5    | fait (ci-dessous) |
| Gabarits de pages                          | T6    | fait (ci-dessous) |
| Primitives d'animation et leur repli       | T7    | fait (ci-dessous) |
| Prototype du parcours « الرحلة »           | T8    | fait (ci-dessous) |

### Jetons retenus (T2)

Source unique : `@theme` de `src/styles/globals.css`. Les couleurs, rayons et courbes par défaut de Tailwind sont retirés : seuls ces jetons existent. Contrastes AA vérifiés par `src/styles/tokens.test.ts` ; toute nouvelle paire texte/fond s'ajoute à la liste du test.

- **Couleurs** : dominante `bleu` (cobalt depuis la refonte ; `bleu-profond`, `bleu-clair`) ; accents `emeraude`, `ocre`, `safran` (chacun avec sa variante `-clair`) ; fonds `chaux`, `chaux-sombre` ; sections `nuit`, `nuit-claire` ; texte `encre`, `encre-douce`, et sur nuit `chaux`, `chaux-douce` ; état `erreur`. Safran : fond ou élément d'interface seulement, jamais en texte sur fond clair.
- **Rayons** : `sm`, `md`, `lg`, `full`.
- **Espacements** : base 4 px de Tailwind (`p-4`…) et trois jetons nommés : `gutter` (1 rem), `section` (3 rem), `touch` (2,75 rem = zone tactile 44 px, `min-h-touch`).
- **Durées** : `duration-enter` (240 ms), `duration-exit` (160 ms), `duration-scene` (600 ms).
- **Courbes** : `ease-enter`, `ease-exit`, `ease-scene`.
- **Mode sombre** : aucun (non décidé).

### Polices retenues (T3)

Détail, licence, source et mesures : `docs/polices.md`. Auto-hébergées, 94 Kio au total, `font-display: swap`.

- **Titres** : Noto Kufi Arabic 700, jeton `font-titre` ; `h1`–`h4` l’appliquent d’office, avec `text-wrap: balance`.
- **Texte** : Noto Sans Arabic 400 et 700, jeton `font-texte` (par défaut sur `body`).
- **Échelle** (mobile d’abord, interlignes inclus) : `text-xs` 13 px, `text-sm` 15 px, `text-base` 17 px (interligne 1,9), `text-lg` 20 px, `text-xl` 24 px, `text-2xl` 30 → 36 px, `text-3xl` 36 → 48 px (fluides).
- **Interdits** : autre graisse que 400/700, espacement de lettres ; contenus mixtes arabe/latin en `dir="auto"`.

### Composants disponibles (T4)

Catalogue visuel : `/ar/catalogue` (`noindex`, absent en production, données factices de `src/features/catalogue/demo-data.ts`). Tous les composants sont des composants serveur, sauf `NavLink` (lit le chemin courant) ; les libellés viennent de `messages/ar.json`, les données de props. Chaque instance prend un `data-testid` stable (`docs/conventions.md`).

- **`components/ui/`** : `Button` / `ButtonLink` (`primary`, `secondary`, `ghost`), `TextLink` (`inline` seulement au milieu d'une phrase), `Heading` (niveau = structure, `size` = apparence), `LongText` (colonne `max-w-prose`, un `<p dir="auto">` par paragraphe), `Badge` (5 tons), `Icon` et `DirectionalIcon` (`forward` / `back`, inversée en RTL), `Skeleton` (`text`, `visual`, `card`), `EmptyState`.
- **`components/layout/`** : `Header` (lien d'évitement, marque : `BrandMark` de `components/ui/brand-mark.tsx` suivi du nom, navigation à partir de `md`), `BottomNav` (mobile, zone sûre du bas, espaceur inclus, à placer en dernier du `<body>`), `Footer`, `Container` (zones sûres latérales), `NavLink` et `NavItem`.
- **`components/cards/`** : `PlaceCard`, `StoryCard` (un seul lien par carte, étiré sur toute la carte ; focus dessiné sur la carte).
- **`components/content/`** : `NatureBanner` (4 natures), `UnverifiedNotice`, `SourceList`.
- **Règles** : cibles tactiles ≥ 44 px (`min-h-touch`) hors liens en phrase ; focus visible global (`:focus-visible`, 2 px bleu ; `outline-safran` sur fond bleu profond) ; `dir="auto"` sur tout contenu venant des données ; la couleur ne porte jamais seule la nature d'un contenu ; aucune transition de couleur (`transform` et `opacity` seulement).
- **Jeton ajouté** : `--spacing-nav` (3,5 rem, barre du bas). `viewport-fit=cover` dans le layout pour les zones sûres.

### Motif de zellige (T5)

Construit pour le projet, sans source extérieure : deux carrés de même centre, l'un tourné de 45°, forment une étoile à huit branches ; une seconde étoile, tournée de 22,5°, a ses pointes sur l'octogone central de la première ; un cœur plein à huit pointes ferme le médaillon. Coordonnées calculées dans `src/components/zellige/geometry.ts` (repère `-50 -50 100 100`, arrondi au dixième), vérifiées par `zellige.test.tsx`.

- **`components/zellige/`** (serveur, décoratifs, `aria-hidden`) : `ZelligeDivider` (filet, trois étoiles, filet), `ZelligeFrame` (double filet, étoile sur chaque coin du filet intérieur, sans débordement), `ZelligeMedallion` (56 px au moins), `ZelligeStar` (petites tailles). `EmptyState` montre le médaillon par défaut (`visual={null}` pour aucun).
- **`components/motion/ZelligeLoader`** : le médaillon se dessine trait par trait (16 traits, 50 ms d'écart), reste complet, puis s'efface ; boucle de 2,4 s, courbe `ease-scene`. CSS seul, sans JavaScript ; `transform` (échelle de chaque trait) et `opacity` uniquement. `role="status"` et libellé `Ui.loading` pour les lecteurs d'écran. Animation uniquement sous `motion-safe:` : avec `prefers-reduced-motion`, médaillon fixe et complet (test E2E `e2e/zellige.spec.ts`).
- **Couleurs** : traits en `currentColor` (`text-bleu` par défaut pour le médaillon, `text-ocre` pour les étoiles), filets `ocre-clair`, cœur `safran` (décoratif, jamais du texte).
- **Accent seulement** : séparateur, cadre, état vide, chargement. Jamais en fond ni en motif répété sur une surface.
- **`className`** : `cn` ne fusionne pas les classes ; un `className` passé au médaillon, à l'étoile ou au chargement remplace taille et couleur par défaut (donner les deux).
- **Poids** (balisage rendu, brut / gzip) : médaillon 730 o / 339 o ; étoile 292 o / 193 o ; séparateur 1 012 o / 261 o ; cadre (hors contenu) 1 402 o / 291 o ; chargement 4 125 o / 648 o. Plafonds vérifiés par `zellige.test.tsx`.

### Gabarits de pages (T6)

Quatre gabarits sur la route catalogue, `/ar/catalogue/gabarits/<accueil|lieu|histoire|liste>` (`noindex`, 404 en production : vérifié par un build avec `VERCEL_ENV=production`). Données factices de `src/features/gabarits/demo-data.ts`, libellés dans `Gabarits` de `messages/ar.json`. Liens depuis la section « القوالب » du catalogue. Chaque gabarit est un composant serveur de `src/features/gabarits/` qui monte `GabaritPage` (en-tête, `<main>`, pied de page, navigation du bas) ; les pages de la phase 4 reprendront ce cadre avec de vraies données.

- **`accueil`** : scène d'ouverture plein écran (`min-h` en `dvh`, moins l'en-tête et, sur mobile, la barre du bas), puis trois portes (arche `rounded-t-full`, un seul lien étiré par porte) pour les trois piliers. Mobile : visuel en haut, texte dessous ; desktop : texte à droite, visuel à gauche. Visuel : l'illustration « porte » (voir « Illustrations factices »).
- **`lieu`** : en-tête visuel (la future porte de T8), titre, mention « قيد التحقق », نبذة, histoires liées (`StoryCard`), sources.
- **`histoire`** : lecture immersive : bandeau de nature en tête, une scène par écran (visuel et texte court), sources en fin d'article, puis « تابع الرحلة » (la suite). Le visuel fixé qui se transforme viendra des primitives (T7, T8).
- **`liste`** : titre, nombre de résultats, grille de `PlaceCard` (1, 2 puis 3 colonnes).
- **`SplitLayout`** : visuel d'un côté, texte de l'autre. Mobile : visuel en haut (40 dvh, 26 rem au plus), texte dessous. Dès `md` : deux colonnes, visuel fixé (`sticky`) ; le texte est le premier dans le DOM, donc à droite en RTL. Sans visuel, une colonne vide garde la largeur du texte (en-tête et fin d'histoire alignés sur les scènes).
- **Ajouts aux composants** : `Heading` accepte `tone="inverse"` (blanc sur fond bleu profond, bleu, émeraude ou ocre) ; `DemoVisual` a un ton `emeraude`.
- **Jugement `design-critique`** (captures réelles à 360, 768 et 1280 px) : corrigés : visuel d'ouverture trop court sur mobile (la scène dépassait l'écran de 33 px), dégradé ocre des portes boueux (l'ocre tient 45 % avant de virer au bleu profond), en-tête et fin d'histoire désalignés des scènes sur desktop, texte court des scènes calé en haut face à un visuel de 640 px (centré). Restent notés : sur mobile, six cartes de liste empilées font environ 2 000 px (une carte compacte pourra s'ajouter avec les vraies données) ; sur desktop le visuel fixé d'une fiche est surtout parlant avec un texte long.
- **Tests** : `gabarits.test.tsx` (structure, `data-testid` uniques, titres sans saut) ; `e2e/gabarits.spec.ts` (un `h1`, repères, `noindex`, unicité des `data-testid`, aucun défilement horizontal, cibles ≥ 44 px, ordre visuel/texte à 360 et 1280 px, scène d'ouverture et portes).

### Primitives d'animation (T7)

Plateforme seule, aucune bibliothèque (choix et sources : `docs/decisions.md`). Composants de `src/components/motion/`, CSS dans `src/styles/globals.css` (bloc « Primitives d'animation »). Démonstration : section « الحركة » du catalogue et gabarit `histoire`.

- **`PageTransition`** : à placer dans chaque page, en tête de ce que la navigation insère (`GabaritPage` l'enveloppe autour de `<main>` ; placé dans `<main>`, il ne jouait pas, corrigé en T8). Les liens portent `transitionTypes={forwardTransition}` (avancer) ou `backTransition` (revenir) ; sans type (retour du navigateur), pas d'animation. Avancer en RTL : la nouvelle page arrive de la gauche (`--motion-dir`).
- **`SharedImage`** : `name` identique et unique sur chaque page (ex. `LIEU_VISUAL`) ; le visuel se transforme en l'en-tête de la page suivante si celle-ci est préchargée.
- **`Scene`** : `effect` = `zoom` (vers `focus`, en % depuis le coin haut gauche du visuel), `pan` (le regard va de droite à gauche) ou `appear` ; visuel fixé (sous l'en-tête sur mobile, à côté du texte dès `md`) qui se transforme au rythme du défilement natif. Le texte n'est jamais animé.
- **`Reveal`** : fondu et montée à l'entrée dans l'écran ; un bloc déjà visible au chargement l'est tout de suite.
- **`ZelligeLoader`** : inchangé (T5).
- **Repli** : `prefers-reduced-motion` → aucune animation (CSS, même sans JavaScript) ; appareil ou connexion modestes → `data-motion="lite"` : fondus seuls, ni glissement, ni morphose, ni effet de scène ; navigateur sans animations pilotées par le défilement → contenu immobile. Seuil et signaux : `src/shared/motion/level.ts`.
- **Tests** : `src/shared/motion/level.test.ts` (repli), `motion.test.tsx` (contenu complet dans le HTML serveur), `e2e/motion.spec.ts` (texte visible avec `reducedMotion: 'reduce'`, version allégée, défilement natif, clavier, transition de vue).
- **Jugement `design-critique`** (captures réelles à 360, 768 et 1280 px) : corrigé : sur mobile le visuel défilait avec le texte, l'effet passait inaperçu et le brief demandait un visuel fixé (`stickyOnMobile`). Restent notés : à 360 × 640, fenêtre de lecture ≈ 270 px et un écran sans texte entre deux scènes (à juger sur appareil, T10) ; sur desktop, un texte de scène court laisse un grand vide sous lui (déjà noté en T6) ; un lien placé dans le texte d'une scène pourrait, au clavier, défiler sous le visuel fixé (aucun pour l'instant).
- **Ajouts** : `SplitLayout` passe dans `components/layout/` (avec `stickyOnMobile`) ; `DemoVisual` accepte un `detail` (médaillon) ; l'espaceur de `BottomNav` compte la bordure de la barre (1 px).

### Prototype du parcours « الرحلة » (T8)

`/ar/catalogue/parcours` (`noindex`, 404 en production), lien « نموذج الرحلة » dans la section « القوالب » du catalogue. Données factices de `src/features/parcours/data.ts` (deux lieux, une histoire de trois scènes chacun), libellés dans `Parcours` de `messages/ar.json`. Seules les primitives de T7 animent.

- **Entrer** : départ (`ParcoursDepart`, cartes de lieu) → fiche (`ParcoursLieu`) ; la carte et l'en-tête de la fiche portent le même `SharedImage` (`parcours-<id>-visual`), liens `forwardTransition` ; « العودة إلى الأماكن » (`backTransition`) fait le chemin inverse.
- **Parcourir** : « اقرأ «…» » → `ParcoursHistoire` : une `Scene` par écran (`appear`, `zoom`, `pan`) ; en tête de chaque scène, sa place (« المشهد n من N ») et un trait par scène, rempli de droite à gauche, sans animation.
- **Poursuivre** : après les sources, « تابع الرحلة » ouvre sur l'autre lieu (le parcours boucle) ; sa carte partage son visuel avec l'en-tête de la fiche d'arrivée.
- **Tests** : `parcours.test.tsx` (données, structure, HTML serveur complet) ; `e2e/parcours.spec.ts` (parcours complet avant, retour et fin d'histoire, avec et sans réduction des animations ; glissement à chaque lien typé, morphose carte ↔ en-tête ; aucune animation avec `prefers-reduced-motion` ; 404 d'un lieu inconnu).
- **Jugement `design-critique`** (captures réelles à 360, 768 et 1280 px) : continuité réussie (la teinte de la carte devient l'en-tête, puis le visuel de la première scène). Restent notés : à 360 × 740 le bouton « اقرأ » de la fiche tombe sous la ligne de flottaison (avis « قيد التحقق » avant lui) ; traits de progression inactifs pâles (décoratifs, le texte porte l'information). Morphose et glissements : à juger sur appareil (T10), les captures Playwright n'affichant pas la couche des transitions.
- **Validation émulée sur la preview** (2026-11-22, Edge, profil Pixel 7, processeur ralenti 4×, réseau « Slow 4G » de Lighthouse : 150 ms, 1,6 Mb/s) : départ chargé en 292 Kio, LCP 1,3 s, CLS 0, niveau `full` (`effectiveType` 4g). Chaque étape (entrer, ouvrir l'histoire, poursuivre, revenir) affiche son `h1` en 110 à 300 ms, avec glissement, et morphose quand une carte est en jeu ; 57 à 60 images/s, 95ᵉ centile à 17 ms, au plus une image > 50 ms par transition, aucune tâche longue. Défilement des scènes : 60 images/s, aucun texte masqué. Mêmes résultats sans aucune transition avec `prefers-reduced-motion`. Le passage sur un vrai smartphone reste à faire (T10).

### Illustrations factices (hors plan, 2026-11-22)

- **`features/catalogue/illustrations.tsx`** : trois scènes plates dessinées par le projet, une par teinte de `DemoVisual` : `bleu` porte de ville la nuit ouverte sur une lumière (« entrer »), `emeraude` patio (trois arcs, fontaine, sol de zellige), `ocre` ruelle d'artisans (lanternes, tapis, poteries). Aucun lieu réel, aucune photo, aucune couleur hors jetons (`fill-*`, `stroke-*`). Auteur : le projet ; licence : celle du dépôt ; source : ce fichier.
- **Cadrage** : repère 400 × 300 recadré au centre (`slice`) ; l'essentiel tient entre x = 80 et 320 pour les visuels hauts du bureau.
- **`DemoVisual`** perd `detail` : le médaillon posé sur le dégradé ne servait qu'à rendre le zoom visible ; le zoom vise désormais un détail de l'illustration (lumière de la porte, fontaine, étoile).
- **Poids** (balisage rendu) : 2,7 à 3,1 Kio bruts, 794 o gzip au plus (`illustrations.test.tsx`).
- **Jugement `design-critique`** (captures réelles à 360, 768 et 1280 px) : corrigés : croissant coupé sur les visuels hauts, tapis et poteries du souk hors cadre sur le bureau, médaillon superposé qui flottait au hasard sur l'illustration. Reste noté : à 768 px, la colonne visuelle de l'accueil est très haute et étroite, la porte y est vue de près (mise en page de T6).

### Images de partage (T9)

- `src/app/[locale]/opengraph-image.png` (1200 × 630) et `src/app/apple-icon.png` (180 px) : captures de `/ar/catalogue/partage` (`src/features/partage/cards.tsx`) par `pnpm og:image`, serveur lancé. Les régénérer après tout changement du logo, des jetons ou des textes `Metadata`.
- `ImageResponse` (`next/og`) est écarté : il ne façonne pas l'arabe (`docs/decisions.md`).

### Refonte : direction artistique (2026-11-23)

Trois directions comparées sur un canevas (A « ليل الحكاية » nuit cinématique, B « ضوء الجير » lumière éditoriale, C « زليج حيّ » zellige graphique) ; retenu : un mélange. Première étape : les couleurs ; deuxième : les polices ; la mise en page suivra dans sa PR.

- **Fond** : chaux partout ; sections pleine largeur en `nuit` (A) pour l'accueil et le récit. Ce n'est pas un mode sombre : la page reste en `color-scheme: light`.
- **Dominante** : cobalt `#1d3f8f` (C), porté par les jetons `bleu` existants (`bleu-profond` `#142c66`, `bleu-clair` `#dfe6f5`) : aucun composant à renommer.
- **Accents** (portes, chapitres, illustrations) : `emeraude`, `safran` ; sur nuit, `emeraude-nuit` `#45b88f` (A), illisible sur fond clair. `ocre` reste disponible, la terre cuite de B et C n'est pas retenue.
- **Sur nuit** : texte `chaux`, secondaire `chaux-douce` ; surfaces `nuit-claire` ; focus et liens en `safran` (le cobalt n'y atteint que 1,9:1) ; texte `nuit` sur bouton `safran`.
- **Polices** (2e étape) : grands titres (`text-3xl`, `text-2xl`) en Reem Kufi 700 (A), ramenée à l'échelle par `size-adjust` 115 % ; Noto Kufi reste pour les petits titres, la marque et les glyphes absents de Reem Kufi ; texte inchangé (Noto Sans Arabic). Détail : `docs/polices.md`.
