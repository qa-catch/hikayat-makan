import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import messages from "../../../messages/ar.json";
import { render, testIds } from "@/test/render";
import { APPLE_ICON_SIZE, AppleIconCard, OG_SIZE, OgCard } from "./cards";

const app = join(__dirname, "..", "..", "app");

/** Largeur et hauteur d'un PNG, lues dans l'en-tête IHDR (octets 16 à 23). */
function pngSize(path: string) {
  const bytes = readFileSync(path);
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), bytes: bytes.length };
}

describe("cartes de partage", () => {
  it("l'image Open Graph porte le nom et la description du site", () => {
    const html = render(<OgCard />);
    expect(testIds(html)).toEqual(["og-card", "brand-mark"]);
    expect(html).toContain(messages.Metadata.title);
    expect(html).toContain(messages.Metadata.description);
    expect(html).toContain(`h-[${OG_SIZE.height}px] w-[${OG_SIZE.width}px]`);
  });

  it("l'icône iOS a la taille attendue", () => {
    expect(render(<AppleIconCard />)).toContain(`size-[${APPLE_ICON_SIZE}px]`);
  });
});

describe("images générées par pnpm og:image", () => {
  it("opengraph-image.png : 1200 × 630, sous la limite de 8 Mo", () => {
    const { bytes, ...size } = pngSize(join(app, "[locale]", "opengraph-image.png"));
    expect(size).toEqual(OG_SIZE);
    expect(bytes).toBeLessThan(8 * 1024 * 1024);
  });

  it("apple-icon.png : 180 × 180", () => {
    const { width, height } = pngSize(join(app, "apple-icon.png"));
    expect({ width, height }).toEqual({ width: APPLE_ICON_SIZE, height: APPLE_ICON_SIZE });
  });

  it("le texte alternatif existe", () => {
    expect(readFileSync(join(app, "[locale]", "opengraph-image.alt.txt"), "utf8").trim()).not.toBe(
      "",
    );
  });
});
