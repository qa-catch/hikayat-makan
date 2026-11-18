// Formats affichés : arabe du Maroc, chiffres occidentaux imposés. Le CLDR du moteur ne
// décide pas : certains navigateurs donnent encore des chiffres arabes-indiens pour `ar`.
export const FORMAT_LOCALE = "ar-MA";
export const TIME_ZONE = "Africa/Casablanca";
export const CURRENCY = "MAD";

type NumberOptions = Omit<Intl.NumberFormatOptions, "numberingSystem">;
type DateOptions = Omit<Intl.DateTimeFormatOptions, "numberingSystem" | "timeZone">;

export function numberFormatter(options: NumberOptions = {}): Intl.NumberFormat {
  return new Intl.NumberFormat(FORMAT_LOCALE, { ...options, numberingSystem: "latn" });
}

export function dateFormatter(options: DateOptions = { dateStyle: "long" }): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(FORMAT_LOCALE, {
    ...options,
    numberingSystem: "latn",
    timeZone: TIME_ZONE,
  });
}

export function formatNumber(value: number, options?: NumberOptions): string {
  return numberFormatter(options).format(value);
}

export function formatCurrency(amount: number): string {
  return numberFormatter({ style: "currency", currency: CURRENCY }).format(amount);
}

export function formatDate(date: Date, options?: DateOptions): string {
  return dateFormatter(options).format(date);
}
