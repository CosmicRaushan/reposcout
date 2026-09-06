"use client";

import type { ReactNode } from "react";

type DashboardSection = "overview" | "repositories";

type DashboardSidebarProps = {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
};

function GridIcon() {
  return (
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
        d="M4.5 5.5h6v6h-6v-6Zm9 0h6v6h-6v-6Zm-9 9h6v6h-6v-6Zm9 0h6v6h-6v-6Z"
      />
    </svg>
  );
}

function RepositoryIcon() {
  return (
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
        d="M4.5 6.75h6l1.5 2h7.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

export function DashboardSidebar({
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  const items: Array<{ id: DashboardSection; label: string; icon: ReactNode }> =
    [
      { id: "overview", label: "Overview", icon: <GridIcon /> },
      { id: "repositories", label: "Repositories", icon: <RepositoryIcon /> },
    ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/10 bg-[#151416] px-4 py-6 lg:flex">
      <div className="border-b border-white/10 px-3 pb-7">
        <p className="font-sans text-2xl font-semibold tracking-[-0.04em] text-[#c98970]">
          Reposcout
        </p>
        <p className="mt-2 font-sans text-xs text-zinc-600">
          Codebase intelligence
        </p>
      </div>
      <nav className="mt-8 space-y-2" aria-label="Dashboard navigation">
        <p className="mb-3 px-3 font-sans text-[10px] font-semibold tracking-[0.18em] text-zinc-600 uppercase">
          Workspace
        </p>
        {items.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-sans text-sm transition-colors ${active ? "bg-[#c98970]/12 font-semibold text-[#e2b09b]" : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"}`}
            >
              <span className={active ? "text-[#d09a82]" : "text-zinc-600"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
