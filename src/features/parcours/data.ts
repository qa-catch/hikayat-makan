/**
 * Données factices du parcours « الرحلة » (phase 2) : aucun lieu, personnage, date ni source
 * réels. Chaque texte est marqué « تجريبي » ; fichier statique, jamais en base, importé par la
 * seule route catalogue (hors production).
 */
import type { SceneEffect } from "@/components/motion/scene";
import type { Tone } from "@/features/gabarits/demo-data";
import type { Nature } from "@/shared/content/nature";

export type ParcoursScene = {
  id: string;
  title: string;
  tone: Tone;
  effect: SceneEffect;
  /** Détail visé par le zoom, en % du visuel depuis son coin haut gauche. */
  focus?: { x: number; y: number };
  text: string;
};

export type ParcoursPlace = {
  /** Segment d'URL et suffixe des `data-testid`. */
  id: string;
  title: string;
  category: string;
  summary: string;
  tone: Tone;
  story: { title: string; nature: Nature; minutes: number; scenes: readonly ParcoursScene[] };
};

export const parcoursPlaces: readonly ParcoursPlace[] = [
  {
    id: "lieu-1",
    title: "مكان تجريبي أول",
    category: "نوع تجريبي",
    summary: "ملخص تجريبي للمكان الأول، بلا أي معلومة حقيقية.",
    tone: "emeraude",
    story: {
      title: "حكاية تجريبية أولى",
      nature: "EDITORIAL",
      minutes: 3,
      scenes: [
        {
          id: "1",
          title: "مشهد تجريبي أول",
          tone: "emeraude",
          effect: "appear",
          text: "نص تجريبي قصير يفتح الحكاية، بلا أي واقعة حقيقية.",
        },
        {
          id: "2",
          title: "مشهد تجريبي ثانٍ",
          tone: "bleu",
          effect: "zoom",
          focus: { x: 30, y: 35 },
          text: "نص تجريبي قصير يقترب من تفصيل في الصورة.",
        },
        {
          id: "3",
          title: "مشهد تجريبي ثالث",
          tone: "ocre",
          effect: "pan",
          focus: { x: 40, y: 50 },
          text: "نص تجريبي قصير يختم الحكاية ويمهّد لما بعدها.",
        },
      ],
    },
  },
  {
    id: "lieu-2",
    title: "مكان تجريبي ثانٍ",
    category: "نوع تجريبي",
    summary: "ملخص تجريبي للمكان الثاني، بلا أي معلومة حقيقية.",
    tone: "ocre",
    story: {
      title: "حكاية تجريبية ثانية",
      nature: "LEGEND",
      minutes: 2,
      scenes: [
        {
          id: "1",
          title: "مشهد تجريبي أول",
          tone: "ocre",
          effect: "appear",
          text: "نص تجريبي قصير لرواية وهمية، بلا أي موروث حقيقي.",
        },
        {
          id: "2",
          title: "مشهد تجريبي ثانٍ",
          tone: "emeraude",
          effect: "pan",
          focus: { x: 40, y: 50 },
          text: "نص تجريبي قصير ينقل النظر من اليمين إلى اليسار.",
        },
        {
          id: "3",
          title: "مشهد تجريبي ثالث",
          tone: "bleu",
          effect: "zoom",
          focus: { x: 65, y: 40 },
          text: "نص تجريبي قصير يختم الرواية ويعيد إلى المكان الأول.",
        },
      ],
    },
  },
];

export function findPlace(id: string): ParcoursPlace | undefined {
  return parcoursPlaces.find((place) => place.id === id);
}

/** Lieu suivant (geste « Poursuivre ») : le parcours boucle, la fin ouvre toujours une suite. */
export function nextPlace(id: string): ParcoursPlace {
  const index = parcoursPlaces.findIndex((place) => place.id === id);
  return parcoursPlaces[(index + 1) % parcoursPlaces.length]!;
}
