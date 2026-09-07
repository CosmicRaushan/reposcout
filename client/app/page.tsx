"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Zm6.5 13.5.6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6.6-2.4Z" />
    </svg>
  );
}

const steps = [
  { number: "01", title: "Connect", copy: "Bring in a GitHub repository and let Reposcout map the code that matters." },
  { number: "02", title: "Explore", copy: "Search the indexed workspace with questions written in plain language." },
  { number: "03", title: "Understand", copy: "Get concise answers with file references that lead you back to the source." },
];

export default function Home() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const openWorkspace = () => router.push(session ? "/dashboard" : "/sign-in");

  return (
    <main className="landing-shell min-h-screen overflow-hidden text-white">
      <div className="landing-honeycomb pointer-events-none fixed inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-[#c8a77d]/15 bg-[#241a16]/55 px-8 py-4 backdrop-blur-xl sm:px-16 sm:py-5 lg:px-38">
          <button type="button" onClick={() => router.push("/")} className="text-left text-sm font-bold tracking-[0.15em] text-white sm:text-base">
            REPOSCOUT
          </button>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-white/55 md:flex" aria-label="Main navigation"><a href="#workflow" className="transition-colors hover:text-white">Workflow</a><a href="#workspace" className="transition-colors hover:text-white">Workspace</a><a href="#footer" className="transition-colors hover:text-white">About</a></nav>
          <button type="button" onClick={openWorkspace} className="glass-button group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/85 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">Open workspace<span className="hidden transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:inline"><ArrowUpRight /></span></button>
        </header>

        <section className="grid gap-12 pb-20 pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c8a77d]/25 bg-[#c8a77d]/10 px-3 py-1.5 text-xs font-medium tracking-[0.16em] text-[#ead9b9] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,.2)]"><span className="size-1.5 animate-pulse rounded-full bg-[#c8a77d]" />AI for the code you actually own</div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-7xl">Understand your repository at a glance.</h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-white/55 sm:text-lg">Reposcout turns a GitHub codebase into a searchable, source-backed workspace. Ask better questions, follow the context, and move from unfamiliar to fluent faster.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={openWorkspace} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d8bd91] px-6 text-sm font-semibold text-[#2b1c14] shadow-[0_16px_45px_rgba(194,145,96,.18)] transition-all hover:bg-[#ead9b9] hover:shadow-[0_18px_50px_rgba(194,145,96,.25)]">Start exploring<span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight /></span></button><a href="#workflow" className="hidden h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-medium text-white/70 backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white sm:inline-flex">See how it works</a></div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/35"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#8dab84]" />Private by workspace</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#c8a77d]" />Source-aware answers</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#a8c39c]" />Built for developers</span></div>
          </div>

          <div id="workspace" className="glass-stage relative min-h-[480px] overflow-hidden rounded-[2rem] border border-white/20 p-4 shadow-[0_35px_100px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.25)] sm:p-6"><div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd2bb] to-transparent opacity-70" /><div className="relative flex h-full min-h-[432px] flex-col overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#211d22]/70 backdrop-blur-2xl"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-300/80" /><span className="size-2 rounded-full bg-amber-200/80" /><span className="size-2 rounded-full bg-emerald-300/80" /></div><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] text-emerald-200 uppercase">Indexed</span></div><div className="grid flex-1 gap-4 p-5 sm:grid-cols-[0.75fr_1.25fr]"><div className="space-y-3 border-r border-white/10 pr-4"><p className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">Repository</p><div className="rounded-xl border border-[#ffc7a9]/25 bg-[#ffc7a9]/10 p-3"><p className="text-xs font-medium text-[#ffe3d5]">RepoName</p><p className="mt-1 text-[10px] text-white/35">RepoName / main</p></div>{["Architecture", "Authentication", "Data flow", "Recent questions"].map((item, index) => <div key={item} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${index === 0 ? "bg-white/10 text-white/80" : "text-white/35"}`}><span className="size-1 rounded-full bg-current" />{item}</div>)}</div><div className="flex flex-col"><p className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">Repository chat</p><div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-xs leading-5 text-white/65">How does this application connect the client to the repository indexing flow?</p></div><div className="mt-3 rounded-2xl border border-[#ffc7a9]/20 bg-[#ffc7a9]/[0.07] p-4"><div className="mb-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-[#ffd2bb] uppercase"><Sparkle />Answer</div><p className="text-xs leading-6 text-white/60">The client submits a repository URL, then polls the indexing job while the server fetches, chunks, embeds, and stores the code for grounded questions.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/40">indexRepo.ts</span><span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/40">rag.ts</span></div></div><div className="mt-auto flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5 text-[10px] text-white/25"><span className="size-1.5 rounded-full bg-[#ffc7a9]" />Ask a question about your codebase...</div></div></div></div></div>
        </section>

        <section id="workflow" className="border-t border-white/10 py-20 lg:py-24"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold tracking-[0.2em] text-[#ffc7a9] uppercase">A clearer starting point</p><h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">From repository URL to useful answer.</h2></div><p className="max-w-xs text-sm leading-6 text-white/40">A focused workflow for the moments when documentation is missing and context matters.</p></div><div className="grid gap-4 md:grid-cols-3">{steps.map((item) => <article key={item.number} className="glass-card group rounded-2xl border border-white/12 bg-white/[0.055] p-6 transition-transform hover:-translate-y-1"><span className="text-xs font-mono text-[#ffc7a9]/70">{item.number}</span><h3 className="mt-10 text-xl font-medium text-white">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/40">{item.copy}</p><div className="mt-8 h-px w-12 bg-[#ffc7a9]/50 transition-all group-hover:w-20" /></article>)}</div></section>

        <section className="pb-20 lg:pb-28"><div className="glass-card flex flex-col items-start justify-between gap-8 rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-7 sm:p-10 lg:flex-row lg:items-center"><div><p className="text-xs font-semibold tracking-[0.2em] text-[#ffc7a9] uppercase">Make the first question count</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white">Your next codebase conversation starts here.</h2></div><button type="button" onClick={openWorkspace} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#24191a] transition-colors hover:bg-[#ffd2bb]">Enter Reposcout <ArrowUpRight /></button></div></section>

        <footer id="footer" className="border-t border-white/10 py-10"><div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]"><div><p className="text-sm font-semibold tracking-[0.18em] text-white">REPOSCOUT</p><p className="mt-3 max-w-xs text-sm leading-6 text-white/35">A calm, source-backed way to get oriented inside unfamiliar code.</p></div><div><p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">Product</p><div className="mt-4 grid gap-3 text-sm text-white/35"><a href="#workflow" className="transition-colors hover:text-white">Workflow</a><button type="button" onClick={openWorkspace} className="text-left transition-colors hover:text-white">Workspace</button></div></div><div><p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">Connect</p><div className="mt-4 grid gap-3 text-sm text-white/35"><a href="https://github.com/CosmicRaushan/reposcout" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">GitHub <span aria-hidden="true">↗</span></a><a href="mailto:hello@reposcout.dev" className="transition-colors hover:text-white">Contact</a></div></div></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/25 sm:flex-row"><span>© {new Date().getFullYear()} Reposcout</span><span>Built for thoughtful engineering.</span></div></footer>
      </div>
    </main>
  );
}
