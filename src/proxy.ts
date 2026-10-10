import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

/** Best supported language from the browser's Accept-Language header. */
function preferredLocale(header: string | null): Locale {
  const ranked = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return (ranked.find((r) => isLocale(r.lang))?.lang as Locale | undefined) ?? defaultLocale;
}

// English is served at "/" (rewritten to /en internally). Visitors whose browser
// or saved choice prefers another language are sent to /de, /fr, … on their first visit.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === `/${defaultLocale}`) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : preferredLocale(request.headers.get("accept-language"));

  if (locale !== defaultLocale) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  return NextResponse.rewrite(new URL(`/${defaultLocale}`, request.url));
}

export const config = {
  matcher: ["/", "/en"],
};
