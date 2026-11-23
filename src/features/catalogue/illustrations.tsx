/**
 * Illustrations factices (phase 2) : formes plates dessinées par le projet aux couleurs des
 * jetons, sans photo, sans dégradé, sans lieu réel. Auteur : le projet ; licence : celle du
 * dépôt ; source : ce fichier. Repère 400 × 300, recadré au centre (`slice`) : l'essentiel tient
 * entre x = 80 et 320 pour survivre aux visuels hauts du bureau. Coordonnées physiques : une
 * image ne s'inverse pas en RTL.
 */
import type { Tone } from "@/features/gabarits/demo-data";

/** Arc outrepassé (en fer à cheval) : piédroits de `x1` à `x2`, naissance à `y`, base à `base`. */
function horseshoe(x1: number, x2: number, y: number, r: number, base: number) {
  return `M${x1} ${base}V${y}A${r} ${r} 0 1 1 ${x2} ${y}V${base}Z`;
}

/** Étoile à huit branches : deux carrés croisés, accent du zellige. */
function Star({ x, y, r, className }: { x: number; y: number; r: number; className: string }) {
  return (
    <g className={className}>
      <rect x={x - r} y={y - r} width={r * 2} height={r * 2} />
      <rect x={x - r} y={y - r} width={r * 2} height={r * 2} transform={`rotate(45 ${x} ${y})`} />
    </g>
  );
}

/** Lanterne suspendue : fil, chapeau, corps hexagonal ajouré. */
function Lantern({ x, drop }: { x: number; drop: number }) {
  return (
    <g>
      <path d={`M${x} 0V${drop}`} className="stroke-chaux-sombre" strokeWidth={1.5} />
      <path
        d={`M${x - 6} ${drop + 6}L${x} ${drop}L${x + 6} ${drop + 6}Z`}
        className="fill-ocre-clair"
      />
      <path d={`M${x - 10} ${drop + 6}h20l6 14l-6 14h-20l-6 -14Z`} className="fill-safran" />
      <g className="fill-ocre">
        <circle cx={x - 6} cy={drop + 20} r={1.8} />
        <circle cx={x} cy={drop + 20} r={1.8} />
        <circle cx={x + 6} cy={drop + 20} r={1.8} />
      </g>
      <rect x={x - 2} y={drop + 34} width={4} height={6} className="fill-ocre-clair" />
    </g>
  );
}

/** Bleu : une porte de ville la nuit, ouverte sur une lumière (le geste « entrer »). */
function Porte() {
  const merlons = [127, 149, 171, 193, 215, 237, 259];
  return (
    <>
      <rect width={400} height={300} className="fill-bleu-profond" />
      {(
        [
          [60, 40, 3],
          [110, 70, 2],
          [170, 30, 2.5],
          [240, 46, 2],
          [356, 112, 2.5],
          [30, 112, 2],
          [372, 30, 2],
        ] as const
      ).map(([x, y, r]) => (
        <Star key={`${x}-${y}`} x={x} y={y} r={r} className="fill-chaux" />
      ))}
      <circle cx={296} cy={42} r={20} className="fill-safran" />
      <circle cx={305} cy={35} r={17} className="fill-bleu-profond" />
      <path
        d="M0 300V205H28V180H70V198H96V160H125V300ZM275 300V170H305V195H335V175H372V210H400V300Z"
        className="fill-bleu"
      />
      <g className="fill-safran-clair">
        <rect x={42} y={192} width={6} height={9} rx={3} />
        <rect x={106} y={174} width={6} height={9} rx={3} />
        <rect x={316} y={186} width={6} height={9} rx={3} />
        <rect x={352} y={188} width={6} height={9} rx={3} />
      </g>
      <rect x={125} y={82} width={150} height={218} className="fill-ocre-clair" />
      {merlons.map((x) => (
        <rect key={x} x={x} y={70} width={14} height={12} className="fill-ocre-clair" />
      ))}
      <rect
        x={140}
        y={92}
        width={120}
        height={208}
        className="fill-none stroke-ocre"
        strokeWidth={3}
      />
      <Star x={152} y={104} r={5} className="fill-bleu" />
      <Star x={248} y={104} r={5} className="fill-bleu" />
      <path d={horseshoe(152, 248, 190, 56, 300)} className="fill-ocre" />
      <path d={horseshoe(162, 238, 190, 46, 300)} className="fill-safran" />
      <path d={horseshoe(186, 214, 230, 18, 270)} className="fill-safran-clair" />
      <path d="M162 300H238L214 270H186Z" className="fill-ocre-clair" />
    </>
  );
}

