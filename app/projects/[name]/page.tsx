import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GitFork, Github, Star } from "lucide-react";
import { formatDate, formatNumber, getGitHubRepo } from "../github";

export const revalidate = 1800;

type Props = {
  params: Promise<{ name: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { name } = await params;
  let repo = null;
  let failed = false;

  try {
    repo = await getGitHubRepo(decodeURIComponent(name));
  } catch {
    failed = true;
  }

  if (!failed && !repo) notFound();

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-ink px-4 py-8 text-bone md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-bone/20 pb-5">
        <Link href="/projects" className="angle-button inline-flex items-center gap-2 border border-bone/20 px-4 py-2 text-sm text-bone/80 transition hover:text-tide">
          <ArrowLeft size={16} />
          Projects
        </Link>
        <a href={repo?.html_url ?? "https://github.com/riftzen-bit"} className="angle-button inline-flex items-center gap-2 bg-bone px-4 py-2 text-sm font-semibold text-ink transition hover:bg-acid">
          <Github size={16} />
          Repository
        </a>
      </nav>

      {failed ? (
        <section className="mx-auto max-w-7xl py-32">
          <h1 className="text-6xl font-black uppercase leading-none md:text-8xl">GitHub signal unavailable.</h1>
          <p className="mt-8 max-w-2xl text-xl leading-8 text-bone/70">This route will recover automatically when the API responds.</p>
        </section>
      ) : repo ? (
        <section className="mx-auto grid max-w-7xl gap-10 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-tide">{repo.language ?? "Repository"}</p>
            <h1 className="mt-6 max-w-5xl text-6xl font-black uppercase leading-[0.88] md:text-8xl">{repo.name}</h1>
            <p className="mt-8 max-w-3xl text-2xl leading-tight text-bone/72">
              {repo.description ?? "This repository has no public description yet."}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={repo.html_url} className="angle-button inline-flex items-center gap-2 bg-bone px-6 py-4 font-semibold text-ink transition hover:bg-acid">
                Open on GitHub <ArrowUpRight size={18} />
              </a>
              {repo.homepage ? (
                <a href={repo.homepage} className="angle-button inline-flex items-center gap-2 border border-bone/20 px-6 py-4 font-semibold text-bone transition hover:text-tide">
                  Live site <ArrowUpRight size={18} />
                </a>
              ) : null}
            </div>
          </div>

          <aside className="edge-panel border border-bone/10 bg-soot p-6">
            <div className="grid grid-cols-3 gap-4 border-b border-bone/10 pb-6 text-center">
              <Metric icon={<Star size={18} />} label="Stars" value={repo.stargazers_count} />
              <Metric icon={<GitFork size={18} />} label="Forks" value={repo.forks_count} />
              <Metric label="Issues" value={repo.open_issues_count} />
            </div>
            <dl className="mt-6 space-y-5 text-sm">
              <Row label="Full name" value={repo.full_name} />
              <Row label="Default branch" value={repo.default_branch} />
              <Row label="Created" value={formatDate(repo.created_at)} />
              <Row label="Last push" value={formatDate(repo.pushed_at)} />
              <Row label="Size" value={`${formatNumber(repo.size)} KB`} />
              <Row label="Status" value={repo.archived ? "Archived" : repo.fork ? "Fork" : "Active"} />
            </dl>
          </aside>
        </section>
      ) : null}
    </main>
  );
}

function Metric({ icon, label, value }: { icon?: React.ReactNode; label: string; value: number }) {
  return (
    <div>
      <p className="flex items-center justify-center gap-2 text-3xl font-black">{icon}{formatNumber(value)}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-bone/45">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-bone/10 pb-4">
      <dt className="font-mono uppercase tracking-[0.16em] text-bone/45">{label}</dt>
      <dd className="max-w-[60%] text-right text-bone/78">{value}</dd>
    </div>
  );
}
