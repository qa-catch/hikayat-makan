/**
 * Données factices des gabarits (phase 2) : aucun lieu, personnage, date ni source réels.
 * Chaque texte est marqué « تجريبي » ; fichier statique, jamais en base, importé par la seule
 * route catalogue (hors production).
 */
import type { SceneEffect } from "@/components/motion/scene";
import type { Nature } from "@/shared/content/nature";
import { gabaritPaths } from "./paths";

export type Tone = "bleu" | "emeraude" | "ocre";

export const demoHero = {
  title: "عنوان تجريبي لمشهد الافتتاح",
  text: "نص تجريبي قصير يمهّد للرحلة، بلا أي معلومة حقيقية.",
} as const;

/** Les trois piliers du produit (histoire, tourisme, artisanat), présentés comme trois portes. */
export const demoDoors: readonly {
  id: string;
  title: string;
  text: string;
  href: string;
  tone: Tone;
}[] = [
  {
    id: "stories",
    title: "الحكايات",
    text: "وصف تجريبي قصير للبوابة الأولى.",
    href: gabaritPaths.histoire,
    tone: "bleu",
  },
  {
    id: "discover",
    title: "الاكتشاف",
    text: "وصف تجريبي قصير للبوابة الثانية.",
    href: gabaritPaths.lieu,
    tone: "emeraude",
  },
  {
    id: "crafts",
    title: "الحِرَف",
    text: "وصف تجريبي قصير للبوابة الثالثة.",
    href: gabaritPaths.liste,
    tone: "ocre",
  },
];

export const demoPlace = {
  id: "demo-lieu",
  title: "مكان تجريبي",
  category: "نوع تجريبي",
  summary: "ملخص تجريبي للمكان، بلا أي معلومة حقيقية. يظهر هنا في رأس الصفحة تحت العنوان.",
  paragraphs: [
    "هذا نص تجريبي يملأ قسم النبذة في صفحة المكان. لا يحتوي على أي معلومة حقيقية، ويُستعمل لقياس عمود القراءة وتباعد الأسطر.",
    "فقرة تجريبية ثانية بالطول نفسه تقريبًا، لتظهر المسافة بين الفقرات والإيقاع البصري على الهاتف واللوحة والحاسوب.",
  ],
} as const;

export const demoStory: {
  id: string;
  title: string;
  nature: Nature;
  minutes: number;
  scenes: readonly {
    id: string;
    title: string;
    tone: Tone;
    /** Effet de la scène (`Scene`) ; `focus` : détail visé par le zoom, en % du visuel. */
    effect: SceneEffect;
    focus?: { x: number; y: number };
    paragraphs: readonly string[];
  }[];
} = {
  id: "demo-histoire",
  title: "حكاية تجريبية",
  nature: "EDITORIAL",
  minutes: 5,
  scenes: [
    {
      id: "1",
      title: "مشهد تجريبي أول",
      tone: "bleu",
      effect: "appear",
      paragraphs: ["نص تجريبي قصير للمشهد الأول، بلا أي واقعة حقيقية."],
    },
    {
      id: "2",
      title: "مشهد تجريبي ثانٍ",
      tone: "emeraude",
      effect: "zoom",
      focus: { x: 30, y: 35 },
      paragraphs: [
        "نص تجريبي قصير للمشهد الثاني، بلا أي واقعة حقيقية.",
        "جملة تجريبية أخرى تُظهر كيف تتتابع النصوص القصيرة بجانب الصورة.",
      ],
    },
    {
      id: "3",
      title: "مشهد تجريبي ثالث",
      tone: "ocre",
      effect: "pan",
      paragraphs: ["نص تجريبي قصير للمشهد الثالث، بلا أي واقعة حقيقية."],
    },
  ],
};

export const demoRelatedStories: readonly {
  id: string;
  title: string;
  summary: string;
  nature: Nature;
  minutes: number;
}[] = [
  {
    id: "demo-fact",
    title: "حكاية تجريبية 1",
    summary: "ملخص تجريبي لحكاية، بلا أي واقعة حقيقية.",
    nature: "FACT",
    minutes: 4,
  },
  {
    id: "demo-legend",
    title: "حكاية تجريبية 3",
    summary: "ملخص تجريبي لرواية شعبية، بلا أي موروث حقيقي.",
    nature: "LEGEND",
    minutes: 3,
  },
];

export const demoNextPlace = {
  id: "demo-suivant",
  title: "مكان تجريبي آخر",
  summary: "المكان التالي في الرحلة، بملخص تجريبي قصير.",
  category: "نوع تجريبي",
} as const;

export const demoList: readonly { id: string; title: string; summary: string; category: string }[] =
  [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `demo-${n}`,
    title: n === 2 ? "مكان تجريبي (Demo 2)" : `مكان تجريبي ${n}`,
    summary:
      n % 2 === 0
        ? "نص تجريبي ثانٍ، أطول قليلًا، ليظهر كيف يلتف الملخص على أكثر من سطر داخل البطاقة."
        : "نص تجريبي قصير يصف المكان.",
    category: "نوع تجريبي",
  }));
