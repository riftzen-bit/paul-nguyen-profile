import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { ProjectExplorer } from "./project-explorer";
import type { GitHubProfile, GitHubRepo } from "./github";
import { formatNumber, getGitHubProfile, getGitHubRepos } from "./github";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let profile: GitHubProfile | null = null;
  let repos: GitHubRepo[] = [];
  let failed = false;

  try {
    [profile, repos] = await Promise.all([getGitHubProfile("live"), getGitHubRepos("live")]);
  } catch {
    failed = true;
  }

  const sourceRepos = repos.filter((repo) => !repo.fork).length;
  const stars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
  const languages = new Set(repos.map((repo) => repo.language).filter(Boolean)).size;

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-ink px-4 py-8 text-bone md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-bone/20 pb-5">
        <Link href="/" className="angle-button inline-flex items-center gap-2 border border-bone/20 px-4 py-2 text-sm text-bone/80 transition hover:text-tide focus:outline-none focus:ring-2 focus:ring-tide">
          <ArrowLeft size={16} /> Home
        </Link>
        <a href="https://github.com/riftzen-bit" className="angle-button inline-flex items-center gap-2 bg-bone px-4 py-2 text-sm font-semibold text-ink transition hover:bg-acid focus:outline-none focus:ring-2 focus:ring-acid">
          <Github size={16} /> GitHub
        </a>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 py-20 md:grid-cols-[1.25fr_0.75fr] md:py-28">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-tide">Repository index</p>
          <h1 className="mt-6 max-w-5xl text-6xl font-black uppercase leading-[0.86] md:text-8xl">
            A cleaner way to scan the work.
          </h1>
        </div>
        <aside className="edge-panel border border-bone/10 bg-soot p-6">
          <p className="text-2xl font-black uppercase">{profile?.name ?? "Paul Nguyen"}</p>
          <p className="mt-2 text-sm text-bone/60">@riftzen-bit</p>
          <p className="mt-6 max-w-md text-base leading-7 text-bone/70">
            Full public GitHub inventory with live polling while the page is open. New public repos rise to the top automatically.
          </p>
          <div className="mt-8 grid grid-cols-3 border-t border-bone/10 pt-6 text-center">
            <Metric label="Repos" value={repos.length || profile?.public_repos || 0} />
            <Metric label="Source" value={sourceRepos} />
            <Metric label="Stars" value={stars} />
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-bone/45">
            {languages} languages detected
          </p>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl pb-32">
        {failed ? (
          <div className="edge-panel border border-clay bg-soot p-8 text-bone">
            GitHub is not reachable from this runtime. The page will recover when the API responds.
          </div>
        ) : (
          <ProjectExplorer repos={repos} />
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-3xl font-black tabular-nums">{formatNumber(value)}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-bone/45">{label}</p>
    </div>
  );
}
