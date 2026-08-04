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

  const filtered = useMemo(
    () =>
      filter === "all"
        ? generations
        : generations.filter((g) => g.type === filter),
    [generations, filter],
  );

  const selected = generations.find((g) => g._id === selectedId) || null;

  function handleCopy() {
    if (!selected) return;
    navigator.clipboard.writeText(selected.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-white text-[#14171F]">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium">Your archive</h1>
            <p className="text-sm text-[#8A8A82] mt-1">
              {generations.length === 0
                ? "Every proposal and CV you've sealed will show up here."
                : `${generations.length} sealed so far.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/compose"
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#2B3A67] rounded-full pl-3.5 pr-4 py-2 hover:opacity-90 transition-opacity"
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
              className="flex items-center gap-1.5 text-sm font-medium text-[#2B3A67] border border-[#2B3A67] rounded-full pl-3.5 pr-4 py-2 hover:bg-[#2B3A67]/5 transition-colors"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={16}
                color="#2B3A67"
                strokeWidth={2}
              />
              CV
            </Link>
            <div className="flex gap-1 bg-[#FAFAF8] rounded-full p-1 border border-[#E4E4E0] ml-2">
              {FILTERS.map((f) => {
                const count =
                  f.value === "all"
                    ? generations.length
                    : generations.filter((g) => g.type === f.value).length;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`text-sm px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                      filter === f.value
                        ? "bg-[#2B3A67] text-white"
                        : "text-[#6B6B63] hover:text-[#2B3A67]"
                    }`}
                  >
                    {f.label}
                    <span
                      className={
                        filter === f.value ? "text-white/70" : "text-[#B9B9AF]"
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#8A8A82]">
            <HugeiconsIcon
              icon={Loading03Icon}
              size={28}
              color="#8A8A82"
              strokeWidth={1.5}
              className="animate-spin"
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#E4E4E0] rounded-lg">
            <HugeiconsIcon
              icon={InboxIcon}
              size={36}
              color="#B9B9AF"
              strokeWidth={1.5}
            />
            <p className="text-[#8A8A82] text-sm mt-4 max-w-xs">
              {filter === "all"
                ? "Nothing here yet. Once you seal a proposal or a CV, it'll show up in this archive."
                : `No ${filter === "proposal" ? "proposals" : "CVs"} sealed yet.`}
            </p>
            <div className="flex gap-3 mt-5">
              <Link
                href="/compose"
                className="text-sm font-medium text-white bg-[#2B3A67] rounded-full px-5 py-2 hover:opacity-90 transition-opacity"
              >
                New proposal
              </Link>
              <Link
                href="/cv"
                className="text-sm font-medium text-[#2B3A67] border border-[#2B3A67] rounded-full px-5 py-2 hover:bg-[#2B3A67]/5 transition-colors"
              >
                New CV
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-[340px_1fr] gap-8">
            {/* LIST */}
            <div className="flex flex-col gap-2">
              {filtered.map((g) => (
                <button
                  key={g._id}
                  onClick={() => setSelectedId(g._id)}
                  className={`relative text-left rounded-md border p-4 pl-5 transition-all ${
                    selectedId === g._id
                      ? "border-[#2B3A67] bg-[#2B3A67]/[0.03] shadow-sm"
                      : "border-[#E4E4E0] hover:border-[#2B3A67]/30 hover:bg-[#FAFAF8]"
                  }`}
                >
                  {selectedId === g._id && (
                    <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#C9A227]" />
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <HugeiconsIcon
                      icon={g.type === "proposal" ? Mail01Icon : File01Icon}
                      size={16}
                      color="#2B3A67"
                      strokeWidth={1.5}
                    />
                    <span className="text-[10.5px] tracking-wide uppercase text-[#8A8A82]">
                      {g.type === "proposal" ? "proposal" : "cv"} ·{" "}
                      {formatDate(g.createdAt)}
                    </span>
                  </div>
                  <p className="text-[13px] leading-snug text-[#4A4A44]">
                    {excerpt(g.posting)}
                  </p>
                </button>
              ))}
            </div>

            {/* DETAIL */}
            <div>
              {selected && (
                <>
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div>
                      <span className="text-[11px] tracking-wide uppercase text-[#8A8A82] block mb-1.5">
                        {selected.type === "proposal"
                          ? "the proposal"
                          : "the tailored cv"}{" "}
                        · {formatDate(selected.createdAt)}
                      </span>
                      <p className="text-[12.5px] text-[#8A8A82] leading-relaxed">
                        {excerpt(selected.posting, 160)}
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-xs text-[#2B3A67] hover:opacity-70 shrink-0 mt-1"
                    >
                      <HugeiconsIcon
                        icon={copied ? Tick01Icon : Copy01Icon}
                        size={18}
                        color="#2B3A67"
                        strokeWidth={1.5}
                      />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="border border-[#E4E4E0] rounded-md p-6 min-h-[380px] whitespace-pre-wrap text-[14.5px] leading-[1.7]">
                    {selected.output}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
