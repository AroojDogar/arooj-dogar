import { Bot, Code2, Gauge, LayoutTemplate } from "lucide-react";
import type { Content } from "@/i18n/content";
import type { Dictionary } from "@/i18n/ui";
import { delay } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";

const icons = [Code2, Bot, LayoutTemplate, Gauge];

export function Services({ t, c }: { t: Dictionary; c: Content }) {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} description={c.about} />
      <div className="reveal mt-14 grid overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 [&>*]:bg-background gap-px">
        {c.services.map((service, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              style={delay(i % 2)}
              className="spotlight group relative flex flex-col gap-4 p-8 sm:p-10"
            >
              <div className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-accent transition-colors group-hover:border-accent/40">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
              <p className="max-w-md leading-relaxed text-pretty text-muted">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
