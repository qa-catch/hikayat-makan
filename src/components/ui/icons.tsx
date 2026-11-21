import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

type SvgProps = SVGProps<SVGSVGElement>;

/** Base commune : décorative (le libellé est toujours à côté), couleur du texte, trait fin. */
function Svg({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

/** Pictogrammes non directionnels, dessinés pour le projet. */
export const ICON_NAMES = ["home", "map", "search", "book", "pin"] as const;
export type IconName = (typeof ICON_NAMES)[number];

const glyphs: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
};

export function Icon({ name, ...props }: Omit<SvgProps, "children"> & { name: IconName }) {
  return <Svg {...props}>{glyphs[name]}</Svg>;
}

export const DIRECTIONAL_SHAPES = ["chevron", "arrow"] as const;
export type DirectionalShape = (typeof DIRECTIONAL_SHAPES)[number];

const directionalGlyphs: Record<DirectionalShape, ReactNode> = {
  chevron: <path d="m9 5 7 7-7 7" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
};

/**
 * Icône directionnelle : `forward` pointe vers la suite de la lecture (à gauche en RTL),
 * `back` vers ce qui précède (à droite en RTL). Dessinée pour la lecture LTR, inversée en RTL.
 */
export function DirectionalIcon({
  shape = "chevron",
  direction = "forward",
  className,
  ...props
}: SvgProps & { shape?: DirectionalShape; direction?: "forward" | "back" }) {
  return (
    <Svg
      data-direction={direction}
      // « forward » : miroir en RTL. « back » : miroir en LTR, donc aucun miroir en RTL.
      className={cn(
        direction === "forward" ? "rtl:-scale-x-100" : "-scale-x-100 rtl:scale-x-100",
        className,
      )}
      {...props}
    >
      {directionalGlyphs[shape]}
    </Svg>
  );
}
