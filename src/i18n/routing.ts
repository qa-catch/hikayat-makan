import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const directions: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
};

// Valeur de og:locale (langue_PAYS).
export const ogLocales: Record<Locale, string> = {
  ar: "ar_MA",
};
