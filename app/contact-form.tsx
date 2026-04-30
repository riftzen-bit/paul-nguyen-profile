"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, Loader2, Send, X } from "lucide-react";

const projectTypes = ["Website", "Dashboard", "Brand system", "Prototype"];
const budgets = ["Under $1k", "$1k - $3k", "$3k - $8k", "Discuss"];
const timelines = ["This week", "2-4 weeks", "1-2 months", "Flexible"];

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [notice, setNotice] = useState("");
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [budget, setBudget] = useState(budgets[1]);
  const [timeline, setTimeline] = useState(timelines[1]);
  const [message, setMessage] = useState("");
  const remaining = useMemo(() => 1600 - message.length, [message]);

  useEffect(() => {
    const receiveBrief = (event: Event) => {
      const brief = (event as CustomEvent<string>).detail;
      if (brief) setMessage(brief.slice(0, 1600));
    };

    window.addEventListener("profile:brief", receiveBrief);
    return () => window.removeEventListener("profile:brief", receiveBrief);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setNotice("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        company: data.get("company"),
        projectType,
        budget,
        timeline,
        message
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setNotice(result.message ?? "Message could not be sent.");
      return;
    }

    form.reset();
    setMessage("");
    setStatus("sent");
    setNotice("Message sent. I will reply from email.");
  }

  return (
    <form onSubmit={submit} className="edge-panel border border-bone/10 bg-soot p-5 text-bone md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" type="email" placeholder="you@email.com" />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <ChoiceGroup label="Project type" options={projectTypes} value={projectType} onChange={setProjectType} />
      <ChoiceGroup label="Budget range" options={budgets} value={budget} onChange={setBudget} />
      <ChoiceGroup label="Timeline" options={timelines} value={timeline} onChange={setTimeline} />

      <label className="mt-5 block">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-bone/45">Message</span>
        <textarea
          required
          minLength={20}
          maxLength={1600}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell me what you want to build, what already exists, and what needs to happen next."
          className="mt-2 min-h-40 w-full border border-bone/15 bg-ink px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-bone/35 focus:border-tide focus:ring-2 focus:ring-tide"
        />
        <span className="mt-2 block text-right font-mono text-xs uppercase tracking-[0.16em] text-bone/35">
          {remaining} characters left
        </span>
      </label>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="angle-button inline-flex items-center justify-center gap-2 bg-acid px-6 py-4 font-semibold text-ink transition hover:bg-bone focus:outline-none focus:ring-2 focus:ring-acid disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Send message
        </button>
        {notice ? (
          <p className={`flex items-center gap-2 text-sm ${status === "error" ? "text-clay" : "text-tide"}`}>
            {status === "error" ? <X size={16} /> : <Check size={16} />}
            {notice}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-bone/45">{label}</span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full border border-bone/15 bg-ink px-4 py-3 text-sm outline-none transition placeholder:text-bone/35 focus:border-tide focus:ring-2 focus:ring-tide"
      />
    </label>
  );
}

function ChoiceGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset className="mt-5">
      <legend className="font-mono text-xs uppercase tracking-[0.16em] text-bone/45">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`border px-3 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-tide ${value === option ? "border-acid bg-acid text-ink" : "border-bone/15 bg-ink text-bone/70 hover:text-bone"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
