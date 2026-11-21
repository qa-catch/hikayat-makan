import { describe, expect, it } from "vitest";
import { Icon } from "@/components/ui/icons";
import { render, testIds } from "@/test/render";
import { BottomNav } from "./bottom-nav";
import { Container } from "./container";
import { Footer } from "./footer";
import { Header } from "./header";
import { isActive, type NavItem } from "./nav-link";

const items: NavItem[] = [
  { id: "home", href: "/", label: "الرئيسية", icon: <Icon name="home" /> },
  { id: "stories", href: "/catalogue", label: "الحكايات", icon: <Icon name="book" /> },
];

describe("isActive", () => {
  it("l'accueil n'est actif que sur l'accueil", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/catalogue", "/")).toBe(false);
  });

  it("une page est active, ainsi que ses enfants", () => {
    expect(isActive("/catalogue", "/catalogue")).toBe(true);
    expect(isActive("/catalogue/x", "/catalogue")).toBe(true);
    expect(isActive("/catalogues", "/catalogue")).toBe(false);
  });
});

describe("Header", () => {
  const html = render(<Header items={items} />);

  it("est un repère header avec lien d'évitement et marque", () => {
    expect(html).toMatch(/^<header/);
    expect(html).toContain('href="#contenu"');
    expect(html).toContain("انتقل إلى المحتوى");
    expect(html).toContain("حكاية مكان");
  });

  it("porte la navigation principale à partir de la tablette seulement", () => {
    expect(html).toMatch(/<nav aria-label="التنقل الرئيسي"[^>]*class="hidden md:block"/);
    expect(testIds(html)).toEqual(
      expect.arrayContaining(["nav-header-home", "nav-header-stories"]),
    );
  });

  it("marque la page courante (aria-current)", () => {
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-current="page"[^>]*data-testid="nav-header-stories"/);
  });
});

describe("BottomNav", () => {
  const html = render(<BottomNav items={items} />);

  it("est une navigation fixe en bas, réservée au mobile, avec zone sûre", () => {
    expect(html).toMatch(/<nav aria-label="التنقل الرئيسي"/);
    expect(html).toContain("fixed");
    expect(html).toContain("md:hidden");
    expect(html).toContain("pb-[env(safe-area-inset-bottom)]");
  });

  it("réserve la place de la barre en fin de page", () => {
    expect(html).toMatch(/^<div aria-hidden="true" class="h-\[calc\(var\(--spacing-nav\)/);
  });

  it("donne une zone tactile de 44 px à chaque entrée", () => {
    expect(html.match(/min-h-touch min-w-touch/g)).toHaveLength(items.length);
    expect(testIds(html)).toEqual(
      expect.arrayContaining(["nav-bottom", "nav-bottom-home", "nav-bottom-stories"]),
    );
  });
});

describe("Footer", () => {
  it("est un repère footer avec la marque et la phrase de présentation", () => {
    const html = render(<Footer />);
    expect(html).toMatch(/^<footer/);
    expect(html).toContain("حكاية مكان");
    expect(html).toContain("منصة مغربية");
    expect(html).not.toContain("<nav");
  });

  it("liste ses liens dans une navigation étiquetée", () => {
    const html = render(<Footer links={[{ id: "a", href: "/a", label: "Lien" }]} />);
    expect(html).toContain('aria-label="روابط التذييل"');
    expect(testIds(html)).toContain("nav-footer-a");
  });
});

describe("Container", () => {
  it("respecte les zones sûres et peut être un main", () => {
    const html = render(<Container as="main">x</Container>);
    expect(html).toMatch(/^<main/);
    expect(html).toContain("safe-area-inset-left");
    expect(html).toContain("safe-area-inset-right");
  });
});
