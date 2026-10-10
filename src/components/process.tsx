import type { Content } from "@/i18n/content";
import type { Dictionary } from "@/i18n/ui";
import { delay } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";

export function Process({ t, c }: { t: Dictionary; c: Content }) {
  return (
    <section id="process" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow={t.process.eyebrow}
        title={t.process.title}
        description={t.process.description}
      />
      <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <div className="pointer-events-none absolute top-4 right-0 left-0 hidden h-px bg-gradient-to-r from-accent-2/60 via-accent/40 to-transparent lg:block" />
        {c.process.map(({ title, description }, i) => (
          <li key={i} style={delay(i, 8)} className="reveal relative">
            <span className="relative grid size-8 place-items-center rounded-full border border-accent/40 bg-background font-mono text-xs text-accent">
              {i + 1}
            </span>
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
