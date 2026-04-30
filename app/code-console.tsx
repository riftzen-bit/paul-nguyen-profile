"use client";

import { useMemo, useState } from "react";
import { Clipboard, Code2, Gauge, Play, ScanLine } from "lucide-react";

const presets = {
  react: `export function SignalCard() {
  return (
    <article className="edge-panel border border-bone/10 bg-soot p-6">
      <h3>Sharp interface</h3>
      <p>Build the smallest useful surface first.</p>
    </article>
  );
}`,
  api: `export async function GET() {
  const data = await fetch("https://api.github.com/users/riftzen-bit/repos", {
    cache: "no-store"
  });

  return Response.json(await data.json());
}`,
  css: `.edge-panel {
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
  border: 1px solid rgba(243, 236, 220, 0.1);
}`
};

const modes = ["Audit", "Refactor", "Explain"] as const;

export function CodeConsole() {
  const [code, setCode] = useState(presets.react);
  const [mode, setMode] = useState<(typeof modes)[number]>("Audit");
  const [copied, setCopied] = useState(false);

  const report = useMemo(() => analyzeCode(code, mode), [code, mode]);

  async function copyReport() {
    await navigator.clipboard.writeText(report.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section id="console" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_0.7fr] md:items-end">
          <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            Drop code into a live surface.
          </h2>
          <p className="max-w-xl text-lg leading-7 text-bone/65">
            A small console for visitors who want to test how I think about structure, risk, and frontend cleanup.
          </p>
        </div>

        <div className="grid overflow-hidden border border-bone/10 bg-soot lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-bone/10 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/10 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-tide">
                <Code2 size={16} /> Code input
              </div>
              <div className="flex gap-2">
                {Object.entries(presets).map(([key, value]) => (
                  <button key={key} onClick={() => setCode(value)} className="angle-button border border-bone/15 px-3 py-2 font-mono text-xs uppercase text-bone/60 transition hover:text-bone active:translate-y-px">
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              className="min-h-[430px] w-full resize-y bg-ink p-5 font-mono text-sm leading-6 text-bone outline-none placeholder:text-bone/30"
              placeholder="Paste a React component, API route, or CSS block here."
            />
          </div>

          <aside className="bg-ink">
            <div className="grid grid-cols-3 border-b border-bone/10 p-1">
              {modes.map((item) => (
                <button key={item} onClick={() => setMode(item)} className={`px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition active:translate-y-px ${mode === item ? "bg-acid text-ink" : "text-bone/55 hover:text-bone"}`}>
                  {item}
                </button>
              ))}
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                <Metric icon={<ScanLine size={16} />} label="Lines" value={report.lines} />
                <Metric icon={<Gauge size={16} />} label="Signal" value={report.score} />
                <Metric icon={<Play size={16} />} label="Flags" value={report.flags.length} />
              </div>

              <div className="mt-6 border-y border-bone/10 py-5">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-tide">Console output</p>
                <pre className="mt-4 min-h-48 whitespace-pre-wrap font-mono text-sm leading-6 text-bone/75">{report.output}</pre>
              </div>

              <div className="mt-5 space-y-2">
                {report.flags.map((flag) => (
                  <div key={flag} className="flex items-center justify-between gap-4 border border-bone/10 px-3 py-2 text-sm text-bone/70">
                    <span>{flag}</span>
                    <span className="font-mono text-xs uppercase text-clay">review</span>
                  </div>
                ))}
              </div>

              <button onClick={copyReport} className="angle-button mt-6 inline-flex w-full items-center justify-center gap-2 bg-bone px-5 py-4 font-semibold text-ink transition hover:bg-acid active:translate-y-px">
                <Clipboard size={17} /> {copied ? "Copied output" : "Copy output"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function analyzeCode(code: string, mode: string) {
  const lines = code.trim() ? code.split("\n").length : 0;
  const flags = [
    code.includes("any") ? "Avoid loose any types" : "",
    code.includes("useEffect") && !code.includes("return") ? "Effect cleanup missing" : "",
    code.includes("console.log") ? "Debug log present" : "",
    code.length > 900 ? "Consider splitting this surface" : ""
  ].filter(Boolean);
  const score = Math.max(24, Math.min(98, 92 - flags.length * 13 - Math.max(0, lines - 18)));
  const output = [
    `$ paul-console --mode ${mode.toLowerCase()}`,
    `Read ${lines} lines. Signal score ${score}.`,
    flags.length ? `Flags: ${flags.join(", ")}.` : "No obvious structural flags found.",
    mode === "Refactor" ? "Next move: extract repeated UI into a named component only if it appears twice." : "",
    mode === "Explain" ? "Reading: this block is mostly presentation logic. Keep data fetching outside unless the component owns the boundary." : "",
    mode === "Audit" ? "Audit: check states, mobile fit, accessible labels, and whether every visual wrapper earns its place." : ""
  ].filter(Boolean).join("\n");

  return { lines, flags, score, output };
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="border border-bone/10 bg-soot p-3">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-bone/45">{icon}{label}</p>
      <p className="mt-2 text-3xl font-black tabular-nums">{value}</p>
    </div>
  );
}
