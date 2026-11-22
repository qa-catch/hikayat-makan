/** Chemins des gabarits (sans préfixe de langue) : route catalogue, hors production. */
export const gabaritPaths = {
  accueil: "/catalogue/gabarits/accueil",
  lieu: "/catalogue/gabarits/lieu",
  histoire: "/catalogue/gabarits/histoire",
  liste: "/catalogue/gabarits/liste",
} as const;

export type GabaritName = keyof typeof gabaritPaths;
