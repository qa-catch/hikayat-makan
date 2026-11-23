// Régénère l'image Open Graph et l'icône iOS depuis /ar/catalogue/partage (T9).
// Capturées par un vrai navigateur : ImageResponse (next/og) ne façonne pas l'arabe (lettres
// isolées, ordre inversé), voir docs/decisions.md. À relancer quand le logo, les jetons ou le
// texte de Metadata changent.
// Prérequis : `pnpm build && pnpm start` (ou `pnpm dev`). Usage : pnpm og:image [URL de base]
// Navigateur : celui de Playwright, ou PW_CHANNEL=msedge.
import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const targets = [
  { testId: "og-card", file: "src/app/[locale]/opengraph-image.png" },
  { testId: "apple-icon-card", file: "src/app/apple-icon.png" },
];

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const response = await page.goto(new URL("/ar/catalogue/partage", base).href);
  if (!response?.ok()) throw new Error(`/ar/catalogue/partage : ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  for (const { testId, file } of targets) {
    await writeFile(file, await page.getByTestId(testId).screenshot({ animations: "disabled" }));
    console.log(file);
  }
} finally {
  await browser.close();
}
