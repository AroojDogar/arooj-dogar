import { Check } from "lucide-react";
import { profile } from "@/data/profile";
import type { Content } from "@/i18n/content";
import type { Dictionary } from "@/i18n/ui";
import { delay } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";

export function Pricing({ t, c }: { t: Dictionary; c: Content }) {
  return (
    <section id="pricing" className="relative scroll-mt-20 overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_16%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          center
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.title}
          description={t.pricing.description}
        />

        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
          {profile.pricing.map((plan, i) => {
            const text = c.pricing[i] ?? plan;
            const featured = plan.featured;
            return (
              <div
                key={plan.name}
                style={delay(i, 8)}
                className={`reveal relative flex flex-col rounded-2xl p-8 ${
                  featured
                    ? "border border-transparent bg-[linear-gradient(var(--surface-2),var(--surface-2))_padding-box,linear-gradient(135deg,var(--accent-2),var(--accent),#c084fc)_border-box] shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--accent)_60%,transparent)]"
                    : "card spotlight"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{text.name}</h3>
                  {featured && (
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
                      {t.pricing.mostPopular}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-pretty text-muted">{text.description}</p>
                <p className="mt-8 text-sm text-muted">{t.pricing.startingAt}</p>
                <p className="text-5xl font-semibold tracking-tight">{plan.price}</p>
                <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
                  {text.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-10">
                  <a
                    href="#contact"
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity ${
                      featured
                        ? "bg-foreground text-background hover:opacity-90"
                        : "border border-border bg-surface-2 hover:border-border-strong"
                    }`}
                  >
                    {t.pricing.getStarted}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="reveal mx-auto mt-10 max-w-xl text-center text-sm text-muted">
          {t.pricing.note}
        </p>
      </div>
    </section>
  );
}
