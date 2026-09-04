"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const isLoggedIn = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_20%),linear-gradient(160deg,#7f292f_0%,#4d1016_40%,#1c1314_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_15%,rgba(0,0,0,0.45))] pointer-events-none" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between gap-4 text-sm text-white/80">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 shadow-[0_16px_60px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div>
              <p className="font-bold text-white">Reposcout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Replaced ModeToggle with a simple static button mimicking a theme toggle */}
            <button
              aria-label="Toggle Theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent hover:bg-white/10 text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </button>
            {/* Replaced Button component with a styled standard anchor tag */}
            <a
              className="inline-flex h-9 items-center justify-center rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              onClick={isLoggedIn}
            >
              Login
            </a>
          </div>
        </header>

        <main className="mt-16 flex flex-1 flex-col justify-center gap-12 rounded-[3rem] border border-white/10 bg-white/10 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.32em] text-white/80">
                  Reposcout AI for everyone
                </span>
                <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Get smarter review from your Github repo, and build better
                  products with Reposcout
                </h1>
                <p className="max-w-xl text-lg leading-8 text-white/75">
                  feel polished, secure, and modern.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Replaced Button with native anchor element */}
                <a
                  href="/sign-in"
                  className="inline-flex h-11 min-w-[180px] items-center justify-center rounded-3xl bg-white px-8 py-2 font-medium text-black transition-colors hover:bg-white/90"
                >
                  Login with Github
                </a>
                {/* Replaced Button with native anchor element */}
                <a
                  href="/sign-in"
                  className="inline-flex h-11 min-w-[180px] items-center justify-center rounded-3xl border border-white/30 bg-transparent px-8 py-2 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Open notebook
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent)]" />
              <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                    Repository cell
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Write prompts in context
                  </h2>
                  <p className="text-sm leading-6 text-white/70">
                    Keep your prompts, answers, and references together in a
                    single repo review experience.
                  </p>
                </div>
                <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="h-3 w-full rounded-full bg-white/10" />
                  <div className="h-3 w-5/6 rounded-full bg-white/10" />
                  <div className="h-3 w-4/6 rounded-full bg-white/10" />
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-3 text-sm uppercase tracking-[0.28em] text-white/70">
                    AI response
                  </p>
                  <p className="text-sm leading-6 text-white/75">
                    Your workspace remembers the conversation, sources, and AI
                    outputs so every note stays connected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Reposcout. Crafted for smarter
              repo-review.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/80">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Docs
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
