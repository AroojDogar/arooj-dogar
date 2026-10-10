import { cacheLife } from "next/cache";
import { profile } from "@/data/profile";

export type Repo = {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  updatedAt: string;
};

type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

/**
 * Public, non-fork repositories for the configured GitHub user, most recently
 * pushed first. Cached for hours so the site stays fast and within GitHub's
 * rate limits. Returns [] when no username is set or GitHub is unreachable.
 */
export async function getRepos(): Promise<Repo[]> {
  "use cache";
  cacheLife("hours");

  const username = process.env.GITHUB_USERNAME || profile.githubUsername;
  if (!username) return [];

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
      { headers },
    );
    if (!res.ok) {
      console.error(`GitHub API responded ${res.status} for user "${username}"`);
      return [];
    }
    const data = (await res.json()) as GitHubRepo[];
    return data
      .filter((r) => !r.fork && !r.archived)
      .map((r) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        topics: r.topics ?? [],
        updatedAt: r.pushed_at,
      }));
  } catch (error) {
    console.error("Failed to load GitHub repositories", error);
    return [];
  }
}
