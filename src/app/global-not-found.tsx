import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-6 px-4 text-center font-sans">
        <p className="text-8xl font-semibold tracking-tight text-accent">404</p>
        <h1 className="text-2xl font-semibold">This page doesn&apos;t exist</h1>
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent"
        >
          Back to the homepage
        </Link>
      </body>
    </html>
  );
}
