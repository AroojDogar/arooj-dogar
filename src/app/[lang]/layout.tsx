import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { profile } from "@/data/profile";
import { isLocale, localePath, locales, rtlLocales } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import { siteUrl } from "@/lib/site";
import { Effects } from "@/components/effects";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Only used for small step numbers further down the page
  preload: false,
});

// Only downloaded on the Arabic page, where it's used
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  preload: false,
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getContent(lang);
  const title = `${profile.name} — ${c.role}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description: c.tagline,
    keywords: [
      "freelance web developer",
      "Next.js developer",
      "AI developer",
      "full-stack developer",
      "React",
      "TypeScript",
      profile.name,
    ],
    authors: [{ name: profile.name }],
    alternates: {
      canonical: localePath(lang),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localePath(l)])),
        "x-default": "/",
      },
    },
    openGraph: {
      title,
      description: c.tagline,
      type: "website",
      url: localePath(lang),
      locale: lang,
    },
    twitter: { card: "summary_large_image", title, description: c.tagline },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={rtlLocales.includes(lang) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Effects />
        <Analytics />
      </body>
    </html>
  );
}
