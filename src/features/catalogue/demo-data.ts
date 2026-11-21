/**
 * Données factices du catalogue (phase 2) : aucun lieu, personnage, date ni source réels.
 * Chaque texte est marqué « تجريبي » et vit ici, dans un fichier statique, jamais en base.
 * Ce fichier n'est importé que par la route catalogue (hors production).
 */
import type { Source } from "@/components/content/source-list";
import type { Nature } from "@/shared/content/nature";

export const demoPlaces = [
  {
    id: "demo-1",
    title: "مكان تجريبي 1",
    summary: "نص تجريبي قصير يصف المكان. لا يدل على أي مكان حقيقي.",
    category: "نوع تجريبي",
  },
  {
    id: "demo-2",
    // Titre mêlant arabe et latin : vérifie `dir="auto"`.
    title: "مكان تجريبي (Demo 2)",
    summary: "نص تجريبي ثانٍ، أطول قليلًا، ليظهر كيف يلتف الملخص على أكثر من سطر داخل البطاقة.",
    category: "نوع تجريبي",
  },
] as const;

export const demoStories: readonly {
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
    id: "demo-editorial",
    title: "حكاية تجريبية 2",
    summary: "ملخص تجريبي لسرد تحريري، بلا أي واقعة حقيقية.",
    nature: "EDITORIAL",
    minutes: 6,
  },
  {
    id: "demo-legend",
    title: "حكاية تجريبية 3",
    summary: "ملخص تجريبي لرواية شعبية، بلا أي موروث حقيقي.",
    nature: "LEGEND",
    minutes: 3,
  },
  {
    id: "demo-reconstruction",
    title: "حكاية تجريبية 4",
    summary: "ملخص تجريبي لإعادة تمثيل، بلا أي مشهد حقيقي.",
    nature: "RECONSTRUCTION",
    minutes: 8,
  },
];

export const demoParagraphs: readonly string[] = [
  "هذا نص تجريبي لعرض عمود القراءة الضيق. لا يحتوي على أي معلومة حقيقية، ويُستعمل لقياس طول السطر وتباعد الأسطر على الهاتف واللوحة والحاسوب.",
  "فقرة تجريبية ثانية بالطول نفسه تقريبًا، لتظهر المسافة بين الفقرات وانتظام الإيقاع البصري عند القراءة الطويلة.",
];

export const demoLatinParagraphs: readonly string[] = [
  "Demo paragraph in Latin script: it must align to the start of its own direction (dir=auto).",
];

export const demoSources: readonly Source[] = [
  { id: "demo-1", title: "مصدر تجريبي 1", detail: "تفاصيل تجريبية: المؤلف والتاريخ." },
  // Domaine réservé à la documentation (RFC 2606) : aucun site réel.
  { id: "demo-2", title: "مصدر تجريبي 2 (Demo source)", href: "https://example.com/" },
];
