import { ArrowUpRight, Globe, Star } from "lucide-react";
import Image from "next/image";
import { profile, type FeaturedProject } from "@/data/profile";
import type { Content } from "@/i18n/content";
import type { Dictionary } from "@/i18n/ui";
import { getRepos, type Repo } from "@/lib/github";
import { delay } from "@/lib/motion";
import { GitHubIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#663399",
  Go: "#00add8",
  Rust: "#dea584",
  Java: "#b07219",
  PHP: "#4f5d95",
  Dart: "#00b4ab",
};

export async function Projects({ t, c }: { t: Dictionary; c: Content }) {
  const repos = await getRepos();
  const featuredRepos = new Set(profile.featured.map((p) => p.repo?.toLowerCase()).filter(Boolean));
  const otherRepos = repos.filter((r) => !featuredRepos.has(r.fullName.toLowerCase())).slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        {profile.featured.map((project, i) => (
          <FeaturedCard
            key={project.name}
            index={i}
            project={project}
            description={c.featured[i]?.description ?? project.description}
            highlights={c.featured[i]?.highlights ?? project.highlights ?? []}
            t={t}
          />
        ))}
      </div>

      {otherRepos.length > 0 && (
        <>
          <h3 className="reveal mt-14 flex items-center gap-2 text-lg font-semibold">
            <GitHubIcon className="size-5" />
            {t.projects.moreOnGithub}
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherRepos.map((repo, i) => (
              <RepoCard key={repo.fullName} repo={repo} index={i} t={t} />
            ))}
          </div>
        </>
      )}

      {profile.socials.github && (
        <a
          href={
            profile.githubUsername
              ? `https://github.com/${profile.githubUsername}`
              : profile.socials.github
          }
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          {t.projects.seeAll}
          <ArrowUpRight className="size-4" />
        </a>
      )}
    </section>
  );
}

function FeaturedCard({
  project,
  description,
  highlights,
  index,
  t,
}: {
  project: FeaturedProject;
  description: string;
  highlights: string[];
  index: number;
  t: Dictionary;
}) {
  const href = project.liveUrl || (project.repo ? `https://github.com/${project.repo}` : undefined);

  return (
    <article
      style={delay(index % 2)}
      className="reveal card group flex flex-col overflow-hidden p-2"
    >
      {project.image && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden
          className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface-2"
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          {project.liveUrl && (
            <span className="absolute top-3 start-3 rounded-full bg-background/75 px-3 py-1 font-mono text-[11px] text-foreground backdrop-blur-md">
              {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
          )}
          <span className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </a>
      )}

      <div className="flex flex-1 flex-col px-4 pt-6 pb-4">
        <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
        <p className="mt-3 text-pretty text-muted">{description}</p>

        {highlights.length > 0 && (
          <ul className="mt-5 space-y-2 text-sm">
            {highlights.map((h) => (
              <li key={h} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <span key={tech} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Globe className="size-4" />
              {t.projects.liveDemo}
            </a>
          )}
          {project.repo && (
            <a
              href={`https://github.com/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2"
            >
              <GitHubIcon className="size-4" />
              {t.projects.source}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function RepoCard({ repo, index, t }: { repo: Repo; index: number; t: Dictionary }) {
  return (
    <article style={delay(index % 3)} className="reveal card spotlight flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold break-all hover:text-accent"
        >
          {repo.name}
        </a>
        {repo.stars > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
            <Star className="size-3.5" />
            {repo.stars}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-pretty text-muted">
        {repo.description ?? t.projects.noDescription}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted">
        {repo.language ? (
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: languageColors[repo.language] ?? "var(--muted)" }}
            />
            {repo.language}
          </span>
        ) : (
          <span />
        )}
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            {t.projects.live}
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
