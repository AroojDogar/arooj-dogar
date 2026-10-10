import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/ui";
import { delay } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";

export function Skills({ t }: { t: Dictionary }) {
  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow={t.skills.eyebrow}
        title={t.skills.title}
        description={t.skills.description}
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(profile.skills).map(([group, items], i) => (
          <div key={group} style={delay(i, 6)} className="reveal card spotlight p-6">
            <h3 className="text-sm font-medium text-muted">{group}</h3>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <span className="size-1 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
