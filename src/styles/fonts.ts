import localFont from "next/font/local";

/*
 * Polices auto-hébergées (T3) : fichiers woff2 sous-ensemblés dans ./fonts, servis par le site
 * lui-même (aucune requête vers un domaine tiers). Choix, licence et poids : docs/decisions.md
 * et docs/polices.md. Les variables CSS sont reliées aux jetons `font-texte` / `font-titre`
 * dans globals.css.
 *
 * `display: swap` : jamais de texte invisible ; le texte s'affiche tout de suite dans la police
 * système, puis bascule. Les fichiers sont préchargés pour que la bascule soit rare.
 * Les options doivent être des littéraux : next/font les lit à la compilation.
 */
/** Texte courant : Noto Sans Arabic, graisses 400 et 700. */
export const texte = localFont({
  src: [
    { path: "./fonts/noto-sans-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/noto-sans-arabic-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--police-texte",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/** Titres : Noto Kufi Arabic, graisse 700 seule. */
export const titre = localFont({
  src: [{ path: "./fonts/noto-kufi-arabic-700.woff2", weight: "700", style: "normal" }],
  variable: "--police-titre",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
