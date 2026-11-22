/** Chemins des gabarits (sans préfixe de langue) : route catalogue, hors production. */
export const gabaritPaths = {
  accueil: "/catalogue/gabarits/accueil",
  lieu: "/catalogue/gabarits/lieu",
  histoire: "/catalogue/gabarits/histoire",
  liste: "/catalogue/gabarits/liste",
} as const;

/** Nom du visuel partagé (`SharedImage`) entre un lien vers la fiche lieu et son en-tête. */
export const LIEU_VISUAL = "gabarit-lieu-visual";
