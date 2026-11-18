import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// Utilitaires Tailwind à équivalent logique (ms-/me-/ps-/pe-/start-/end-/text-start…), RTL oblige.
const PHYSICAL_CLASS =
  /(?:^|[\s:\]!"'`])-?(?:m[lr]|p[lr]|left|right|scroll-m[lr]|scroll-p[lr]|border-[lr]|rounded-(?:[lr]|t[lr]|b[lr])|text-(?:left|right)|float-(?:left|right)|clear-(?:left|right))(?:-|$|[\s"'`!])/
    .source;
const physicalClassMessage =
  "Classe Tailwind directionnelle interdite : utiliser l'équivalent logique (ms-, me-, ps-, pe-, start-, end-, text-start…).";
const tailwindContexts = [
  "JSXAttribute[name.name=/^(className|class)$/]",
  "CallExpression[callee.name=/^(clsx|cn|cva|twMerge)$/]",
];

const formatterMessage =
  "Nombres et dates : utiliser @/shared/i18n/format (ar-MA, chiffres occidentaux imposés).";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Placé avant le bloc `shared/`, qui remplace cette règle pour ses fichiers.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next-intl", importNames: ["useFormatter"], message: formatterMessage },
            { name: "next-intl/server", importNames: ["getFormatter"], message: formatterMessage },
          ],
        },
      ],
    },
  },
  {
    // `shared/` reste du TypeScript pur : il deviendra `packages/shared` pour le mobile (§ 13).
    files: ["src/shared/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next", message: "shared/ ne dépend pas de Next.js." },
            { name: "react", message: "shared/ ne dépend pas de React." },
            { name: "react-dom", message: "shared/ ne dépend pas de React." },
            { name: "server-only", message: "shared/ est aussi consommé hors serveur." },
          ],
          patterns: [
            {
              group: ["next/*", "react/*", "react-dom/*"],
              message: "shared/ ne dépend ni de Next.js ni de React.",
            },
            {
              group: ["next-intl", "next-intl/*"],
              message: "shared/ ne dépend pas de next-intl.",
            },
            {
              group: ["@prisma/*", ".prisma/*", "prisma", "prisma/*"],
              message: "shared/ ne dépend pas de Prisma.",
            },
          ],
        },
      ],
      // Couvre les alias (`@/server/x`) et les chemins relatifs (`../server/x`).
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared",
              from: "./src",
              except: ["./shared"],
              message: "shared/ n'importe que depuis shared/.",
            },
          ],
        },
      ],
    },
  },
  {
    // Le RTL est la référence : aucune classe directionnelle physique (plan T2).
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...tailwindContexts.flatMap((ctx) =>
          [
            `Literal[value=/${PHYSICAL_CLASS}/]`,
            `TemplateElement[value.raw=/${PHYSICAL_CLASS}/]`,
          ].map((node) => ({ selector: `${ctx} ${node}`, message: physicalClassMessage })),
        ),
      ],
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/server/db/generated/**"]),
]);

export default eslintConfig;
