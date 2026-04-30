export const GITHUB_USERNAME = "riftzen-bit";
export const REVALIDATE_SECONDS = 1800;

const API = "https://api.github.com";

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  created_at: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  default_branch: string;
  size: number;
};

async function githubFetch<T>(path: string, cache: "revalidate" | "live" = "revalidate"): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`${API}${path}`, cache === "live"
    ? { headers, cache: "no-store" }
    : { headers, next: { revalidate: REVALIDATE_SECONDS } });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub API failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getGitHubProfile(cache?: "revalidate" | "live") {
  return githubFetch<GitHubProfile>(`/users/${GITHUB_USERNAME}`, cache);
}

export async function getGitHubRepos(cache?: "revalidate" | "live") {
  const repos: GitHubRepo[] = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubFetch<GitHubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?type=owner&sort=created&direction=desc&per_page=100&page=${page}`,
      cache
    );
    if (!batch?.length) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  return repos;
}

export async function getGitHubRepo(name: string) {
  return githubFetch<GitHubRepo>(`/repos/${GITHUB_USERNAME}/${encodeURIComponent(name)}`);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: value > 999 ? "compact" : "standard" }).format(value);
}
