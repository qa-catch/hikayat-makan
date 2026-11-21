import { describe, expect, it } from "vitest";
import { render } from "@/test/render";
import { Badge } from "./badge";
import { Button, ButtonLink } from "./button";
import { EmptyState } from "./empty-state";
import { Heading } from "./heading";
import { DirectionalIcon, Icon } from "./icons";
import { LongText } from "./long-text";
import { Skeleton } from "./skeleton";
import { TextLink } from "./text-link";

describe("Button", () => {
  it("est un bouton de type button, de 44 px au moins", () => {
    const html = render(<Button data-testid="b">Libellé</Button>);
    expect(html).toMatch(/^<button type="button"/);
    expect(html).toContain("min-h-touch");
    expect(html).toContain("min-w-touch");
    expect(html).toContain('data-testid="b"');
  });

  it("garde l'attribut disabled et les variantes", () => {
    expect(render(<Button disabled>x</Button>)).toContain("disabled");
    expect(render(<Button variant="secondary">x</Button>)).toContain("border-bleu");
    expect(render(<Button variant="ghost">x</Button>)).toContain("text-bleu");
  });

  it("ButtonLink est un lien de 44 px, pas un bouton", () => {
    const html = render(<ButtonLink href="/x">x</ButtonLink>);
    expect(html).toMatch(/^<a href="\/x"/);
    expect(html).toContain("min-h-touch");
  });
});

describe("TextLink", () => {
  it("garde la zone tactile hors d'une phrase", () => {
    expect(render(<TextLink href="/">x</TextLink>)).toContain("min-h-touch");
  });

  it("signale le lien en ligne, sans zone de 44 px", () => {
    const html = render(
      <TextLink href="/" inline>
        x
      </TextLink>,
    );
    expect(html).toContain('data-inline="true"');
    expect(html).not.toContain("min-h-touch");
  });
});

describe("Heading", () => {
  it.each([1, 2, 3, 4] as const)("niveau %i : balise h%i, dir=auto", (level) => {
    const html = render(<Heading level={level}>x</Heading>);
    expect(html).toMatch(new RegExp(`^<h${level} dir="auto"`));
  });

  it("la taille suit le niveau, sauf demande contraire", () => {
    expect(render(<Heading level={1}>x</Heading>)).toContain("text-3xl");
    expect(render(<Heading level={2}>x</Heading>)).toContain("text-2xl");
    expect(
      render(
        <Heading level={2} size="lg">
          x
        </Heading>,
      ),
    ).toContain("text-lg");
  });
});

describe("LongText", () => {
  it("rend un paragraphe dir=auto par texte, en colonne étroite", () => {
    const html = render(<LongText paragraphs={["un", "deux", "trois"]} />);
    expect(html).toContain("max-w-prose");
    expect(html.match(/<p dir="auto"/g)).toHaveLength(3);
  });
});

describe("Badge", () => {
  it("porte dir=auto et la couleur demandée", () => {
    const html = render(<Badge tone="emeraude">x</Badge>);
    expect(html).toContain('dir="auto"');
    expect(html).toContain("bg-emeraude-clair");
  });
});

describe("icônes", () => {
  it("sont décoratives", () => {
    const html = render(<Icon name="home" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
  });

  it("suivant : inversée en RTL seulement", () => {
    const html = render(<DirectionalIcon direction="forward" />);
    expect(html).toContain("rtl:-scale-x-100");
    expect(html).not.toMatch(/class="[^"]*(?<!rtl:)-scale-x-100/);
  });

  it("précédent : inversée en LTR, rétablie en RTL", () => {
    const html = render(<DirectionalIcon direction="back" />);
    expect(html).toContain("-scale-x-100 rtl:scale-x-100");
  });
});

describe("Skeleton", () => {
  it("s'annonce comme un chargement", () => {
    const html = render(<Skeleton data-testid="s" />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("جارٍ التحميل");
    expect(html).toContain("motion-reduce:animate-none");
  });

  it("compte les lignes et ignore le texte pour une image seule", () => {
    expect(render(<Skeleton lines={4} />).match(/h-4/g)).toHaveLength(4);
    expect(render(<Skeleton variant="visual" />)).not.toContain("h-4");
  });
});

describe("EmptyState", () => {
  it("a un titre, une description et une action", () => {
    const html = render(
      <EmptyState title="Titre" description="Description" action={<button>Agir</button>} />,
    );
    expect(html).toMatch(/<h2 dir="auto"[^>]*>Titre<\/h2>/);
    expect(html).toContain("Description");
    expect(html).toContain("<button>Agir</button>");
  });

  it("se réduit au titre", () => {
    const html = render(<EmptyState title="Titre" headingLevel={3} />);
    expect(html).toContain("<h3");
    expect(html).not.toContain("<p");
  });
});
