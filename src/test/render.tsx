import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import messages from "../../messages/ar.json";

/**
 * Rend un composant en HTML statique avec les messages arabes (comme le serveur le ferait).
 * Sans DOM : les tests lisent le balisage (rôles, libellés, `dir`, `data-testid`).
 */
export function render(element: ReactElement): string {
  return renderToStaticMarkup(
    <NextIntlClientProvider locale="ar" messages={messages}>
      {element}
    </NextIntlClientProvider>,
  );
}

/** Valeurs de `data-testid` d'un balisage, dans l'ordre. */
export function testIds(html: string): string[] {
  return [...html.matchAll(/data-testid="([^"]+)"/g)].map((match) => match[1]!);
}
