"use client";

import { FormEvent, useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

type Repository = {
  id: string;
  name: string;
  githubUrl: string;
  owner: string;
  repoName: string;
};

type ChatStatus = "idle" | "submitting" | "processing" | "completed" | "error";

type ChatQuestion = {
  id: string;
  question: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  answer?: string | null;
  sources?: unknown;
  createdAt: string;
};

type RepositoryChatProps = {
  repository: Repository;
  onClose: () => void;
};

function getSources(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function RepositoryChat({ repository, onClose }: RepositoryChatProps) {
  const [question, setQuestion] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatQuestion[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/chat?repositoryId=${encodeURIComponent(repository.id)}`,
          { credentials: "include", cache: "no-store" },
        );
        const result = (await response.json().catch(() => null)) as {
          questions?: ChatQuestion[];
        } | null;

        if (!response.ok) throw new Error("Unable to load chat history.");
        if (!cancelled) setHistory(result?.questions ?? []);
      } catch {
        if (!cancelled) setError("Unable to load chat history.");
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [historyRefreshKey, repository.id]);

  useEffect(() => {
    if (!questionId || status !== "processing") return;

    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chat/${questionId}`, {
          credentials: "include",
          cache: "no-store",
        });
        const result = (await response.json().catch(() => null)) as {
          question?: ChatQuestion;
          error?: string;
        } | null;

        if (!response.ok || !result?.question) {
          throw new Error(result?.error ?? "Unable to read the answer status.");
        }
        if (cancelled) return;

        if (result.question.status === "COMPLETED") {
          setQuestion("");
          setAnswer(result.question.answer ?? "No answer was returned.");
          setSources(getSources(result.question.sources));
          setStatus("completed");
          setHistory((current) =>
            current.map((item) =>
              item.id === result.question?.id ? result.question : item,
            ),
          );
          return;
        }

        if (result.question.status === "FAILED") {
          setError("The answer could not be generated. Please try again.");
          setStatus("error");
          return;
        }

        window.setTimeout(poll, 1500);
      } catch (pollError) {
        if (!cancelled) {
          setError(
            pollError instanceof Error
              ? pollError.message
              : "Unable to read the answer status.",
          );
          setStatus("error");
        }
      }
    };

    const timeout = window.setTimeout(poll, 700);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [questionId, status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setStatus("submitting");
    setActiveQuestion(trimmedQuestion);
    setAnswer(null);
    setSources([]);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repository.githubUrl,
          question: trimmedQuestion,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        question?: ChatQuestion;
        error?: string;
      } | null;

      if (!response.ok || !result?.question) {
        throw new Error(result?.error ?? "Unable to start the question.");
      }

      setQuestionId(result.question.id);
      setStatus("processing");
      setHistory((current) => [result.question!, ...current]);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to start the question.",
      );
      setStatus("error");
    }
  };

  const isBusy = status === "submitting" || status === "processing";

  const handleHistorySelect = (item: ChatQuestion) => {
    setQuestion("");
    setActiveQuestion(item.question);
    setQuestionId(item.id);
    setError(null);
    setSources(getSources(item.sources));
    setAnswer(item.answer ?? null);
    setStatus(
      item.status === "COMPLETED"
        ? "completed"
        : item.status === "FAILED"
          ? "error"
          : "processing",
    );
  };

  const handleCloseAnswer = () => {
    setQuestionId(null);
    setActiveQuestion(null);
    setAnswer(null);
    setSources([]);
    setError(null);
    setStatus("idle");
  };

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.2)] sm:p-8">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />
      <div className="relative grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-2xl border border-white/10 bg-black/15 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-sans text-sm font-semibold tracking-[0.18em] text-zinc-300 uppercase">
              History
            </p>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm text-zinc-500">
                {history.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setHistoryLoading(true);
                  setHistoryRefreshKey((key) => key + 1);
                }}
                className="font-sans text-xs font-semibold tracking-[0.12em] text-zinc-400 uppercase transition-colors hover:text-emerald-300"
              >
                Refresh
              </button>
            </div>
          </div>
          {historyLoading ? (
            <p className="mt-5 font-sans text-sm text-zinc-400">
              Loading questions...
            </p>
          ) : null}
          {!historyLoading && history.length === 0 ? (
            <p className="mt-5 font-sans text-sm leading-6 text-zinc-400">
              Your questions will appear here.
            </p>
          ) : null}
          <div className="chat-history-scrollbar mt-4 grid max-h-80 gap-2 overflow-y-auto pr-2">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleHistorySelect(item)}
                className={`rounded-xl border p-3 text-left transition-colors ${questionId === item.id ? "border-emerald-300/30 bg-emerald-300/10" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"}`}
              >
                <p className="line-clamp-2 font-sans text-sm leading-6 text-zinc-200">
                  {item.question}
                </p>
                <span
                  className={`mt-2 inline-block font-sans text-xs uppercase tracking-[0.14em] ${item.status === "COMPLETED" ? "text-emerald-300" : item.status === "FAILED" ? "text-rose-300" : "text-[#d09a82]"}`}
                >
                  {item.status.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="font-sans text-sm font-semibold tracking-[0.2em] text-emerald-300 uppercase">
                Repository chat
              </p>
              <h2 className="mt-2 font-sans text-3xl font-semibold tracking-[-0.03em] text-white">
                Ask about {repository.name}
              </h2>
              <p className="mt-1 font-sans text-sm text-zinc-400">
                {repository.owner}/{repository.repoName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="self-start rounded-lg border border-white/10 px-3 py-2 font-sans text-sm font-medium text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
            >
              Close
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="How does authentication work?"
              disabled={isBusy}
              className="h-14 min-w-0 flex-1 rounded-xl border border-white/15 bg-black/20 px-4 font-sans text-base text-white outline-none placeholder:text-zinc-600 focus:border-emerald-300/60 focus:bg-black/30 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isBusy || !question.trim()}
              className="h-14 rounded-xl bg-emerald-300 px-6 font-sans text-base font-semibold text-emerald-950 transition-colors hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "processing"
                ? "Thinking..."
                : status === "submitting"
                  ? "Sending..."
                  : "Ask question"}
            </button>
          </form>

          {status === "processing" ? (
            <p className="font-sans text-base text-emerald-200">
              Searching the indexed codebase and preparing an answer...
            </p>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 font-sans text-base text-rose-200">
              {error}
            </p>
          ) : null}
          {answer ? (
            <div className="relative rounded-2xl border border-white/15 bg-black/15 p-5">
              <button
                type="button"
                onClick={handleCloseAnswer}
                aria-label="Close answer"
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-300"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              {activeQuestion ? (
                <div className="border-b border-white/10 pb-5">
                  <p className="font-sans text-sm font-semibold tracking-[0.18em] text-zinc-400 uppercase">
                    Question
                  </p>
                  <p className="mt-3 whitespace-pre-wrap font-sans text-lg leading-8 text-white">
                    {activeQuestion}
                  </p>
                </div>
              ) : null}
              <p className="mt-5 font-sans text-sm font-semibold tracking-[0.18em] text-emerald-300 uppercase">
                Answer
              </p>
              <p className="mt-3 whitespace-pre-wrap font-sans text-base leading-8 text-zinc-200">
                {answer}
              </p>
              {sources.length ? (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="font-sans text-sm font-semibold tracking-[0.18em] text-zinc-400 uppercase">
                    Sources
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sources.map((source) => (
                      <span
                        key={source}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm text-zinc-300"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
