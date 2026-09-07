"use client";

import { authClient } from "@/src/lib/auth-client";
import Link from "next/link";

function GithubIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.78-.25.78-.55v-2.02c-3.18.7-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.54-.29-5.2-1.27-5.2-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.12 1.17a10.8 10.8 0 0 1 5.68 0c2.16-1.48 3.12-1.17 3.12-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.39-2.67 5.35-5.22 5.64.41.36.78 1.08.78 2.18v3.23c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  );
}

export default function SignInPage() {
  const handleGithubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3001/dashboard?welcome=1",
    });
  };

  return (
    <main className="landing-shell flex min-h-screen items-center justify-center px-5 py-8 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/[0.08] p-8 shadow-[0_25px_80px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.2)] backdrop-blur-2xl sm:p-10">
        <div className="text-center">
          <Link href="/" className="text-lg font-bold tracking-[-0.03em] text-white">
            Reposcout
          </Link>
          <p className="mt-2 text-xl font-semibold tracking-[0.09em] text-[#ffc7a9] uppercase">
            Welcome back
          </p>
          
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/45">
            Connect your GitHub account to explore your repositories with context.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/[0.1] text-sm font-semibold text-white transition-colors hover:border-[#ffc7a9]/50 hover:bg-[#ffc7a9]/15"
        >
          <GithubIcon />
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-white/25">
          Your workspace stays connected to your GitHub account.
        </p>
        <Link href="/" className="mt-8 block text-center text-sm text-white/40 transition-colors hover:text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
