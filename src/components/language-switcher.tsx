"use client";

import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOCALE_COOKIE, localeNames, localePath, locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm text-muted transition-colors hover:border-accent/60 hover:text-foreground"
      >
        <Globe className="size-4" />
        <span className="font-medium uppercase">{locale}</span>
      </button>
      {open && (
        <ul className="animate-fade-up absolute end-0 top-11 z-50 w-48 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-2xl shadow-black/40 [animation-duration:200ms]">
          {locales.map((l) => (
            <li key={l}>
              <a
                href={localePath(l)}
                hrefLang={l}
                onClick={() => {
                  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-2 ${
                  l === locale ? "text-foreground" : "text-muted"
                }`}
              >
                <span className="text-base">{localeNames[l].flag}</span>
                <span className="flex-1">{localeNames[l].native}</span>
                {l === locale && <Check className="size-4 text-accent" />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
