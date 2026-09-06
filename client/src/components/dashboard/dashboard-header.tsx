"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

function getInitials(name: string, email: string) {
  const source = name.trim() || email;
  const initials = source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "U";
}

export function DashboardHeader({
  user,
  searchValue = "",
  onSearchChange,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace("/"),
      },
    });
  };

  return (
    <header className="relative z-20 border-b border-white/10 bg-[#111113]/75 shadow-[0_12px_45px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto flex min-h-20 w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <p className="shrink-0 font-sans text-xl font-semibold tracking-[-0.04em] text-[#c98970] sm:hidden">
            Reposcout
          </p>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path strokeLinecap="round" d="m16 16 4 4" />
            </svg>
            <input
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search repositories..."
              aria-label="Search repositories"
              className="h-10 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 font-sans text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#d09a82]/60"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500 transition-colors hover:border-white/20 hover:text-zinc-200"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8.5h18C21 16 18 16 18 9ZM10 20h4"
              />
            </svg>
          </button>
          <div className="group relative">
            <button
              type="button"
              aria-label={`Open account menu for ${user.name}`}
              className="flex size-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/[0.08] font-sans text-sm font-semibold tracking-[0.04em] text-[#d09a82] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_25px_rgba(0,0,0,0.3)] transition-all hover:border-[#b97861]/70 hover:bg-[#b97861]/15 hover:text-[#e2b09b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b97861]"
            >
              {user.image ? (
                <span
                  className="size-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${user.image})` }}
                />
              ) : (
                getInitials(user.name, user.email)
              )}
            </button>

            <div className="invisible absolute right-0 top-[calc(100%+0.9rem)] z-30 w-72 translate-y-2 rounded-2xl border border-white/20 bg-[#1a1a1d]/95 p-4 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.16)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#d09a82]/70 to-transparent" />
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#d09a82] text-sm font-bold text-[#241817]">
                  {user.image ? (
                    <span
                      className="size-full rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${user.image})` }}
                    />
                  ) : (
                    getInitials(user.name, user.email)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-sans text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate font-sans text-xs text-zinc-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 font-sans text-sm font-semibold text-zinc-300 transition-colors hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline-2 focus-visible:outline-[#d09a82]"
              >
                Log out
                <span aria-hidden="true">-&gt;</span>
              </button>
              <button
                type="button"
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-sans text-sm text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.75 13.2 6l2.5.35-1.8 1.8.43 2.5L12 9.45l-2.33 1.2.43-2.5-1.8-1.8L10.8 6 12 3.75ZM5.5 13.5h13M5.5 17h8M5.5 20.5h5"
                  />
                </svg>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
