import { describe, expect, it } from "vitest";
import { render, testIds } from "@/test/render";
import { findPlace, nextPlace, parcoursPlaces } from "./data";
import { ParcoursDepart } from "./depart";
import { ParcoursHistoire } from "./histoire";
import { ParcoursLieu } from "./lieu";

const [premier, second] = parcoursPlaces;

const pages = [
  ["parcours-depart", <ParcoursDepart key="depart" />],
  ...parcoursPlaces.flatMap((place) => [
    ["parcours-lieu", <ParcoursLieu key={`lieu-${place.id}`} place={place} />] as const,
    ["parcours-histoire", <ParcoursHistoire key={`histoire-${place.id}`} place={place} />] as const,
  ]),
] as const;

describe("données du parcours", () => {
  it("chaque lieu a une histoire de quelques scènes, textes marqués « تجريبي »", () => {
    expect(parcoursPlaces.length).toBeGreaterThanOrEqual(2);
    for (const place of parcoursPlaces) {
      expect(findPlace(place.id)).toBe(place);
      expect(place.story.scenes.length).toBeGreaterThanOrEqual(3);
      for (const text of [place.title, place.summary, ...place.story.scenes.map((s) => s.text)]) {
        expect(text).toContain("تجريبي");
      }
    }
    expect(findPlace("inconnu")).toBeUndefined();
  });

  it("la fin d'une histoire ouvre toujours sur un autre lieu (le parcours boucle)", () => {
    expect(nextPlace(premier!.id)).toBe(second);
    expect(nextPlace(parcoursPlaces.at(-1)!.id)).toBe(premier);
  });
});

describe.each(pages)("page %s", (testId, element) => {
  const html = render(element);

  it("a un seul h1, les repères et des data-testid uniques", () => {
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html.match(/<main[ >]/g)).toHaveLength(1);
    const ids = testIds(html);
    expect(ids).toContain(testId);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    expect(html).toContain("تجريبي");
  });
});

describe("histoire du parcours", () => {
  const html = render(<ParcoursHistoire place={premier!} />);
  const total = premier!.story.scenes.length;

  it("contient dans le HTML serveur chaque scène, sa progression et la suite", () => {
    expect(html.match(/class="[^"]*motion-scene(?:\s|")/g)).toHaveLength(total);
    premier!.story.scenes.forEach((scene, index) => {
      expect(html).toContain(scene.text);
      expect(html).toContain(`المشهد ${index + 1} من ${total}`);
    });
    expect(testIds(html)).toContain(`place-card-${second!.id}-link`);
  });
});
