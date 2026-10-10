import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Content } from "@/i18n/content";
import type { Dictionary } from "@/i18n/ui";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { whatsappLink } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import { OpenChatButton } from "@/components/open-chat-button";

export function Contact({ t, c, locale }: { t: Dictionary; c: Content; locale: Locale }) {
  const whatsapp = whatsappLink(c.whatsappMessage);
  const socials = [
    { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: profile.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: profile.socials.twitter, label: "X", Icon: XIcon },
  ].filter((s) => s.href);

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-border">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="reveal">
          <p className="text-sm font-medium text-accent">{t.nav.contact}</p>
          <h2 className="text-title mt-3 text-4xl text-balance sm:text-5xl">{t.contact.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-muted">
            {t.contact.description}
          </p>

          <div className="mt-10 space-y-3">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent("Project inquiry")}`}
              className="card group flex items-center justify-between gap-4 p-4"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent-2 to-accent text-white">
                  <Mail className="size-4" />
                </span>
                <span className="truncate text-sm font-medium">{profile.email}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </a>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="card group flex items-center justify-between gap-4 p-4"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#25D366] text-[#06210f]">
                    <WhatsAppIcon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{t.contact.whatsapp}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <OpenChatButton
              label={t.hero.askAi}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2"
            />
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="reveal card p-6 sm:p-8 [--start:6%]">
          <ContactForm t={t.contact.form} locale={locale} />
        </div>
      </div>
    </section>
  );
}

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-sm text-muted sm:flex-row sm:px-6 sm:text-start">
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-mint" />© {profile.name}. {t.footer.rights}
        </p>
        <p>{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
