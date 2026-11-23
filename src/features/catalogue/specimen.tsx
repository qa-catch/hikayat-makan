import { useId, type ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import type { Tone } from "@/features/gabarits/demo-data";
import { DemoIllustration } from "./illustrations";

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

/**
 * Visuel factice : une illustration plate dessinée par le projet (`illustrations.tsx`), jamais une
 * photo. Ses détails rendent visibles le zoom et le déplacement d'une scène (`Scene`).
 */
export function DemoVisual({ tone = "bleu" }: { tone?: Tone }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-chaux-sombre">
      <DemoIllustration tone={tone} />
    </div>
  );
}
