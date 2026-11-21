# Polices (T3)

Choix : **Noto Kufi Arabic 700** pour les titres, **Noto Sans Arabic 400 et 700** pour le texte. Licence SIL Open Font License 1.1 (sans nom de police réservé), auto-hébergées, sous-ensemblées. Décision : `docs/decisions.md`.

## Poids

Trois fichiers woff2 dans `src/styles/fonts/`, **94,2 Kio au total** (budget testé : 100 Kio, `src/styles/fonts.test.ts`).

| Fichier                      | Usage          | Octets |
| ---------------------------- | -------------- | ------ |
| `noto-kufi-arabic-700.woff2` | titres         | 29 468 |
| `noto-sans-arabic-400.woff2` | texte          | 33 132 |
| `noto-sans-arabic-700.woff2` | texte, emphase | 33 892 |

## Comparaison

Mesures du 2026-11-21 sur les fichiers de `github.com/google/fonts` (commit `06bfe0d6`), tous sous OFL. « Bloc arabe » = points de code assignés de U+0600–06FF couverts. Les chiffres occidentaux et les lettres latines sont présents dans toutes les polices testées. Poids = woff2 sous-ensemblé comme ci-dessous.

| Police               | Rôle testé | Bloc arabe | Lettres du Maroc (ڭ ژ گ چ) et ﷺ | Poids (woff2)      | Décision                                                  |
| -------------------- | ---------- | ---------- | ------------------------------- | ------------------ | --------------------------------------------------------- |
| Noto Sans Arabic     | texte      | 256/256    | toutes                          | 33 Kio par graisse | **retenue**                                               |
| Noto Kufi Arabic     | titres     | 256/256    | toutes                          | 29 Kio (700)       | **retenue**                                               |
| IBM Plex Sans Arabic | texte      | 252/256    | toutes                          | 37 Kio par graisse | écartée : nom réservé « Plex », renommage obligatoire     |
| Noto Naskh Arabic    | texte      | 256/256    | toutes                          | 66 Kio (variable)  | écartée : naskh, un sans-serif est plus net sur téléphone |
| Amiri                | titres     | 255/256    | toutes                          | 111 Kio (700)      | écartée : quatre fois plus lourde                         |
| Cairo                | texte      | 102/256    | ڭ et ﷺ absents                  | 112 Kio (variable) | écartée : couverture et poids                             |
| El Messiri           | titres     | 101/256    | ڭ, ﷲ, ﷺ absents                 | 41 Kio (variable)  | écartée : couverture                                      |
| Reem Kufi            | titres     | 118/256    | ڭ et ﷲ absents                  | 29 Kio (variable)  | écartée : couverture, ج et ب se confondent à 30 px        |
| Tajawal              | texte      | 67/256     | ژ گ چ ڭ absents                 | 17 Kio par graisse | écartée : couverture                                      |
| Readex Pro           | texte      | 73/256     | ژ گ چ ڭ absents                 | 80 Kio (variable)  | écartée : couverture                                      |

Rendu jugé sur capture à 390 px (titres 30 px, texte 17 px, interligne 1,9) : paire Noto Kufi + Noto Sans la plus homogène, texte net en 400 comme en 700, titre sobre et géométrique, sans caractère folklorique.

## Source et licence

| Fichier source (TTF, `google/fonts` `ofl/…`)   | SHA-256                                                            | Source amont                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `notokufiarabic/NotoKufiArabic[wght].ttf`      | `494f6b61469d7a02a2d63f0fc4930bb007388d8cfe551de5eb98354e100889f3` | `github.com/notofonts/arabic`, commit `652edd9688496f88c4cf41706c892fe10f9f3c92` |
| `notosansarabic/NotoSansArabic[wdth,wght].ttf` | `63111b5b2e074dd48cc67692e0a2726d86ee94c1c37fe8598257b7b4e87e869e` | `github.com/notofonts/arabic`, commit `6c8320740db19efbb3127c3697b0ee5d0fa62319` |

