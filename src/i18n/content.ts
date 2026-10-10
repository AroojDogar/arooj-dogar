import { profile } from "@/data/profile";
import { defaultLocale, type Locale } from "@/i18n/config";
import translations from "@/i18n/translations.json";

/** The parts of profile.ts that visitors read, in one language. */
export type Content = {
  role: string;
  tagline: string;
  about: string;
  availability: string;
  location: string;
  whatsappMessage: string;
  services: { title: string; description: string }[];
  featured: { description: string; highlights: string[] }[];
  process: { title: string; description: string }[];
};

/** Keep in sync with sourceStrings() in scripts/translate.mts */
function englishContent(): Content {
  return {
    role: profile.role,
    tagline: profile.tagline,
    about: profile.about,
    availability: profile.availability,
    location: profile.location,
    whatsappMessage: profile.whatsappMessage,
    services: profile.services.map(({ title, description }) => ({ title, description })),
    featured: profile.featured.map((p) => ({
      description: p.description,
      highlights: p.highlights ?? [],
    })),
    process: profile.process.map(({ title, description }) => ({ title, description })),
  };
}

function mapStrings<T>(value: T, fn: (s: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)])) as T;
  }
  return value;
}

/**
 * Portfolio content in the requested language. Translations come from
 * translations.json (created by `npm run translate`); any sentence that
 * hasn't been translated yet shows in English.
 */
export function getContent(locale: Locale): Content {
  const english = englishContent();
  if (locale === defaultLocale) return english;
  const dictionary = (translations as Record<string, Record<string, string>>)[locale] ?? {};
  return mapStrings(english, (s) => dictionary[s] || s);
}
