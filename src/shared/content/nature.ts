/**
 * Nature d'une histoire (§ 4.1 du plan produit) : toujours visible par le lecteur.
 * Aucune fiction n'est présentée comme un fait.
 */
export const NATURES = ["FACT", "EDITORIAL", "LEGEND", "RECONSTRUCTION"] as const;

export type Nature = (typeof NATURES)[number];
