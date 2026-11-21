import { createElement, type ComponentProps } from "react";
import { vi } from "vitest";

// Les composants sont rendus hors de Next : `Link` devient un `<a>` simple et le chemin courant
// est celui du catalogue (voir `usePathname`). Le comportement de next-intl n'est pas à tester ici.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, ...props }: ComponentProps<"a">) => createElement("a", { href, ...props }),
  usePathname: () => "/catalogue",
}));
