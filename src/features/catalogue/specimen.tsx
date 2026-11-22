import { useId, type ReactNode } from "react";
import { Heading } from "@/components/ui/heading";

/** Section du catalogue : un composant et tous ses états. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      data-testid={`catalogue-section-${id}`}
      className="space-y-6"
    >
      <Heading level={2} id={headingId} className="border-b border-chaux-sombre pb-2">
        {title}
      </Heading>
      {children}
    </section>
  );
}

/** Un état d'un composant : son nom, puis le composant. */
export function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-encre-douce">{label}</p>
      <div>{children}</div>
    </div>
  );
}

/** Visuel factice : un dégradé produit par le projet, jamais une photo. */
const demoTones = {
  bleu: "bg-linear-to-br from-bleu to-emeraude",
  emeraude: "bg-linear-to-br from-emeraude to-bleu",
  ocre: "bg-linear-to-br from-ocre to-safran",
} as const;

export function DemoVisual({ tone = "bleu" }: { tone?: keyof typeof demoTones }) {
  return <div className={`h-full w-full ${demoTones[tone]}`} />;
}