Copyright « The Noto Project Authors », OFL 1.1, aucun nom de police réservé : le sous-ensemble peut garder son nom. Les textes de licence sont à côté des fichiers (`OFL-NotoKufiArabic.txt`, `OFL-NotoSansArabic.txt`) : les conserver à chaque redistribution.

## Régénérer les fichiers

Outils : `pip install fonttools brotli` (hors projet, aucune dépendance ajoutée). Jeu de caractères : arabe (U+0600–06FF), latin de base et Latin-1, œ, espaces et ponctuation typographiques, ﷲ ﷺ.

```bash
UNI="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0600-06FF,U+200B-200F,U+2010-2015,U+2018-201E,U+2022,U+2026,U+2039-203A,U+2212,U+25CC,U+FDF2,U+FDFA-FDFB"

# Instances statiques des polices variables (axe de chasse à 100 pour Noto Sans Arabic)
python -m fontTools.varLib.instancer "NotoKufiArabic[wght].ttf" wght=700 -o kufi-700.ttf
python -m fontTools.varLib.instancer "NotoSansArabic[wdth,wght].ttf" wght=400 wdth=100 -o sans-400.ttf
python -m fontTools.varLib.instancer "NotoSansArabic[wdth,wght].ttf" wght=700 wdth=100 -o sans-700.ttf

# Sous-ensemble woff2
pyftsubset kufi-700.ttf --unicodes="$UNI" --flavor=woff2 --layout-features='*' --no-hinting --desubroutinize --output-file=noto-kufi-arabic-700.woff2
pyftsubset sans-400.ttf --unicodes="$UNI" --flavor=woff2 --layout-features='*' --no-hinting --desubroutinize --output-file=noto-sans-arabic-400.woff2
pyftsubset sans-700.ttf --unicodes="$UNI" --flavor=woff2 --layout-features='*' --no-hinting --desubroutinize --output-file=noto-sans-arabic-700.woff2
```

Un caractère hors de ce jeu s'affiche dans la police système : l'ajouter à `UNI`, régénérer, puis relancer `pnpm test` (budget de poids).

## Chargement

- `next/font/local` (doc : `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`) : fichiers copiés dans `/_next/static/media/`, servis par le site ; aucune requête vers un domaine tiers (E2E `e2e/polices.spec.ts`).
- `font-display: swap` : jamais de texte invisible. Les trois fichiers sont préchargés (`<link rel="preload">`) : `preload` est un réglage par appel, donc la graisse 700 du texte l'est aussi.
- Repli : `system-ui`, `sans-serif`, avec la police de repli métrique générée par Next (Arial). Arial n'a pas de glyphes arabes : l'ajustement ne couvre que le latin.
- Jetons Tailwind : `font-texte`, `font-titre`, échelle `text-xs` à `text-3xl` (interlignes inclus), graisses `font-normal` (400) et `font-bold` (700) seulement, aucun espacement de lettres (il casse la liaison des lettres arabes). `h1`–`h4` prennent `font-titre` et `text-wrap: balance`.

## Décalage de mise en page (CLS)

Mesuré le 2026-11-21 sur un gabarit jetable (titre, sous-titre, 8 paragraphes, hors dépôt), Edge, profil Pixel 7, processeur ralenti 4×, cache vide :

| Réseau                      | Fichiers prêts à | CLS   |
| --------------------------- | ---------------- | ----- |
| Sans limitation             | 40 ms            | 0     |
| 4G lente (1,6 Mb/s, 150 ms) | 1,3 s            | 0,096 |

« Bon » = 0,1 ou moins : atteint, mais de justesse au pire cas (le repli arabe du système a d’autres largeurs que Noto Sans Arabic ; seul Windows a été mesuré, Android et iOS ne l’ont pas été). **À revérifier sur le vrai smartphone et sur le catalogue (T11).** Pistes si la valeur dépasse 0,1 : repli métrique dédié par plateforme, ou `font-display: optional` pour le seul texte courant.
