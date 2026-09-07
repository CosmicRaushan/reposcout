"use client";

import { authClient } from "@/src/lib/auth-client";
import { DashboardHeader } from "@/src/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/src/components/dashboard/dashboard-sidebar";
import { RepositoryWorkspace } from "@/src/components/dashboard/repository-workspace";
import {
  Repository,
  RepositoryList,
} from "@/src/components/dashboard/repository-list";
import { RepositoryChat } from "@/src/components/dashboard/repository-chat";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Notice = {
  title: string;
  message: string;
  tone: "success" | "info";
  persistent?: boolean;
};

type DashboardSection = "overview" | "repositories";

function GlassNotice({ notice }: { notice: Notice }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[min(20rem,calc(100vw-3rem))] rounded-xl border p-2 shadow-[0_18px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] ${notice.tone === "success" ? "border-emerald-300/25 bg-emerald-950/85" : "border-white/20 bg-[#252022]/90"}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${notice.tone === "success" ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200" : "border-[#d09a82]/30 bg-[#d09a82]/15 text-[#e2b09b]"}`}
        >
          {notice.tone === "success" ? "✓" : "i"}
        </span>
        <div>
          <p className="font-sans text-sm font-semibold text-white">
            {notice.title}
          </p>
          <p className="mt-1 font-sans text-xs leading-5 text-zinc-400">
            {notice.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [repositoryRefreshKey, setRepositoryRefreshKey] = useState(0);
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [repositoryCount, setRepositoryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!session || searchParams.get("welcome") !== "1") return;

    const welcomeTimeout = window.setTimeout(() => {
      setNotice({
        title: `Welcome, ${session.user.name}`,
        message: "Your workspace is ready.",
        tone: "success",
      });
      setTimeout(() => setNotice(null), 2000);
    }, 0);
    const timeout = window.setTimeout(() => setNotice(null), 2000);
    window.history.replaceState(null, "", "/dashboard");
    return () => {
      window.clearTimeout(welcomeTimeout);
      window.clearTimeout(timeout);
    };
  }, [searchParams, session]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101012] font-sans text-sm text-zinc-400">
        Loading workspace...
      </main>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#101012] font-sans text-zinc-100 [background-image:radial-gradient(circle_at_80%_0%,rgba(185,120,97,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_32%)]">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="lg:pl-60">
        <DashboardHeader
          user={session.user}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            <button
              type="button"
              onClick={() => setActiveSection("overview")}
              className={`shrink-0 rounded-lg px-3 py-2 font-sans text-xs font-semibold ${activeSection === "overview" ? "bg-white/[0.1] text-white" : "text-zinc-500"}`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("repositories")}
              className={`shrink-0 rounded-lg px-3 py-2 font-sans text-xs font-semibold ${activeSection === "repositories" ? "bg-white/[0.1] text-white" : "text-zinc-500"}`}
            >
              Repositories
            </button>
          </div>
          {activeSection === "overview" ? (
            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-10">
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#b97861]/15 blur-3xl" />
                <p className="relative font-sans text-xs font-semibold tracking-[0.2em] text-[#d09a82] uppercase">
                  Overview
                </p>
                <h1 className="relative mt-3 max-w-2xl font-sans text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                  Your codebase command center.
                </h1>
                <p className="relative mt-4 max-w-xl font-sans text-base leading-7 text-zinc-400">
                  Index repositories, monitor readiness, and open focused
                  conversations with your code.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
                <p className="font-sans text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                  Indexed repositories
                </p>
                <p className="mt-5 font-sans text-6xl font-semibold tracking-[-0.06em] text-[#d09a82]">
                  {repositoryCount}
                </p>
                <p className="mt-3 font-sans text-sm leading-6 text-zinc-500">
                  Your connected codebases, ready for exploration.
                </p>
              </div>
            </section>
          ) : null}

          {activeSection === "repositories" ? (
            <section>
              <div className="mb-5">
                <p className="font-sans text-xs font-semibold tracking-[0.2em] text-[#d09a82] uppercase">
                  Repositories
                </p>
                <h1 className="mt-2 font-sans text-3xl font-semibold tracking-[-0.04em] text-white">
                  Your connected codebases
                </h1>
                <p className="mt-2 font-sans text-sm text-zinc-500">
                  Monitor status, remove repositories, or open a completed
                  repository chat.
                </p>
              </div>
            </section>
          ) : null}
          {activeSection === "repositories" ? (
            <RepositoryWorkspace
              onIndexQueued={(message) => {
                setRepositoryRefreshKey((key) => key + 1);
                setNotice({
                  title: "Indexing in progress",
                  message,
                  tone: "success",
                  persistent: true,
                });
                window.setTimeout(() => {
                  setNotice((currentNotice) =>
                    currentNotice?.title === "Indexing in progress"
                      ? null
                      : currentNotice,
                  );
                }, 2000);
              }}
              onIndexCompleted={(message) => {
                setRepositoryRefreshKey((key) => key + 1);
                setNotice({
                  title: "Indexing completed",
                  message,
                  tone: "success",
                });
                window.setTimeout(() => {
                  setNotice((currentNotice) =>
                    currentNotice?.title === "Indexing completed"
                      ? null
                      : currentNotice,
                  );
                }, 5000);
              }}
              onIndexFailed={(message) => {
                setRepositoryRefreshKey((key) => key + 1);
                setNotice({ title: "Indexing failed", message, tone: "info" });
                window.setTimeout(() => {
                  setNotice((currentNotice) =>
                    currentNotice?.title === "Indexing failed"
                      ? null
                      : currentNotice,
                  );
                }, 5000);
              }}
            />
          ) : null}
          <RepositoryList
            refreshKey={repositoryRefreshKey}
            onOpenRepository={setSelectedRepository}
            searchQuery={searchQuery}
            onRepositoryCountChange={setRepositoryCount}
            isVisible={activeSection === "repositories"}
          />
          {activeSection === "repositories" && selectedRepository ? (
            <RepositoryChat
              repository={selectedRepository}
              onClose={() => setSelectedRepository(null)}
            />
          ) : null}
        </main>
      </div>
      {notice ? <GlassNotice notice={notice} /> : null}
    </div>
  );
}
