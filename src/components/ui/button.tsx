import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

// Zone tactile d'au moins 44 px (`touch`). Paires texte/fond vérifiées par src/styles/tokens.test.ts.
const base =
  "inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-md px-5 text-base font-bold";

const variants = {
  primary: "bg-bleu text-white hover:bg-bleu-profond",
  secondary: "border border-bleu bg-white text-bleu hover:bg-bleu-clair hover:text-bleu-profond",
  ghost: "text-bleu hover:bg-bleu-clair hover:text-bleu-profond",
  /** Sur une section nuit : le bleu n'y passe pas, texte nuit sur safran. */
  nuit: "bg-safran text-nuit hover:bg-safran-clair",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClasses(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], "disabled:cursor-not-allowed disabled:opacity-60", className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

/** Bouton d'action (jamais de navigation : utiliser `ButtonLink`). `type="button"` par défaut. */
export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** Lien d'apparence bouton : navigation interne, `href` sans préfixe de langue. */
export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
