"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

type RepositoryStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type Repository = {
  id: string;
  name: string;
  githubUrl: string;
  owner: string;
  repoName: string;
  status: RepositoryStatus;
  updatedAt: string;
};

type RepositoryListProps = {
  refreshKey: number;
  onOpenRepository: (repository: Repository) => void;
  searchQuery?: string;
  onRepositoryCountChange?: (count: number) => void;
  isVisible?: boolean;
};

const statusStyles: Record<RepositoryStatus, string> = {
  PENDING: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  PROCESSING: "border-[#d09a82]/30 bg-[#d09a82]/10 text-[#e2b09b]",
  COMPLETED: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  FAILED: "border-rose-300/25 bg-rose-300/10 text-rose-200",
};

function statusLabel(status: RepositoryStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function RepositoryList({
  refreshKey,
  onOpenRepository,
  searchQuery = "",
  onRepositoryCountChange,
  isVisible = true,
}: RepositoryListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRepositories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/repositories`, {
          credentials: "include",
        });
        const result = (await response.json().catch(() => null)) as {
          repositories?: Repository[];
          error?: string;
        } | null;

        if (!response.ok) {
          throw new Error(result?.error ?? "Unable to load repositories.");
        }

        if (!cancelled) {
          setRepositories(result?.repositories ?? []);
          onRepositoryCountChange?.(result?.repositories?.length ?? 0);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load repositories.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadRepositories();
    const interval = window.setInterval(() => {
      void loadRepositories();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [onRepositoryCountChange, refreshKey]);

  const handleDelete = async (repository: Repository) => {
    if (!window.confirm(`Remove ${repository.name} from your workspace?`)) {
      return;
    }

    setDeletingId(repository.id);
    try {
      const response = await fetch(
        `${API_URL}/api/repositories/${repository.id}`,
        { method: "DELETE", credentials: "include" },
      );

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
          message?: string;
        } | null;
        throw new Error(
          result?.error ?? result?.message ?? "Unable to delete repository.",
        );
      }

      setRepositories((current) =>
        current.filter((item) => item.id !== repository.id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete repository.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleRepositories = repositories.filter((repository) =>
    `${repository.name} ${repository.owner} ${repository.repoName}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <section
      className={`${isVisible ? "" : "hidden"} relative mt-6 overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.2)] sm:p-8`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="relative flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-[#d09a82] uppercase">
            Your repositories
          </p>
          <h2 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.03em] text-white">
            Connected codebases
          </h2>
        </div>
        <p className="font-sans text-xs text-zinc-500">Updates automatically</p>
      </div>

      {isLoading ? (
        <div className="mt-8 flex items-center gap-3 font-sans text-sm text-zinc-400">
          <span className="size-2 animate-pulse rounded-full bg-[#d09a82]" />
          Loading repositories...
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 font-sans text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && repositories.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-black/10 px-5 py-8 text-center">
          <p className="font-sans text-sm font-medium text-zinc-300">
            No repositories connected yet.
          </p>
          <p className="mt-2 font-sans text-xs text-zinc-500">
            Add a GitHub repository above to start indexing.
          </p>
        </div>
      ) : null}

      <div className="relative mt-6 grid gap-3">
        {visibleRepositories.map((repository) => (
          <article
            key={repository.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/15 p-4 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] font-sans text-sm font-semibold text-[#d09a82]">
                {repository.owner.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-semibold text-white">
                  {repository.name}
                </p>
                <a
                  href={repository.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate font-sans text-xs text-zinc-500 transition-colors hover:text-[#e2b09b]"
                >
                  {repository.owner}/{repository.repoName}
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span
                className={`rounded-full border px-2.5 py-1 font-sans text-xs font-medium ${statusStyles[repository.status]}`}
              >
                {statusLabel(repository.status)}
              </span>
              <span className="hidden font-sans text-xs text-zinc-600 md:block">
                {new Date(repository.updatedAt).toLocaleDateString()}
              </span>
              {repository.status === "COMPLETED" ? (
                <button
                  type="button"
                  onClick={() => onOpenRepository(repository)}
                  className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 font-sans text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-300/20"
                >
                  Open chat
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void handleDelete(repository)}
                disabled={deletingId === repository.id}
                className="rounded-lg border border-white/10 px-3 py-1.5 font-sans text-xs font-medium text-zinc-400 transition-colors hover:border-rose-300/30 hover:bg-rose-300/10 hover:text-rose-200 disabled:cursor-wait disabled:opacity-50"
              >
                {deletingId === repository.id ? "Removing..." : "Remove"}
              </button>
            </div>
          </article>
        ))}
        {!isLoading &&
        !error &&
        repositories.length > 0 &&
        visibleRepositories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 px-5 py-8 text-center font-sans text-sm text-zinc-500">
            No repositories match “{searchQuery}”.
          </div>
        ) : null}
      </div>
    </section>
  );
}