/** Émeraude : un patio, trois arcs, une fontaine, un sol de zellige. */
function Patio() {
  const frieze = Array.from({ length: 20 }, (_, i) => `M${10 + i * 20} 50l6 6l-6 6l-6 -6Z`).join(
    "",
  );
  const tiles = Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 20 }, (_, col) =>
      (row + col) % 2 === 0 ? `M${col * 20} ${232 + row * 20}h20v20h-20Z` : "",
    ).join(""),
  ).join("");
  return (
    <>
      <rect width={400} height={300} className="fill-emeraude" />
      <rect width={400} height={40} className="fill-bleu-clair" />
      <rect y={40} width={400} height={10} className="fill-ocre" />
      <rect y={50} width={400} height={12} className="fill-emeraude-clair" />
      <path d={frieze} className="fill-emeraude" />
      <path d={horseshoe(58, 122, 140, 36, 232)} className="fill-bleu-profond" />
      <path d={horseshoe(160, 240, 140, 45, 232)} className="fill-bleu-profond" />
      <path d={horseshoe(278, 342, 140, 36, 232)} className="fill-bleu-profond" />
      <path d="M90 88V110M310 88V110" className="stroke-safran-clair" strokeWidth={1.5} />
      {[90, 310].map((x) => (
        <path key={x} d={`M${x - 7} 110h14l-3 18h-8Z`} className="fill-safran" />
      ))}
      <rect y={232} width={400} height={68} className="fill-chaux-sombre" />
      <path d={tiles} className="fill-emeraude-clair" />
      <path d="M168 200H232A32 12 0 0 1 168 200Z" className="fill-ocre-clair" />
      <rect x={198} y={172} width={4} height={28} rx={2} className="fill-bleu-clair" />
      <g className="fill-bleu-clair">
        <circle cx={188} cy={182} r={2.5} />
        <circle cx={212} cy={186} r={2.5} />
        <circle cx={182} cy={194} r={2.5} />
        <circle cx={218} cy={196} r={2.5} />
      </g>
      <rect x={192} y={206} width={16} height={28} className="fill-ocre-clair" />
      <rect x={140} y={240} width={120} height={26} rx={4} className="fill-ocre" />
      <rect x={132} y={232} width={136} height={10} rx={5} className="fill-ocre-clair" />
    </>
  );
}

/** Ocre : une ruelle d'artisans, lanternes, tapis et poteries, lumière au fond. */
function Souk() {
  return (
    <>
      <rect width={400} height={300} className="fill-ocre" />
      <path d={horseshoe(142, 258, 150, 64, 300)} className="fill-safran-clair" />
      <path d="M142 150V300L164 270V170ZM258 150V300L236 270V170Z" className="fill-ocre-clair" />
      <path d="M142 300H258L236 270H164Z" className="fill-safran" />
      <path d={horseshoe(164, 236, 170, 40, 270)} className="fill-chaux" />
      <Lantern x={104} drop={44} />
      <Lantern x={200} drop={14} />
      <Lantern x={296} drop={56} />
      <rect x={80} y={120} width={52} height={110} className="fill-bleu" />
      <rect
        x={85}
        y={125}
        width={42}
        height={100}
        className="fill-none stroke-safran-clair"
        strokeWidth={1.5}
      />
      <path
        d="M106 132l9 11l-9 11l-9 -11ZM106 164l9 11l-9 11l-9 -11ZM106 196l9 11l-9 11l-9 -11Z"
        className="fill-safran"
      />
      <rect x={262} y={228} width={100} height={6} className="fill-ocre-clair" />
      <path d="M266 228L282 200L298 228Z" className="fill-emeraude" />
      <circle cx={282} cy={198} r={3} className="fill-emeraude" />
      <path
        d="M306 228V206Q306 196 314 196Q322 196 322 206V228ZM310 188h8v8h-8Z"
        className="fill-bleu"
      />
      <path d="M332 228A10 8 0 0 1 352 228Z" className="fill-safran" />
      <path d="M282 300Q276 262 300 256Q324 262 318 300Z" className="fill-ocre-clair" />
      <path d="M279 278H321" className="stroke-ocre" strokeWidth={3} />
      <path d="M76 300Q72 270 100 266Q128 270 124 300Z" className="fill-safran" />
    </>
  );
}

const scenes = { bleu: Porte, emeraude: Patio, ocre: Souk } as const;

export function DemoIllustration({ tone }: { tone: Tone }) {
  const Scene = scenes[tone];
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 size-full"
      data-illustration={tone}
    >
      <Scene />
    </svg>
  );
}
