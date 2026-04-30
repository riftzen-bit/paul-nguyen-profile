"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github, Linkedin, Mail, MoveRight } from "lucide-react";
import { BriefBuilder } from "./brief-builder";
import { CodeConsole } from "./code-console";
import { ContactForm } from "./contact-form";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" }
];
const capabilities = [
  { title: "Product systems", copy: "Lean interfaces, sharp hierarchy, and flows that make complex work feel direct.", image: "https://picsum.photos/seed/product-system/1200/900", className: "md:col-span-2 md:row-span-2" },
  { title: "Frontend craft", copy: "Next.js, TypeScript, motion, and responsive layouts tuned for real users.", image: "https://picsum.photos/seed/frontend-craft/900/600", className: "md:col-span-2" },
  { title: "Visual direction", copy: "Editorial spacing, controlled contrast, and assets that carry the story.", image: "https://picsum.photos/seed/visual-direction/900/600", className: "md:col-span-2" },
  { title: "Ops mind", copy: "Documentation, review loops, and handoff discipline.", image: "https://picsum.photos/seed/ops-mind/700/700", className: "md:col-span-1" },
  { title: "Builder energy", copy: "Fast prototypes that still respect maintainability and polish.", image: "https://picsum.photos/seed/builder-energy/1100/650", className: "md:col-span-3" }
];
const principles = [
  ["Signal", "Remove noise until the important action is obvious."],
  ["Systems", "Build reusable patterns without turning them into ceremony."],
  ["Motion", "Use movement to orient, not to distract."],
  ["Finish", "Ship surfaces that feel intentional at every breakpoint."]
];
const techStack = [
  { label: "Next.js", icon: <NextMark />, color: "text-bone" },
  { label: "TypeScript", icon: <TsMark />, color: "text-[#3178c6]" },
  { label: "Tailwind CSS", icon: <TailwindMark />, color: "text-[#38bdf8]" },
  { label: "GSAP", icon: <GsapMark />, color: "text-[#88ce02]" },
  { label: "React", icon: <ReactMark />, color: "text-[#61dafb]" },
  { label: "Bun", icon: <BunMark />, color: "text-[#f6dece]" }
];
const revealText =
  "Paul Nguyen builds digital work with a clean operating rhythm: strong visual order, direct interaction design, and engineering choices that stay understandable after launch.";

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".reveal-word");
      gsap.fromTo(words, { opacity: 0.14, y: 18 }, {
        opacity: 1,
        y: 0,
        stagger: 0.045,
        ease: "none",
        scrollTrigger: { trigger: ".reveal-copy", start: "top 78%", end: "bottom 38%", scrub: true }
      });
      gsap.utils.toArray<HTMLElement>(".media-reveal").forEach((item) => {
        gsap.fromTo(item, { scale: 0.86, opacity: 0.55, filter: "brightness(0.5) contrast(1.1)" }, {
          scale: 1,
          opacity: 1,
          filter: "brightness(1) contrast(1.2)",
          ease: "none",
          scrollTrigger: { trigger: item, start: "top 86%", end: "bottom 30%", scrub: true }
        });
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className="w-full max-w-full overflow-x-hidden bg-ink text-bone">
      <nav className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 items-center justify-between border border-bone/20 bg-ink/75 px-4 py-3 backdrop-blur-xl md:top-6 md:px-6">
        <a href="#top" className="font-mono text-sm uppercase tracking-[0.18em] text-bone">
          Paul Nguyen
        </a>
        <div className="hidden items-center gap-7 text-sm text-bone/70 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-bone">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="angle-button inline-flex items-center gap-2 bg-bone px-4 py-2 text-sm font-semibold text-ink transition hover:bg-acid"
        >
          <Mail size={16} />
          Contact
        </a>
      </nav>

      <section id="top" className="relative min-h-screen px-4 pb-24 pt-32 md:px-8 md:pt-40">
        <div
          className="hero-image-mask absolute inset-x-0 top-0 h-[78vh] opacity-40 grayscale contrast-125"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(8,8,7,.28), #080807 92%), url(https://picsum.photos/seed/paul-nguyen-profile/1920/1200)",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col items-center justify-center text-center">
          <h1 className="max-w-6xl text-6xl font-black uppercase leading-[0.88] text-bone md:text-8xl xl:text-[7.5rem]">
            Paul Nguyen
          </h1>
          <p className="mt-8 max-w-4xl text-xl leading-tight text-bone/80 md:text-3xl">
            I shape{" "}
            <span
              className="inline-block h-9 w-24 rounded-full align-middle ring-1 ring-bone/30 md:h-11 md:w-32"
              style={{
                backgroundImage: "url(https://picsum.photos/seed/interface-detail/420/160)",
                backgroundPosition: "center",
                backgroundSize: "cover"
              }}
            />{" "}
            profile systems with strong type, useful motion, and frontends built to last.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/projects"
              className="angle-button inline-flex items-center justify-center gap-2 bg-bone px-7 py-4 font-semibold text-ink transition hover:bg-acid"
            >
              View projects <ArrowUpRight size={18} />
            </a>
            <a
              href="#process"
              className="angle-button inline-flex items-center justify-center gap-2 border border-bone/25 px-7 py-4 font-semibold text-bone transition hover:border-tide hover:text-tide"
            >
              Read process <MoveRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <BriefBuilder />

      <CodeConsole />

      <section id="work" className="px-4 py-32 md:px-8 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              Built from structure, not decoration.
            </h2>
            <p className="max-w-sm text-base leading-7 text-bone/60">
              The profile base is designed as a working system: editorial type, gapless layout,
              high contrast actions, and image-led atmosphere.
            </p>
          </div>

          <div className="grid grid-flow-dense auto-rows-[250px] grid-cols-1 gap-3 md:grid-cols-6">
            {capabilities.map((item) => (
              <article
                key={item.title}
                className={`group edge-panel relative isolate overflow-hidden border border-bone/10 bg-soot ${item.className}`}
              >
                <div
                  className="absolute inset-0 scale-100 bg-cover bg-center opacity-50 grayscale transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-70"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <h3 className="text-3xl font-black uppercase leading-none">{item.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-6 text-bone/70">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="px-4 py-32 md:px-8 md:py-48">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[0.8fr_1.2fr]">
          <div className="md:sticky md:top-32 md:h-fit">
            <h2 className="text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              A profile that moves with intent.
            </h2>
          </div>
          <div className="space-y-16">
            <p className="reveal-copy text-4xl font-semibold leading-tight text-bone md:text-6xl">
              {revealText.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="reveal-word inline-block pr-3">
                  {word}
                </span>
              ))}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {["systems", "workspace", "interface", "motion"].map((seed) => (
                <div
                  key={seed}
                  className="media-reveal edge-panel min-h-[320px] overflow-hidden border border-bone/10 bg-cover bg-center grayscale"
                  style={{ backgroundImage: `url(https://picsum.photos/seed/${seed}-paul/900/900)` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="signal" className="px-4 py-32 md:px-8 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex overflow-hidden border-y border-bone/20 py-6">
            <div className="marquee-track flex min-w-max animate-marquee gap-4 pr-4">
              {techStack.concat(techStack).map((item, index) => (
                <span key={`${item.label}-${index}`} className="angle-button inline-flex items-center gap-3 border border-bone/15 bg-soot px-5 py-4 text-bone/72 transition hover:border-acid hover:text-bone">
                  <span className={`grid h-8 w-8 place-items-center ${item.color}`}>{item.icon}</span>
                  <span className="text-xl font-black uppercase tracking-[0.02em] md:text-3xl">{item.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:h-[620px] md:flex-row">
            {principles.map(([title, copy], index) => (
              <article
                key={title}
                className="group relative flex min-h-[300px] basis-auto overflow-hidden border border-bone/10 bg-soot p-5 transition-all duration-700 md:min-h-0 md:basis-1/4 md:hover:basis-2/5"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                  style={{ backgroundImage: `url(https://picsum.photos/seed/principle-${index}/900/1200)` }}
                />
                <div className="relative mt-auto">
                  <h3 className="text-4xl font-black uppercase leading-none">{title}</h3>
                  <p className="mt-5 max-w-xs text-sm leading-6 text-bone/70">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="px-4 pb-10 pt-24 md:px-8">
        <div className="mx-auto max-w-7xl border-t border-bone/20 pt-12">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <h2 className="text-6xl font-black uppercase leading-[0.88] md:text-8xl">
                Build the next version with Paul Nguyen.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-7 text-bone/70">
                Send project context, budget, and timing. The backend delivers it to my inbox and keeps your reply address attached.
              </p>
            </div>
            <ContactForm />
          </div>
          <div className="mt-12 grid gap-10 border-t border-bone/10 pt-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-bone/40">
              Paul Nguyen profile foundation
            </p>
            <div className="space-y-5 text-bone/70">
              <div className="flex gap-3">
                <a className="angle-button bg-acid p-3 text-ink transition hover:bg-bone" href="#contact" aria-label="Contact form">
                  <Mail size={20} />
                </a>
                <a className="angle-button border border-bone/20 p-3 transition hover:text-tide" href="https://github.com/riftzen-bit" aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a className="angle-button border border-bone/20 p-3 transition hover:text-tide" href="https://www.linkedin.com/" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NextMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9h3.2l8.9 13.8V9H25v14h-3.1L13 9.3V23h-3V9Z" />
    </svg>
  );
}

function TsMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
      <rect x="4" y="4" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10h13v3h-5v11h-3V13H8v-3Zm14.2 13.9c-1.6 0-3-.4-4-1.2l1.4-2.3c.8.6 1.7.9 2.7.9.8 0 1.2-.2 1.2-.7 0-.4-.4-.7-1.5-1-2.2-.6-3.5-1.4-3.5-3.4 0-2.1 1.7-3.5 4.2-3.5 1.4 0 2.7.3 3.6 1l-1.3 2.2c-.7-.4-1.5-.7-2.3-.7-.7 0-1.1.3-1.1.7 0 .5.5.7 1.8 1.1 2.2.6 3.3 1.5 3.3 3.3 0 2.2-1.8 3.6-4.5 3.6Z" />
    </svg>
  );
}

function TailwindMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M16 9.5c-3.6 0-5.8 1.8-6.8 5.3 1.4-1.8 3-2.4 4.8-1.8 1 .4 1.8 1.1 2.6 1.8 1.4 1.2 3 2.5 6.2 2.5 3.6 0 5.8-1.8 6.8-5.3-1.4 1.8-3 2.4-4.8 1.8-1-.4-1.8-1.1-2.6-1.8-1.4-1.2-3-2.5-6.2-2.5Zm-6.8 5.2c-3.6 0-5.8 1.8-6.8 5.3 1.4-1.8 3-2.4 4.8-1.8 1 .4 1.8 1.1 2.6 1.8 1.4 1.2 3 2.5 6.2 2.5 3.6 0 5.8-1.8 6.8-5.3-1.4 1.8-3 2.4-4.8 1.8-1-.4-1.8-1.1-2.6-1.8-1.4-1.2-3-2.5-6.2-2.5Z" />
    </svg>
  );
}

function GsapMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M5 20.5C7.4 12.3 12.9 7.8 21.4 7h5.1C23.8 9.1 22 12.1 21 16c-1.5-.7-3.1-.7-4.8-.1-1.7.6-3 1.7-3.8 3.2 2.4-1.2 4.7-1.3 6.8-.2-2.6 3.3-6 5.1-10.2 5.1H4.5l.5-3.5Z" />
      <path d="M20.7 18.2c2.4-.5 4.6.1 6.8 1.8-2.1 2.6-5 4-8.6 4h-4.4c2.6-1.2 4.7-3.1 6.2-5.8Z" opacity=".55" />
    </svg>
  );
}

function ReactMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
      <circle cx="16" cy="16" r="2.6" />
      <ellipse cx="16" cy="16" rx="12" ry="4.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="16" cy="16" rx="12" ry="4.8" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="12" ry="4.8" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(120 16 16)" />
    </svg>
  );
}

function BunMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M6 17c0-5 4.4-9 10-9s10 4 10 9-4.4 8-10 8S6 22 6 17Zm5.2-1.5c.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2-1.2.5-1.2 1.2.5 1.2 1.2 1.2Zm9.6 0c.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2-1.2.5-1.2 1.2.5 1.2 1.2 1.2ZM12 19.2c1.8 1.8 6.2 1.8 8 0l-1.1-1.1c-1.2 1.1-4.6 1.1-5.8 0L12 19.2Z" />
      <path d="M9 9.5 6.5 6.8l3.7 1.1L13 5.5l-.6 3.5" opacity=".55" />
    </svg>
  );
}
