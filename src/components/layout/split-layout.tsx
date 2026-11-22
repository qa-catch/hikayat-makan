import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Marge latérale d'une zone pleine largeur sur mobile (zones sûres comprises). */
export const MOBILE_SIDE_PADDING =
  "max-md:px-[max(var(--spacing-gutter),env(safe-area-inset-left),env(safe-area-inset-right))]";

/**
 * Visuel d'un côté, texte de l'autre. Mobile : visuel en haut (pleine largeur, 40 dvh), texte
 * dessous. À partir de la tablette : deux colonnes, visuel fixé pendant que le texte défile ;
 * en RTL le texte (premier dans le DOM) est à droite.
 */
export function SplitLayout({
  testId,
  visual,
  align = "start",
  stickyOnMobile = false,
  className,
  children,
}: {
  testId: string;
  /** Sans visuel, la colonne de texte garde sa largeur et s'aligne avec celle des scènes voisines. */
  visual?: ReactNode;
  /** `center` : texte court centré en hauteur face au visuel. */
  align?: "start" | "center";
  /** Visuel fixé sous l'en-tête aussi sur mobile, le texte passant dessous (`Scene`). */
  stickyOnMobile?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col-reverse md:flex-row md:gap-12 md:px-gutter md:py-section",
        align === "center" ? "md:items-center" : "md:items-start",
        className,
      )}
    >
      <div className={cn("min-w-0 space-y-6 py-section md:flex-1 md:py-0", MOBILE_SIDE_PADDING)}>
        {children}
      </div>
      {visual === undefined ? (
        <div aria-hidden="true" className="hidden md:block md:w-1/2 md:flex-none" />
      ) : (
        <div
          aria-hidden="true"
          data-testid={`${testId}-visual`}
          className={cn(
            "h-[40dvh] max-h-[26rem] min-h-48 w-full overflow-hidden md:sticky md:top-20 md:h-[calc(100dvh_-_7rem)] md:max-h-[40rem] md:w-1/2 md:flex-none md:rounded-lg",
            stickyOnMobile &&
              "max-md:sticky max-md:top-[calc(3.5rem+env(safe-area-inset-top))] max-md:z-10",
          )}
        >
          {visual}
        </div>
      )}
    </div>
  );
}
