import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { locales } from "@/i18n/config";
import type { Content } from "@/i18n/content";
import type { Dictionary } from "@/i18n/ui";
import { OpenChatButton } from "@/components/open-chat-button";
import { ProfilePhoto } from "@/components/profile-photo";

export function Hero({ t, c }: { t: Dictionary; c: Content }) {
  const stats = [
    { value: String(locales.length), label: t.hero.languages },
    { value: "24h", label: t.hero.replyTime },
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="animate-drift pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_32%,transparent),transparent)] blur-2xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <a
            href="#contact"
            className="animate-fade-up group inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 py-1 ps-1 pe-3 text-sm text-muted backdrop-blur transition-colors hover:border-border-strong hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-0.5 text-xs font-medium text-mint">
              <span className="animate-blink size-1.5 rounded-full bg-mint" />
              {t.hero.availableNow}
            </span>
            {c.availability}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </a>

          <h1 className="text-title animate-fade-up mt-7 text-5xl text-balance sm:text-6xl lg:text-7xl [animation-delay:100ms]">
            {t.hero.titleBefore}{" "}
            <span className="text-accent-gradient">{t.hero.titleHighlight}</span>{" "}
            {t.hero.titleAfter}
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted [animation-delay:200ms]">
            {c.tagline}
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3 [animation-delay:300ms]">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              {t.hero.viewWork}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </a>
            <OpenChatButton
              label={t.hero.askAi}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2"
            />
            {profile.resume && (
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <Download className="size-4" />
                {t.hero.downloadCv}
              </a>
            )}
          </div>

          <dl className="animate-fade-up mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6 [animation-delay:400ms]">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="text-2xl font-semibold tracking-tight">{s.value}</dd>
                <dt className="mt-0.5 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up relative mx-auto w-full max-w-sm [animation-delay:250ms] lg:max-w-none">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent-2/30 via-accent/25 to-transparent blur-3xl" />
          <div className="card relative overflow-hidden p-2">
            <ProfilePhoto
              sizes="(min-width: 1024px) 420px, 90vw"
              className="relative aspect-[4/5] w-full rounded-xl"
              zoom={Math.max(profile.photoZoom, 1.45)}
              focus="49% 46%"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 backdrop-blur-md">
              <div>
                <p className="text-sm font-semibold">{profile.name}</p>
                <p className="text-xs text-muted">{c.role}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2.5 py-1 text-xs font-medium text-mint">
                <span className="size-1.5 rounded-full bg-mint" />
                {c.location.split("·")[0].trim()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
