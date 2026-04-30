"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Code2, GitFork, RefreshCcw, Search, SlidersHorizontal, Star } from "lucide-react";
import type { GitHubProfile, GitHubRepo } from "./github";

type SortKey = "newest" | "updated" | "stars" | "name";
type SourceFilter = "source" | "all" | "forks";
const PAGE_SIZE = 5;
const MAX_PAGES = 3;
const LIVE_REFRESH_MS = 30000;

type LivePayload = {
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  fetchedAt: string;
};

export function ProjectExplorer({ repos }: { repos: GitHubRepo[] }) {
  const [liveRepos, setLiveRepos] = useState(repos);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [liveError, setLiveError] = useState(false);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [source, setSource] = useState<SourceFilter>("source");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/github/repos", { cache: "no-store" });
        if (!response.ok) throw new Error("GitHub refresh failed");
        const payload = (await response.json()) as LivePayload;
        if (!active) return;
        setLiveRepos(payload.repos);
        setFetchedAt(payload.fetchedAt);
        setLiveError(false);
      } catch {
        if (active) setLiveError(true);
      }
    };

    refresh();
    const timer = window.setInterval(refresh, LIVE_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const languageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    liveRepos.forEach((repo) => counts.set(repo.language ?? "Other", (counts.get(repo.language ?? "Other") ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [liveRepos]);

  const visibleRepos = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return liveRepos
      .filter((repo) => language === "All" || (repo.language ?? "Other") === language)
      .filter((repo) => source === "all" || (source === "forks" ? repo.fork : !repo.fork))
      .filter((repo) => {
        const text = [repo.name, repo.description, repo.language, ...(repo.topics ?? [])].join(" ").toLowerCase();
        return !needle || text.includes(needle);
      })
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sort === "stars") return b.stargazers_count - a.stargazers_count;
        if (sort === "name") return a.name.localeCompare(b.name);
        return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
      });
  }, [language, liveRepos, query, sort, source]);

  const pagedTotal = Math.min(visibleRepos.length, PAGE_SIZE * MAX_PAGES);
  const pageCount = Math.max(1, Math.ceil(pagedTotal / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRepos = visibleRepos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const visibleStart = visibleRepos.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const visibleEnd = Math.min(currentPage * PAGE_SIZE, pagedTotal);
  const featured = visibleRepos[0] ?? liveRepos[0];
  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const updateLanguage = (value: string) => {
    setLanguage(value);
    setPage(1);
  };
  const updateSort = (value: SortKey) => {
    setSort(value);
    setPage(1);
  };
  const updateSource = (value: SourceFilter) => {
    setSource(value);
    setPage(1);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <aside className="edge-panel border border-bone/10 bg-soot p-5 lg:sticky lg:top-8 lg:h-fit">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-tide">
          <SlidersHorizontal size={15} /> Filters
        </div>
        <div className="mt-6 space-y-2">
          <button onClick={() => updateLanguage("All")} className={filterClass(language === "All")}>
            <span>All languages</span><span>{liveRepos.length}</span>
          </button>
          {languageCounts.map(([name, count]) => (
            <button key={name} onClick={() => updateLanguage(name)} className={filterClass(language === name)}>
              <span>{name}</span><span>{count}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        {featured ? (
          <Link href={`/projects/${featured.name}`} className="group edge-panel relative block overflow-hidden border border-bone/10 bg-bone p-6 text-ink transition hover:bg-acid focus:outline-none focus:ring-2 focus:ring-acid">
            <div className="flex flex-col justify-between gap-8 md:flex-row">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink/55">Newest live project</p>
                <h2 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-none md:text-7xl">{featured.name}</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-ink/70">{featured.description ?? "No public description yet."}</p>
              </div>
              <ArrowUpRight className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={32} />
            </div>
          </Link>
        ) : null}

        <div className="mt-4 border-y border-bone/20 bg-ink/90 py-4 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-[1fr_11rem_16rem]">
            <label className="angle-button flex items-center gap-3 border border-bone/15 bg-soot px-4 py-3 focus-within:ring-2 focus-within:ring-tide">
              <Search size={18} className="text-bone/45" />
              <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search repositories" className="w-full bg-transparent text-sm outline-none placeholder:text-bone/35" />
            </label>
            <select value={sort} onChange={(event) => updateSort(event.target.value as SortKey)} className="angle-button border border-bone/15 bg-soot px-4 py-3 text-sm text-bone outline-none focus:ring-2 focus:ring-tide">
              <option value="newest">Newest created</option>
              <option value="updated">Recently pushed</option>
              <option value="stars">Most starred</option>
              <option value="name">Name A-Z</option>
            </select>
            <div className="grid grid-cols-3 border border-bone/15 bg-soot p-1">
              {(["source", "all", "forks"] as SourceFilter[]).map((item) => (
                <button key={item} onClick={() => updateSource(item)} className={`px-3 py-2 text-xs uppercase tracking-[0.14em] transition focus:outline-none focus:ring-2 focus:ring-tide ${source === item ? "bg-bone text-ink" : "text-bone/55 hover:text-bone"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-bone/45">
            <RefreshCcw size={13} className="mr-2 inline" />
            Live check every {LIVE_REFRESH_MS / 1000}s. Showing {visibleStart}-{visibleEnd} from {visibleRepos.length} filtered repositories.
            {fetchedAt ? ` Last checked ${new Date(fetchedAt).toLocaleTimeString()}.` : ""}
            {liveError ? " GitHub refresh is temporarily unavailable." : ""}
          </p>
        </div>

        {visibleRepos.length ? (
          <>
            <div className="divide-y divide-bone/10 border-y border-bone/10">
              {pageRepos.map((repo) => (
                <Link key={repo.id} href={`/projects/${repo.name}`} className="group grid gap-4 px-1 py-5 transition hover:bg-bone/5 focus:bg-bone/5 focus:outline-none md:grid-cols-[minmax(0,1.2fr)_8rem_7rem_8rem] md:items-center">
                  <div className="min-w-0">
                    <h3 className="truncate text-2xl font-black uppercase leading-none text-bone group-hover:text-acid">{repo.name}</h3>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-bone/60">{repo.description ?? "No description published."}</p>
                  </div>
                  <Meta icon={<Code2 size={15} />} text={repo.language ?? "Other"} />
                  <Meta icon={<Star size={15} />} text={formatNumber(repo.stargazers_count)} />
                  <Meta icon={<GitFork size={15} />} text={repo.fork ? "Fork" : "Source"} />
                </Link>
              ))}
            </div>
            <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Project pages">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-bone/45">
                Page {currentPage} of {pageCount}
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
                  <button key={item} onClick={() => setPage(item)} className={`angle-button min-w-11 border px-4 py-3 font-mono text-xs uppercase transition focus:outline-none focus:ring-2 focus:ring-tide ${currentPage === item ? "border-acid bg-acid text-ink" : "border-bone/15 text-bone/65 hover:text-bone"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </nav>
          </>
        ) : (
          <div className="edge-panel border border-bone/10 bg-soot p-8">
            <p className="text-3xl font-black uppercase">No matching repositories.</p>
            <button onClick={() => { setQuery(""); setLanguage("All"); setSource("source"); setPage(1); }} className="angle-button mt-6 bg-bone px-5 py-3 font-semibold text-ink transition hover:bg-acid focus:outline-none focus:ring-2 focus:ring-acid">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function filterClass(active: boolean) {
  return `flex w-full items-center justify-between border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-tide ${active ? "border-acid bg-acid text-ink" : "border-bone/10 text-bone/62 hover:border-bone/25 hover:text-bone"}`;
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-bone/50">{icon}{text}</span>;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: value > 999 ? "compact" : "standard" }).format(value);
}
