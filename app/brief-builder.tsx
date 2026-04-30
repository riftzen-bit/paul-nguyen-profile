"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, Clipboard, Gauge, Layers, Send, SlidersHorizontal } from "lucide-react";

const projectTypes = ["Profile", "Dashboard", "SaaS", "Commerce"];
const priorities = ["Visual polish", "Backend", "Motion", "Speed"];
const budgets = ["Lean", "Balanced", "Premium"];

export function BriefBuilder() {
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [budget, setBudget] = useState(budgets[1]);
  const [weeks, setWeeks] = useState(4);
  const [selected, setSelected] = useState(["Visual polish", "Motion"]);
  const [copied, setCopied] = useState(false);

  const brief = useMemo(() => {
    const focus = selected.length ? selected.join(", ") : "clear structure";
    return `Project type: ${projectType}
Budget mode: ${budget}
Timeline: ${weeks} weeks
Focus: ${focus}

I want a ${projectType.toLowerCase()} experience with strong hierarchy, interaction design, and production-ready frontend details.`;
  }, [budget, projectType, selected, weeks]);

  const score = Math.min(96, 62 + selected.length * 8 + (budget === "Premium" ? 10 : budget === "Balanced" ? 6 : 2) + Math.max(0, 6 - weeks));
  const bars = [
    ["Structure", 74 + selected.length * 4],
    ["Motion", selected.includes("Motion") ? 91 : 58],
    ["Backend", selected.includes("Backend") ? 88 : 46]
  ] as const;

  function togglePriority(priority: string) {
    setSelected((current) => current.includes(priority) ? current.filter((item) => item !== priority) : [...current, priority]);
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(brief);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function sendBrief() {
    window.dispatchEvent(new CustomEvent("profile:brief", { detail: brief }));
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="brief" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-start">
        <div className="md:sticky md:top-32">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-tide">Interactive brief</p>
          <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            Shape the project before the message.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-7 text-bone/65">
            Pick a direction and the site drafts a tight brief you can send straight into the contact form.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_0.82fr]">
          <div className="edge-panel border border-bone/10 bg-soot p-5 md:p-6">
            <ControlHeader icon={<Layers size={18} />} label="Project mode" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {projectTypes.map((item) => (
                <Choice key={item} active={projectType === item} onClick={() => setProjectType(item)}>
                  {item}
                </Choice>
              ))}
            </div>

            <ControlHeader icon={<SlidersHorizontal size={18} />} label="Priorities" className="mt-7" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {priorities.map((item) => (
                <Choice key={item} active={selected.includes(item)} onClick={() => togglePriority(item)}>
                  {item}
                </Choice>
              ))}
            </div>

            <ControlHeader icon={<Gauge size={18} />} label="Pace and budget" className="mt-7" />
            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-3 gap-2">
                {budgets.map((item) => (
                  <Choice key={item} active={budget === item} onClick={() => setBudget(item)}>
                    {item}
                  </Choice>
                ))}
              </div>
              <label className="block border border-bone/10 bg-ink p-4">
                <span className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-bone/45">
                  Timeline <span>{weeks} weeks</span>
                </span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={weeks}
                  onChange={(event) => setWeeks(Number(event.target.value))}
                  className="mt-4 w-full accent-[#d8ff3f]"
                />
              </label>
            </div>
          </div>

          <aside className="edge-panel border border-bone/10 bg-bone p-5 text-ink md:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink/55">Generated brief</p>
            <div className="mt-5 flex items-end justify-between gap-5">
              <p className="text-6xl font-black leading-none">{score}</p>
              <p className="pb-2 font-mono text-xs uppercase tracking-[0.16em] text-ink/55">Signal score</p>
            </div>
            <div className="mt-6 space-y-4">
              {bars.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between font-mono text-xs uppercase tracking-[0.14em] text-ink/55">
                    <span>{label}</span><span>{value}%</span>
                  </div>
                  <div className="h-2 bg-ink/15">
                    <div className="h-full bg-ink transition-all duration-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <pre className="mt-6 whitespace-pre-wrap border-y border-ink/15 py-5 font-mono text-xs leading-6 text-ink/70">{brief}</pre>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button onClick={copyBrief} className="angle-button inline-flex items-center justify-center gap-2 border border-ink/20 px-4 py-3 font-semibold transition hover:bg-ink hover:text-bone active:translate-y-px">
                <Clipboard size={17} /> {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={sendBrief} className="angle-button inline-flex items-center justify-center gap-2 bg-ink px-4 py-3 font-semibold text-bone transition hover:bg-soot active:translate-y-px">
                <Send size={17} /> Send this brief
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ControlHeader({ icon, label, className = "" }: { icon: React.ReactNode; label: string; className?: string }) {
  return <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-tide ${className}`}>{icon}{label}</div>;
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-tide active:translate-y-px ${active ? "border-acid bg-acid text-ink" : "border-bone/15 bg-ink text-bone/70 hover:text-bone"}`}
    >
      <span>{children}</span>
      {active ? <ArrowDownRight size={15} className="float-right mt-0.5" /> : null}
    </button>
  );
}
