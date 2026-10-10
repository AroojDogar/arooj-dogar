export const locales = ["en", "de", "fr", "es", "it", "nl", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: "English", english: "English", flag: "🇬🇧" },
  de: { native: "Deutsch", english: "German", flag: "🇩🇪" },
  fr: { native: "Français", english: "French", flag: "🇫🇷" },
  es: { native: "Español", english: "Spanish", flag: "🇪🇸" },
  it: { native: "Italiano", english: "Italian", flag: "🇮🇹" },
  nl: { native: "Nederlands", english: "Dutch", flag: "🇳🇱" },
  ar: { native: "العربية", english: "Arabic", flag: "🇸🇦" },
};

export const rtlLocales: readonly Locale[] = ["ar"];

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/** English lives at "/", every other language at "/<locale>". */
export const localePath = (locale: Locale) => (locale === defaultLocale ? "/" : `/${locale}`);

export const LOCALE_COOKIE = "NEXT_LOCALE";
