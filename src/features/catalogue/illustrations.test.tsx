import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { render } from "@/test/render";
import { DemoIllustration } from "./illustrations";

const tones = ["bleu", "emeraude", "ocre"] as const;

describe("DemoIllustration", () => {
  it.each(tones)("%s : SVG décoratif, recadré au centre, sans image externe", (tone) => {
    const html = render(<DemoIllustration tone={tone} />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('preserveAspectRatio="xMidYMid slice"');
    expect(html).toContain(`data-illustration="${tone}"`);
    // Aucune photo ni ressource tierce : formes seules, couleurs des jetons.
    expect(html).not.toMatch(/<image|<img|href=|url\(|#[0-9a-f]{6}/i);
  });

  it("reste léger (balisage gzip)", () => {
    const sizes = tones.map((tone) => gzipSync(render(<DemoIllustration tone={tone} />)).length);
    // Mesuré le 2026-11-22 : 2,7 à 3,1 Kio bruts, 794 o gzip au plus ; plafond avec marge.
    sizes.forEach((size) => expect(size).toBeLessThan(1200));
  });
});
