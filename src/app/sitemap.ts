import type { MetadataRoute } from "next";
import { localePath, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localePath(l)}`]));
  return locales.map((locale) => ({
    url: `${siteUrl}${localePath(locale)}`,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.8,
    alternates: { languages },
  }));
}
