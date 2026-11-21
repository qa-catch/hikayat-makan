import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

const bar = "rounded-sm bg-chaux-sombre";

type SkeletonProps = {
  /** `text` : lignes de texte ; `visual` : image ; `card` : image puis texte. */
  variant?: "text" | "visual" | "card";
  lines?: number;
  className?: string;
  "data-testid"?: string;
};

/**
 * Squelette de chargement. Annoncé une seule fois aux lecteurs d'écran (`role="status"`) ;
 * la pulsation (opacité seule) s'arrête avec `prefers-reduced-motion`.
 */
export function Skeleton({ variant = "text", lines = 3, className, ...props }: SkeletonProps) {
  const t = useTranslations("Ui");
  const pulse = "animate-pulse motion-reduce:animate-none";

  return (
    <div
      role="status"
      aria-busy="true"
      data-variant={variant}
      className={cn(pulse, className)}
      {...props}
    >
      <span className="sr-only">{t("loading")}</span>
      <div aria-hidden="true" className="space-y-3">
        {variant !== "text" && <div className={cn(bar, "aspect-[4/3] w-full rounded-lg")} />}
        {variant !== "visual" &&
          Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              // La dernière ligne est plus courte, comme un vrai paragraphe.
              className={cn(bar, "h-4", index === lines - 1 && lines > 1 ? "w-2/3" : "w-full")}
            />
          ))}
      </div>
    </div>
  );
}
