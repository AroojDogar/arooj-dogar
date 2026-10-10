import { profile } from "@/data/profile";

/** Public URL of the site, used for SEO metadata, the sitemap and share previews. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production" && profile.website) ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000";

/** wa.me chat link with a pre-typed message, or "" when no WhatsApp number is set. */
export function whatsappLink(message: string = profile.whatsappMessage) {
  if (!profile.whatsapp) return "";
  return `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
