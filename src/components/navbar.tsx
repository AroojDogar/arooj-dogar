import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";

export function Navbar({ t, locale }: { t: Dictionary; locale: Locale }) {
  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#projects", label: t.nav.projects },
    { href: "#process", label: t.nav.process },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div
        className="scroll-progress absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent-2 to-accent"
        style={{ transform: "scaleX(0)" }}
      />
      <nav className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2 text-sm font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-accent-2 to-accent text-[11px] text-white">
            {profile.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </span>
          {profile.name}
        </a>
        <div className="hidden items-center text-sm lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t.nav.language} />
          <a
            href="#contact"
            className="hidden rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:inline-block"
          >
            {t.nav.hireMe}
          </a>
          <MobileMenu links={links} openLabel={t.nav.openMenu} closeLabel={t.nav.closeMenu} />
        </div>
      </nav>
    </header>
  );
}
