/** Chemins du prototype « الرحلة » (sans préfixe de langue) : route catalogue, hors production. */
export const parcoursPaths = {
  depart: "/catalogue/parcours",
  lieu: (id: string) => `/catalogue/parcours/${id}`,
  histoire: (id: string) => `/catalogue/parcours/${id}/histoire`,
};

/** Nom du visuel partagé (`SharedImage`) d'un lieu : sa carte et l'en-tête de sa fiche. */
export const placeVisual = (id: string) => `parcours-${id}-visual`;
