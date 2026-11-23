/**
 * Géométrie du motif de zellige (T5), construite pour le projet : aucun tracé copié.
 *
 * Construction (règle et compas) : deux carrés de même centre, l'un tourné de 45°, forment une
 * étoile à huit branches (khatam). Une seconde étoile, tournée de 22,5°, a ses pointes sur les
 * sommets de l'octogone central de la première. Un cœur plein à huit pointes ferme le motif.
 *
 * Repère : `viewBox="-50 -50 100 100"`, centre en 0,0. Coordonnées arrondies au dixième
 * (le poids du SVG compte, voir docs/prompts/brief-design.md).
 */

export type Point = readonly [x: number, y: number];

/** Un trait du motif : de `from` à `to`. */
export type Segment = { from: Point; to: Point };

export const VIEW_BOX = "-50 -50 100 100";

/** Rayon des pointes de l'étoile extérieure (marge pour l'épaisseur du trait). */
const OUTER_RADIUS = 46;

/** Sommets de l'octogone central d'une étoile de deux carrés : rayon × cos 45° / cos 22,5°. */
export const INNER_RATIO = Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);

const round = (value: number) => Math.round(value * 10) / 10 || 0;

function polar(radius: number, degrees: number): Point {
  const angle = (degrees * Math.PI) / 180;
  return [round(radius * Math.cos(angle)), round(radius * Math.sin(angle))];
}

/** Les quatre côtés d'un carré inscrit dans un cercle de `radius`, premier sommet à `startDeg`. */
function squareSides(radius: number, startDeg: number): Segment[] {
  const corners = [0, 1, 2, 3].map((k) => polar(radius, startDeg + k * 90));
  return corners.map((from, k) => ({ from, to: corners[(k + 1) % 4]! }));
}

/** Étoile à huit branches (deux carrés) : huit traits. */
function khatam(radius: number, rotationDeg: number): Segment[] {
  return [...squareSides(radius, rotationDeg), ...squareSides(radius, rotationDeg + 45)];
}

/** Contour d'une étoile à huit branches pleine : seize sommets, pointes à `radius`. */
export function starOutline(
  radius: number,
  rotationDeg: number,
  [cx, cy]: Point = [0, 0],
): Point[] {
  return Array.from({ length: 16 }, (_, k) => {
    const [x, y] = polar(k % 2 === 0 ? radius : radius * INNER_RATIO, rotationDeg + k * 22.5);
    return [round(cx + x), round(cy + y)] as const;
  });
}

const innerRadius = OUTER_RADIUS * INNER_RATIO;

/**
 * Traits du médaillon, dans l'ordre où `ZelligeLoader` les dessine :
 * étoile extérieure (8 traits), puis étoile intérieure tournée de 22,5° (8 traits).
 */
export const MEDALLION_SEGMENTS: readonly Segment[] = [
  ...khatam(OUTER_RADIUS, -90),
  ...khatam(innerRadius, -90 + 22.5),
];

/** Cœur plein du médaillon : inscrit dans l'octogone de l'étoile intérieure. */
export const MEDALLION_HEART: readonly Point[] = starOutline(innerRadius * INNER_RATIO * 0.55, -90);

/** Étoile simple (petite taille : séparateur, coins de cadre), pointes au bord du repère. */
export const SMALL_STAR: readonly Point[] = starOutline(48, -90);

/** Polygone fermé en attribut `d` : `M x y L x y … Z`. */
export function polygonPath(points: readonly Point[]): string {
  return `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
}

/** Traits en un seul attribut `d` (version fixe : un seul élément, plus léger). */
export function segmentsPath(segments: readonly Segment[]): string {
  return segments.map(({ from, to }) => `M${from[0]} ${from[1]}L${to[0]} ${to[1]}`).join("");
}

/** Longueur et angle d'un trait : la version animée le pose à plat puis le tourne. */
export function segmentPose({ from, to }: Segment): { length: number; angle: number } {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  return { length: round(Math.hypot(dx, dy)), angle: round((Math.atan2(dy, dx) * 180) / Math.PI) };
}
