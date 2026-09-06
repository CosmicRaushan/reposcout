"use client";

import { FormEvent, useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

type SubmissionState =
  | { type: "idle" }
  | { type: "submitting" }
  | {
      type: "tracking";
      repositoryId: string;
      status: RepositoryStatus;
      message: string;
    }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type RepositoryStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

type RepositoryWorkspaceProps = {
  onIndexQueued: (message: string) => void;
  onIndexCompleted: (message: string) => void;
  onIndexFailed: (message: string) => void;
};

function isGithubRepositoryUrl(value: string) {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);

    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      segments.length === 2
    );
  } catch {
    return false;
  }
}

export function RepositoryWorkspace({
  onIndexQueued,
  onIndexCompleted,
  onIndexFailed,
}: RepositoryWorkspaceProps) {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>({
    type: "idle",
  });

  useEffect(() => {
    if (submission.type !== "tracking") return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/repositories/${submission.repositoryId}/status`,
          { credentials: "include", cache: "no-store" },
        );
        const result = (await response.json().catch(() => null)) as {
          status?: RepositoryStatus;
          error?: string;
        } | null;

        if (!response.ok || !result?.status) {
          throw new Error(result?.error ?? "Unable to read indexing status.");
        }

        if (cancelled) return;

        if (result.status === "COMPLETED") {
          setSubmission({
            type: "success",
            message: "Repository indexing completed.",
          });
          onIndexCompleted("Repository indexing completed successfully.");
          return;
        }

        if (result.status === "FAILED") {
          setSubmission({
            type: "error",
            message: "Repository indexing failed. Please try again.",
          });
          onIndexFailed(
            "The repository could not be indexed. Please try again.",
          );
          return;
        }

        setSubmission({
          ...submission,
          status: result.status,
          message:
            result.status === "PROCESSING"
              ? "Repository is being indexed..."
              : "Repository is waiting to be indexed...",
        });
      } catch (error) {
        if (!cancelled) {
          setSubmission({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to read indexing status.",
          });
        }
        return;
      }

      if (!cancelled) {
        window.setTimeout(pollStatus, 2000);
      }
    };

    const timeout = window.setTimeout(pollStatus, 1000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [onIndexCompleted, onIndexFailed, submission]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = repositoryUrl.trim();

    if (!isGithubRepositoryUrl(trimmedUrl)) {
      setSubmission({
        type: "error",
        message:
          "Enter a valid GitHub repository URL, for example github.com/owner/repo.",
      });
      return;
    }

    setSubmission({ type: "submitting" });

    try {
      const response = await fetch(`${API_URL}/api/index`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: trimmedUrl }),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
        repositoryId?: string;
        status?: RepositoryStatus;
      } | null;

      if (!response.ok) {
        throw new Error(
          result?.error ?? "Repository indexing could not be started.",
        );
      }

      if (!result?.repositoryId || !result.status) {
        throw new Error("The server did not return an indexing job.");
      }

      setSubmission({
        type: "tracking",
        repositoryId: result.repositoryId,
        status: result.status,
        message: "Repository indexing has been queued.",
      });
      onIndexQueued("Repository indexing has been queued.");
    } catch (error) {
      setSubmission({
        type: "error",
        message:
          error instanceof TypeError
            ? "The server is unavailable. Make sure the API is running on port 3000."
            : error instanceof Error
              ? error.message
              : "Repository indexing could not be started.",
      });
    }
  };

  const isSubmitting =
    submission.type === "submitting" || submission.type === "tracking";

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.2)] sm:p-8">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d09a82]/70 to-transparent" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-56 rounded-full border border-[#b97861]/10 bg-[#b97861]/5" />

      <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-[#d09a82]/25 bg-[#b97861]/10 text-[#d09a82]">
            <svg
              aria-hidden="true"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18m9-9H3"
              />
            </svg>
          </div>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-[#d09a82] uppercase">
            Add a repository
          </p>
          <h2 className="mt-3 max-w-md font-sans text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Bring your codebase into focus.
          </h2>
          <p className="mt-3 max-w-md font-sans text-sm leading-6 text-zinc-400">
            RepoScout will index the repository so you can ask focused questions
            about its code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label
            htmlFor="repository-url"
            className="font-sans text-sm font-medium text-zinc-300"
          >
            GitHub repository URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h-1.5a3 3 0 0 0 0 6h1.5m7.5 0h1.5a3 3 0 0 0 0-6h-1.5m-8.25 3h9"
                />
              </svg>
              <input
                id="repository-url"
                type="url"
                value={repositoryUrl}
                onChange={(event) => {
                  setRepositoryUrl(event.target.value);
                  if (submission.type !== "idle")
                    setSubmission({ type: "idle" });
                }}
                placeholder="https://github.com/owner/repository"
                autoComplete="url"
                className="h-12 w-full rounded-xl border border-white/15 bg-black/20 pl-11 pr-4 font-sans text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#d09a82]/70 focus:bg-black/30 focus:ring-2 focus:ring-[#b97861]/15"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-xl bg-[#d09a82] px-5 font-sans text-sm font-semibold text-[#241817] shadow-[0_10px_30px_rgba(185,120,97,0.18)] transition-all hover:bg-[#e2b09b] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Starting..." : "Start indexing"}
            </button>
          </div>

          <div aria-live="polite" className="min-h-6 pt-1">
            {submission.type === "tracking" ? (
              <p className="flex items-center gap-2 font-sans text-sm text-[#e2b09b]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#d09a82]" />
                {submission.message}
              </p>
            ) : null}
            {submission.type === "success" ? (
              <p className="flex items-center gap-2 font-sans text-sm text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-300" />
                {submission.message}
              </p>
            ) : null}
            {submission.type === "error" ? (
              <p className="font-sans text-sm leading-5 text-rose-300">
                {submission.message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
