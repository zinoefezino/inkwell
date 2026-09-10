"use client";

import { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  File01Icon,
  Copy01Icon,
  Tick01Icon,
  Loading03Icon,
  InboxIcon,
  PlusSignIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Header from "@/components/Header";

type GenType = "proposal" | "cv";

interface Generation {
  _id: string;
  type: GenType;
  posting: string;
  output: string;
  createdAt: string;
}

const FILTERS: { label: string; value: "all" | GenType }[] = [
  { label: "All", value: "all" },
  { label: "Proposals", value: "proposal" },
  { label: "CVs", value: "cv" },
];

function excerpt(text: string, len = 90) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > len ? clean.slice(0, len) + "…" : clean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | GenType>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/generations");
        const data = await res.json();
        setGenerations(data.generations || []);
        if (data.generations?.length) setSelectedId(data.generations[0]._id);
      } catch {
        // fail quietly into empty state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list =
      filter === "all"
        ? generations
        : generations.filter((g) => g.type === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((g) => g.posting.toLowerCase().includes(q));
    }
    return list;
  }, [generations, filter, search]);

  useEffect(() => {
    if (selectedId && !filtered.some((g) => g._id === selectedId)) {
      setSelectedId(filtered[0]?._id ?? null);
    }
  }, [filtered, selectedId]);

  const selected = generations.find((g) => g._id === selectedId) || null;

  function handleCopy() {
    if (!selected) return;
    navigator.clipboard.writeText(selected.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const hasSearch = search.trim().length > 0;
  const emptyMessage = hasSearch
    ? "No saved items match that search."
    : filter === "all"
      ? "Nothing here yet. Once you save a proposal or a CV, it'll show up in this archive."
      : `No ${filter === "proposal" ? "proposals" : "CVs"} saved yet.`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#14171F] text-[#14171F] dark:text-[#F2F2EE]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {/* TITLE + ACTIONS — stacked on mobile, one row on md+ */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-medium">Your archive</h1>
            <p className="text-sm text-[#8A8A82] dark:text-[#9A9A92] mt-1">
              {generations.length === 0
                ? "Every proposal and CV you've saved will show up here."
                : `${generations.length} saved so far.`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Link
              href="/compose"
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#3B4E90] rounded-full pl-3.5 pr-4 py-2 hover:opacity-90 transition-opacity"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={16}
                color="#ffffff"
                strokeWidth={2}
              />
              Proposal
            </Link>
            <Link
              href="/cv"
              className="flex items-center gap-1.5 text-sm font-medium text-[#3B4E90] dark:text-[#8FA3E0] border border-[#3B4E90] dark:border-[#8FA3E0] rounded-full pl-3.5 pr-4 py-2 hover:bg-[#3B4E90]/5 dark:hover:bg-[#8FA3E0]/10 transition-colors"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={16}
                color="#3B4E90"
                strokeWidth={2}
              />
              CV
            </Link>
          </div>
        </div>

        {/* FILTER PILLS — horizontally scrollable, never wraps/clips */}
        <div className="mb-4 md:mb-5 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 overflow-x-auto">
          <div className="flex gap-1 bg-[#FAFAF8] dark:bg-[#1B1F29] rounded-full p-1 border border-[#E4E4E0] dark:border-[#2A2E38] w-fit">
            {FILTERS.map((f) => {
              const count =
                f.value === "all"
                  ? generations.length
                  : generations.filter((g) => g.type === f.value).length;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`text-sm px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    filter === f.value
                      ? "bg-[#3B4E90] text-white"
                      : "text-[#6B6B63] dark:text-[#B5B5AC] hover:text-[#3B4E90] dark:hover:text-[#8FA3E0]"
                  }`}
                >
                  {f.label}
                  <span
                    className={
                      filter === f.value
                        ? "text-white/70"
                        : "text-[#B9B9AF] dark:text-[#6B6B63]"
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#8A8A82] dark:text-[#9A9A92]">
            <HugeiconsIcon
              icon={Loading03Icon}
              size={28}
              color="currentColor"
              strokeWidth={1.5}
              className="animate-spin"
            />
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center border border-dashed border-[#E4E4E0] dark:border-[#2A2E38] rounded-lg">
            <HugeiconsIcon
              icon={InboxIcon}
              size={36}
              color="#B9B9AF"
              strokeWidth={1.5}
            />
            <p className="text-[#8A8A82] dark:text-[#9A9A92] text-sm mt-4 max-w-xs">
              Nothing here yet. Once you save a proposal or a CV, it'll show up
              in this archive.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-5 w-full sm:w-auto">
              <Link
                href="/compose"
                className="text-sm font-medium text-white bg-[#3B4E90] rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity text-center"
              >
                New proposal
              </Link>
              <Link
                href="/cv"
                className="text-sm font-medium text-[#3B4E90] dark:text-[#8FA3E0] border border-[#3B4E90] dark:border-[#8FA3E0] rounded-full px-5 py-2.5 hover:bg-[#3B4E90]/5 dark:hover:bg-[#8FA3E0]/10 transition-colors text-center"
              >
                New CV
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* SEARCH — above the list */}
            <div className="relative mb-4 md:mb-5 md:max-w-sm">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by posting..."
                className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded-full pl-4 pr-10 py-2.5 sm:py-2 text-sm bg-white dark:bg-[#14171F] placeholder:text-[#B9B9AF] dark:placeholder:text-[#6B6B63] focus:outline-none focus:ring-2 focus:ring-[#3B4E90]/30 dark:focus:ring-[#8FA3E0]/30 [&::-webkit-search-cancel-button]:hidden"
              />
              {search.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-[#8A8A82] dark:text-[#9A9A92] hover:text-[#3B4E90] dark:hover:text-[#8FA3E0] hover:bg-[#FAFAF8] dark:hover:bg-[#1B1F29] transition-colors text-base leading-none"
                >
                  ×
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center border border-dashed border-[#E4E4E0] dark:border-[#2A2E38] rounded-lg">
                <HugeiconsIcon
                  icon={InboxIcon}
                  size={36}
                  color="#B9B9AF"
                  strokeWidth={1.5}
                />
                <p className="text-[#8A8A82] dark:text-[#9A9A92] text-sm mt-4 max-w-xs">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-[340px_1fr] gap-4 md:gap-8">
                {/* LIST — hidden on mobile once something is selected, always visible md+ */}
                <div
                  className={`flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1 ${
                    selectedId ? "hidden md:flex" : "flex"
                  }`}
                >
                  {filtered.map((g) => {
                    const typeColor =
                      g.type === "proposal"
                        ? "bg-[#3B4E90] dark:bg-[#8FA3E0]"
                        : "bg-[#C9A227]";
                    return (
                      <button
                        key={g._id}
                        onClick={() => setSelectedId(g._id)}
                        className={`relative w-full text-left rounded-md border pl-5 pr-4 py-3 transition-all overflow-hidden ${
                          selectedId === g._id
                            ? "border-[#3B4E90] dark:border-[#8FA3E0] bg-[#3B4E90]/3 dark:bg-[#8FA3E0]/10 shadow-sm"
                            : "border-[#E4E4E0] dark:border-[#2A2E38] hover:border-[#3B4E90]/30 dark:hover:border-[#8FA3E0]/30 hover:bg-[#FAFAF8] dark:hover:bg-[#1B1F29]"
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-0 bottom-0 w-0.75 ${typeColor}`}
                        />
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <HugeiconsIcon
                              icon={
                                g.type === "proposal" ? Mail01Icon : File01Icon
                              }
                              size={15}
                              color="#3B4E90"
                              strokeWidth={1.5}
                              className="shrink-0"
                            />
                            <span className="text-[13px] font-medium truncate text-[#4A4A44] dark:text-[#D8D8D2]">
                              {excerpt(g.posting, 42)}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8A8A82] dark:text-[#9A9A92] shrink-0">
                            {formatDate(g.createdAt)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* DETAIL — hidden on mobile until something is selected, always visible md+ */}
                <div className={selectedId ? "block" : "hidden md:block"}>
                  {selected && (
                    <>
                      {/* Back button — mobile only */}
                      <button
                        onClick={() => setSelectedId(null)}
                        className="flex items-center gap-1.5 text-sm text-[#3B4E90] dark:text-[#8FA3E0] mb-4 md:hidden -ml-1 py-1"
                      >
                        <HugeiconsIcon
                          icon={ArrowLeft01Icon}
                          size={18}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                        Back to archive list
                      </button>

                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[11px] tracking-wide uppercase text-[#8A8A82] dark:text-[#9A9A92]">
                              {selected.type === "proposal"
                                ? "the proposal"
                                : "the tailored cv"}{" "}
                              · {formatDate(selected.createdAt)}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                selected.type === "proposal"
                                  ? "bg-[#3B4E90]/10 text-[#3B4E90] dark:bg-[#8FA3E0]/15 dark:text-[#8FA3E0]"
                                  : "bg-[#C9A227]/15 text-[#C9A227]"
                              }`}
                            >
                              {selected.type === "proposal" ? "Proposal" : "CV"}
                            </span>
                          </div>
                          <p className="text-[12.5px] text-[#8A8A82] dark:text-[#9A9A92] leading-relaxed">
                            {excerpt(selected.posting, 160)}
                          </p>
                        </div>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 text-xs text-[#3B4E90] dark:text-[#8FA3E0] hover:opacity-70 shrink-0 mt-1 py-1"
                        >
                          <HugeiconsIcon
                            icon={copied ? Tick01Icon : Copy01Icon}
                            size={18}
                            color="currentColor"
                            strokeWidth={1.5}
                          />
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-md p-4 md:p-6 min-h-75 md:min-h-95 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm md:text-[14.5px] leading-[1.7]">
                        {selected.output}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}