"use client";

// Keep in sync with app/dashboard/page.tsx (and compose/cv screens for flows)

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  File01Icon,
  PlusSignIcon,
  Moon02Icon,
  Sun03Icon,
  Copy01Icon,
  ArrowLeft01Icon,
  ArrowDown01Icon,
  FeatherIcon,
  Loading03Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";

type DemoScreen =
  | "archive"
  | "compose"
  | "generating-proposal"
  | "result-proposal"
  | "cv"
  | "generating-cv"
  | "result-cv"
  | "detail";

type FilterValue = "all" | "proposal" | "cv";
type CvInputMode = "paste" | "upload";

type ArchiveRow = {
  id: string;
  type: "proposal" | "cv";
  label: string;
  posting: string;
  date: string;
  dateFull: string;
  body: string;
};

const FADE_MS = 280;
const GEN_MS = 800;
const STEP_HOLD_MS = 2800;

const SAMPLE_POSTING =
  "Senior Frontend Engineer — Acme Labs is hiring a React/TypeScript engineer to own product UI, accessibility, and performance.";

const SAMPLE_VOICE = {
  name: "Alex Chen",
  skills: "React, TypeScript, Next.js, accessibility",
};

const SAMPLE_CV_TEXT =
  "Alex Chen — Frontend Engineer\nNorthwind Digital, 2021–Present\nReact · TypeScript · Next.js · CSS · A11y";

const PROPOSAL_RESULT =
  "Dear Hiring Team,\n\nI'm excited to apply for the Senior Frontend role at Acme Labs. I've shipped product UIs with React and TypeScript, with a focus on accessible patterns and performance.\n\nAt Northwind Digital I led a redesign that cut load time by ~40% — work that maps closely to what you're building.\n\n— Alex Chen";

const CV_RESULT =
  "Alex Chen\nFrontend Engineer · Remote\n\nExperience\nNorthwind Digital — Frontend Engineer · 2021–Present\n• Led React/TypeScript UI for core product flows\n• Improved Lighthouse performance on checkout\n• Partnered with design on accessible components\n\nSkills\nReact · TypeScript · Next.js · CSS · A11y";

const ARCHIVE_ROWS: ArchiveRow[] = [
  {
    id: "p1",
    type: "proposal",
    label: "Senior Frontend Engineer — Acme Labs…",
    posting: SAMPLE_POSTING,
    date: "Sep 8",
    dateFull: "Sep 8, 2026",
    body: PROPOSAL_RESULT,
  },
  {
    id: "c1",
    type: "cv",
    label: "Product design lead — Northwind…",
    posting: "Product design lead — Northwind is looking for a systems-minded designer…",
    date: "Sep 6",
    dateFull: "Sep 6, 2026",
    body: CV_RESULT,
  },
  {
    id: "p2",
    type: "proposal",
    label: "E-commerce rebuild — Meridian…",
    posting: "E-commerce rebuild — Meridian needs a proposal for a Next.js storefront…",
    date: "Sep 3",
    dateFull: "Sep 3, 2026",
    body: PROPOSAL_RESULT,
  },
  {
    id: "c2",
    type: "cv",
    label: "Marketing manager — Brightly…",
    posting: "Marketing manager — Brightly seeks a growth-focused CV tailored to B2B SaaS…",
    date: "Aug 28",
    dateFull: "Aug 28, 2026",
    body: CV_RESULT,
  },
  {
    id: "p3",
    type: "proposal",
    label: "Platform engineer — Cobalt…",
    posting: "Platform engineer — Cobalt is hiring for infra-minded frontend work…",
    date: "Aug 22",
    dateFull: "Aug 22, 2026",
    body: PROPOSAL_RESULT,
  },
  {
    id: "c3",
    type: "cv",
    label: "UX writer — Harbor…",
    posting: "UX writer — Harbor wants a tailored CV for product content roles…",
    date: "Aug 18",
    dateFull: "Aug 18, 2026",
    body: CV_RESULT,
  },
];

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Proposals", value: "proposal" },
  { label: "CVs", value: "cv" },
];

/** Auto-play tour steps when idle (not hovered / focused). */
const TOUR: { screen: DemoScreen; holdMs: number }[] = [
  { screen: "archive", holdMs: STEP_HOLD_MS },
  { screen: "compose", holdMs: STEP_HOLD_MS },
  { screen: "generating-proposal", holdMs: GEN_MS },
  { screen: "result-proposal", holdMs: STEP_HOLD_MS },
  { screen: "archive", holdMs: STEP_HOLD_MS },
  { screen: "cv", holdMs: STEP_HOLD_MS },
  { screen: "generating-cv", holdMs: GEN_MS },
  { screen: "result-cv", holdMs: STEP_HOLD_MS },
];

type ProductPhoneDemoProps = {
  className?: string;
};

export default function ProductPhoneDemo({ className = "" }: ProductPhoneDemoProps) {
  const [screen, setScreen] = useState<DemoScreen>("archive");
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(true);
  const [cvMode, setCvMode] = useState<CvInputMode>("paste");
  const [tourIndex, setTourIndex] = useState(0);

  const screenRef = useRef<DemoScreen>("archive");
  const tourIndexRef = useRef(0);
  const genTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const tourTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      if (genTimerRef.current) window.clearTimeout(genTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (tourTimerRef.current) window.clearTimeout(tourTimerRef.current);
    };
  }, []);

  const markInteracted = useCallback(() => {
    setInteracted(true);
    // Prefer click-driven after first tap — stop auto tour for this session
    setPaused(true);
  }, []);

  const goTo = useCallback(
    (next: DemoScreen, opts?: { fromTour?: boolean }) => {
      if (!opts?.fromTour) {
        markInteracted();
        if (tourTimerRef.current) {
          window.clearTimeout(tourTimerRef.current);
          tourTimerRef.current = null;
        }
      }
      if (genTimerRef.current) {
        window.clearTimeout(genTimerRef.current);
        genTimerRef.current = null;
      }
      if (fadeTimerRef.current) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      const apply = () => {
        screenRef.current = next;
        setScreen(next);
        setVisible(true);
        if (next === "generating-proposal") {
          genTimerRef.current = window.setTimeout(() => {
            goTo("result-proposal", opts);
          }, GEN_MS);
        } else if (next === "generating-cv") {
          genTimerRef.current = window.setTimeout(() => {
            goTo("result-cv", opts);
          }, GEN_MS);
        }
      };

      if (reduceMotion) {
        apply();
        return;
      }
      setVisible(false);
      fadeTimerRef.current = window.setTimeout(apply, FADE_MS);
    },
    [markInteracted, reduceMotion]
  );

  // Auto-play scripted tour when idle (not hovered) and motion allowed
  useEffect(() => {
    if (reduceMotion || paused || interacted) return;

    const step = TOUR[tourIndexRef.current];
    const hold = step?.holdMs ?? STEP_HOLD_MS;

    tourTimerRef.current = window.setTimeout(() => {
      const nextIdx = (tourIndexRef.current + 1) % TOUR.length;
      tourIndexRef.current = nextIdx;
      setTourIndex(nextIdx);
      const nextScreen = TOUR[nextIdx].screen;
      // Soft navigation for tour (don't mark interacted)
      if (genTimerRef.current) {
        window.clearTimeout(genTimerRef.current);
        genTimerRef.current = null;
      }
      if (fadeTimerRef.current) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      const apply = () => {
        screenRef.current = nextScreen;
        setScreen(nextScreen);
        setVisible(true);
        if (nextScreen === "generating-proposal") {
          // tour step already holds GEN_MS; still mirror generating UI
        } else if (nextScreen === "generating-cv") {
          // same
        }
      };
      if (reduceMotion) {
        apply();
      } else {
        setVisible(false);
        fadeTimerRef.current = window.setTimeout(apply, FADE_MS);
      }
    }, hold);

    return () => {
      if (tourTimerRef.current) {
        window.clearTimeout(tourTimerRef.current);
        tourTimerRef.current = null;
      }
    };
  }, [reduceMotion, paused, interacted, tourIndex]);

  const filteredRows = useMemo(() => {
    let list =
      filter === "all"
        ? ARCHIVE_ROWS
        : ARCHIVE_ROWS.filter((r) => r.type === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.posting.toLowerCase().includes(q) ||
          r.label.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  useEffect(() => {
    if (selectedId && !filteredRows.some((r) => r.id === selectedId)) {
      setSelectedId(filteredRows[0]?.id ?? null);
    }
  }, [filteredRows, selectedId]);

  const counts = useMemo(
    () => ({
      all: ARCHIVE_ROWS.length,
      proposal: ARCHIVE_ROWS.filter((r) => r.type === "proposal").length,
      cv: ARCHIVE_ROWS.filter((r) => r.type === "cv").length,
    }),
    []
  );

  const selectedRow =
    ARCHIVE_ROWS.find((r) => r.id === selectedId) || ARCHIVE_ROWS[0];

  const openDetail = (id: string) => {
    setSelectedId(id);
    goTo("detail");
  };

  const showChrome =
    screen === "archive" ||
    screen === "detail" ||
    screen === "compose" ||
    screen === "cv" ||
    screen === "generating-proposal" ||
    screen === "generating-cv" ||
    screen === "result-proposal" ||
    screen === "result-cv";

  return (
    <div
      className={`relative z-10 flex ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!interacted) setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          if (!interacted) setPaused(false);
        }
      }}
    >
      {/* Large hero device — cut-off phone frame */}
      <div className="relative w-full max-w-95 aspect-380/600 rounded-[3.2rem] border-10 border-[#14171F] dark:border-[#2A2E38] bg-white dark:bg-[#14171F] shadow-2xl overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-27.5 h-7.5 bg-black rounded-full z-20 pointer-events-none" />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-8 z-20 pointer-events-none">
          <span className="text-[13px] font-semibold text-[#14171F] dark:text-white">
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <StatusIcons />
          </div>
        </div>

        <div className="relative px-5 pt-14 pb-8 h-full flex flex-col">
          {showChrome && (
            <div className="flex items-center mb-4 shrink-0 border-b border-[#E4E4E0] dark:border-[#2A2E38] pb-3 -mx-1 px-1">
              <img src="/logo8.png" alt="Inkwell logo" className="w-auto h-12" />
              <div className="ml-auto flex items-center gap-2">
                <span className="w-7 h-7 rounded-full border border-[#E4E4E0] dark:border-[#2A2E38] flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Sun03Icon}
                    size={13}
                    color="#4A4A44"
                    strokeWidth={1.5}
                    className="dark:hidden"
                  />
                  <HugeiconsIcon
                    icon={Moon02Icon}
                    size={13}
                    color="#D8D8D2"
                    strokeWidth={1.5}
                    className="hidden dark:block"
                  />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#3B4E90] dark:bg-[#8FA3E0] flex items-center justify-center text-[11px] font-medium text-white dark:text-[#14171F]">
                  A
                </span>
              </div>
            </div>
          )}

          <div
            className={`flex-1 min-h-0 flex flex-col overflow-hidden transition-opacity duration-[280ms] ease-out ${
              visible || reduceMotion ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            {screen === "archive" && (
              <ArchiveFrame
                filter={filter}
                setFilter={(f) => {
                  markInteracted();
                  setFilter(f);
                }}
                search={search}
                setSearch={(v) => {
                  markInteracted();
                  setSearch(v);
                }}
                counts={counts}
                rows={filteredRows}
                selectedId={selectedId}
                onOpenProposal={() => goTo("compose")}
                onOpenCv={() => goTo("cv")}
                onSelectRow={openDetail}
                showHint={!interacted}
              />
            )}
            {screen === "compose" && (
              <ComposeFrame
                voiceOpen={voiceOpen}
                onToggleVoice={() => {
                  markInteracted();
                  setVoiceOpen((o) => !o);
                }}
                onBack={() => goTo("archive")}
                onSeal={() => goTo("generating-proposal")}
              />
            )}
            {screen === "generating-proposal" && (
              <GeneratingFrame label="Creating..." />
            )}
            {screen === "result-proposal" && (
              <ResultFrame
                kind="proposal"
                body={PROPOSAL_RESULT}
                posting={SAMPLE_POSTING}
                dateFull="Sep 8, 2026"
                onBack={() => goTo("archive")}
              />
            )}
            {screen === "cv" && (
              <CvFrame
                mode={cvMode}
                setMode={(m) => {
                  markInteracted();
                  setCvMode(m);
                }}
                onBack={() => goTo("archive")}
                onSeal={() => goTo("generating-cv")}
              />
            )}
            {screen === "generating-cv" && (
              <GeneratingFrame label="Creating..." />
            )}
            {screen === "result-cv" && (
              <ResultFrame
                kind="cv"
                body={CV_RESULT}
                posting="Product design lead — Northwind is looking for a systems-minded designer…"
                dateFull="Sep 6, 2026"
                onBack={() => goTo("archive")}
              />
            )}
            {screen === "detail" && selectedRow && (
              <ResultFrame
                kind={selectedRow.type}
                body={selectedRow.body}
                posting={selectedRow.posting}
                dateFull={selectedRow.dateFull}
                onBack={() => goTo("archive")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusIcons() {
  return (
    <>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden>
        <rect x="0" y="6" width="3" height="5" rx="1.5" fill="currentColor" className="text-[#14171F] dark:text-white" />
        <rect x="4.5" y="4" width="3" height="7" rx="1.5" fill="currentColor" className="text-[#14171F] dark:text-white" />
        <rect x="9" y="2" width="3" height="9" rx="1.5" fill="currentColor" className="text-[#14171F] dark:text-white" />
        <rect x="13.5" y="0" width="3" height="11" rx="1.5" fill="currentColor" className="text-[#14171F] dark:text-white" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
        <path d="M7.5 9.5C8.05 9.5 8.5 9.05 8.5 8.5C8.5 7.95 8.05 7.5 7.5 7.5C6.95 7.5 6.5 7.95 6.5 8.5C6.5 9.05 6.95 9.5 7.5 9.5Z" fill="currentColor" className="text-[#14171F] dark:text-white" />
        <path d="M4.5 6.2C5.3 5.5 6.35 5 7.5 5C8.65 5 9.7 5.5 10.5 6.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-[#14171F] dark:text-white" />
        <path d="M2 3.6C3.55 2.15 5.45 1.3 7.5 1.3C9.55 1.3 11.45 2.15 13 3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-[#14171F] dark:text-white" />
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="21" height="11" rx="3.3" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" className="text-[#14171F] dark:text-white" />
        <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" className="text-[#14171F] dark:text-white" />
        <path d="M23 4.2V7.8C23.9 7.45 24.5 6.6 24.5 6C24.5 5.4 23.9 4.55 23 4.2Z" fill="currentColor" fillOpacity="0.4" className="text-[#14171F] dark:text-white" />
      </svg>
    </>
  );
}

/** Mirrors app/dashboard/page.tsx archive list language */
function ArchiveFrame({
  filter,
  setFilter,
  search,
  setSearch,
  counts,
  rows,
  selectedId,
  onOpenProposal,
  onOpenCv,
  onSelectRow,
  showHint,
}: {
  filter: FilterValue;
  setFilter: (f: FilterValue) => void;
  search: string;
  setSearch: (v: string) => void;
  counts: { all: number; proposal: number; cv: number };
  rows: ArchiveRow[];
  selectedId: string | null;
  onOpenProposal: () => void;
  onOpenCv: () => void;
  onSelectRow: (id: string) => void;
  showHint: boolean;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <p className="text-[17px] font-medium mb-0.5 text-[#14171F] dark:text-[#F2F2EE]">
        Your archive
      </p>
      <p className="text-[11px] text-[#8A8A82] dark:text-[#9A9A92] mb-2">
        {counts.all} saved so far.
      </p>

      <div className="flex gap-1.5 mb-2">
        <button
          type="button"
          onClick={onOpenProposal}
          className="flex items-center gap-1 text-[11px] font-medium text-white bg-[#3B4E90] rounded-full pl-2.5 pr-3 py-1.5 hover:opacity-90 transition-opacity"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={11} color="#ffffff" strokeWidth={2.5} />
          Proposal
        </button>
        <button
          type="button"
          onClick={onOpenCv}
          className="flex items-center gap-1 text-[11px] font-medium text-[#3B4E90] dark:text-[#8FA3E0] border border-[#3B4E90] dark:border-[#8FA3E0] rounded-full pl-2.5 pr-3 py-1.5 hover:bg-[#3B4E90]/5 dark:hover:bg-[#8FA3E0]/10 transition-colors"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={11} color="#3B4E90" strokeWidth={2.5} />
          CV
        </button>
      </div>

      {showHint && (
        <p className="text-[9px] text-[#8A8A82] dark:text-[#9A9A92] mb-2">
          Tap Proposal or CV
        </p>
      )}

      <div className="flex gap-1 bg-[#FAFAF8] dark:bg-[#1B1F29] rounded-full p-1 border border-[#E4E4E0] dark:border-[#2A2E38] w-fit mb-2 shrink-0">
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? counts.all
              : f.value === "proposal"
                ? counts.proposal
                : counts.cv;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`text-[10px] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 whitespace-nowrap ${
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

      <div className="mb-2 shrink-0">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by posting..."
          className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded-full px-3 py-1.5 text-[10px] bg-white dark:bg-[#14171F] placeholder:text-[#B9B9AF] dark:placeholder:text-[#6B6B63] focus:outline-none focus:ring-2 focus:ring-[#3B4E90]/30 dark:focus:ring-[#8FA3E0]/30"
        />
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto min-h-0 flex-1 pr-0.5">
        {rows.length === 0 ? (
          <p className="text-[10px] text-[#8A8A82] dark:text-[#9A9A92] py-4 text-center">
            No saved items match that search.
          </p>
        ) : (
          rows.map((row) => {
            const typeColor =
              row.type === "proposal"
                ? "bg-[#3B4E90] dark:bg-[#8FA3E0]"
                : "bg-[#C9A227]";
            const selected = selectedId === row.id;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => onSelectRow(row.id)}
                className={`relative flex items-center justify-between gap-2 rounded-md border pl-4 pr-2.5 py-2 overflow-hidden text-left w-full transition-all ${
                  selected
                    ? "border-[#3B4E90] dark:border-[#8FA3E0] bg-[#3B4E90]/3 dark:bg-[#8FA3E0]/10"
                    : "border-[#E4E4E0] dark:border-[#2A2E38] hover:border-[#3B4E90]/30 dark:hover:border-[#8FA3E0]/30"
                }`}
              >
                <span className={`absolute left-0 top-0 bottom-0 w-0.75 ${typeColor}`} />
                <div className="flex items-center gap-1.5 min-w-0">
                  <HugeiconsIcon
                    icon={row.type === "proposal" ? Mail01Icon : File01Icon}
                    size={12}
                    color="#3B4E90"
                    strokeWidth={1.5}
                    className="shrink-0"
                  />
                  <span className="text-[10.5px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] truncate">
                    {row.label}
                  </span>
                </div>
                <span className="text-[9px] text-[#8A8A82] dark:text-[#9A9A92] shrink-0">
                  {row.date}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function BackLink({ onClick, label = "Back to archive" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[10px] text-[#8A8A82] dark:text-[#9A9A92] hover:text-[#3B4E90] dark:hover:text-[#8FA3E0] transition-colors mb-2 self-start"
    >
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        size={12}
        color="currentColor"
        strokeWidth={1.5}
      />
      {label}
    </button>
  );
}

function ComposeFrame({
  voiceOpen,
  onToggleVoice,
  onBack,
  onSeal,
}: {
  voiceOpen: boolean;
  onToggleVoice: () => void;
  onBack: () => void;
  onSeal: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <BackLink onClick={onBack} />
      <div className="flex flex-col gap-2.5 pb-2">
        <div>
          <label className="text-[10px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-0.5 block">
            The posting
          </label>
          <textarea
            readOnly
            value={SAMPLE_POSTING}
            rows={4}
            className="w-full rounded-md border border-[#E4E4E0] dark:border-[#2A2E38] p-2 text-[10px] leading-relaxed resize-none bg-white dark:bg-[#14171F] text-[#4A4A44] dark:text-[#D8D8D2] focus:outline-none"
          />
        </div>

        <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-md">
          <button
            type="button"
            onClick={onToggleVoice}
            className="w-full flex items-center justify-between px-2.5 py-2 text-[10px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]"
          >
            Your voice
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.5}
              className={`transition-transform ${voiceOpen ? "rotate-180" : ""}`}
            />
          </button>
          {voiceOpen && (
            <div className="px-2.5 pb-2.5 flex flex-col gap-1.5">
              <input
                readOnly
                value={SAMPLE_VOICE.name}
                className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded px-2 py-1.5 text-[10px] bg-white dark:bg-[#14171F]"
              />
              <input
                readOnly
                value={SAMPLE_VOICE.skills}
                className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded px-2 py-1.5 text-[10px] bg-white dark:bg-[#14171F]"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onSeal}
          className="self-start flex items-center gap-2 rounded-full pl-2 pr-4 py-2 text-[11px] font-medium text-white"
          style={{ backgroundColor: "#C9A227" }}
        >
          <span className="w-6 h-6 rounded-full border-2 border-white/70 flex items-center justify-center">
            <HugeiconsIcon
              icon={FeatherIcon}
              size={12}
              color="#ffffff"
              strokeWidth={1.5}
            />
          </span>
          Create proposal
        </button>
      </div>
    </div>
  );
}

function CvFrame({
  mode,
  setMode,
  onBack,
  onSeal,
}: {
  mode: CvInputMode;
  setMode: (m: CvInputMode) => void;
  onBack: () => void;
  onSeal: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <BackLink onClick={onBack} />
      <div className="flex flex-col gap-2.5 pb-2">
        <div>
          <label className="text-[10px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-0.5 block">
            Your name
          </label>
          <input
            readOnly
            value="Alex Chen"
            className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded px-2 py-1.5 text-[10px] bg-white dark:bg-[#14171F]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
              Your CV
            </label>
            <div className="flex gap-0.5 bg-[#FAFAF8] dark:bg-[#1B1F29] rounded-full p-0.5 border border-[#E4E4E0] dark:border-[#2A2E38]">
              <button
                type="button"
                onClick={() => setMode("paste")}
                className={`text-[9px] px-2 py-0.5 rounded-full transition-colors ${
                  mode === "paste"
                    ? "bg-[#3B4E90] text-white"
                    : "text-[#6B6B63] dark:text-[#B5B5AC]"
                }`}
              >
                Paste
              </button>
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`text-[9px] px-2 py-0.5 rounded-full transition-colors ${
                  mode === "upload"
                    ? "bg-[#3B4E90] text-white"
                    : "text-[#6B6B63] dark:text-[#B5B5AC]"
                }`}
              >
                Upload
              </button>
            </div>
          </div>
          {mode === "paste" ? (
            <textarea
              readOnly
              value={SAMPLE_CV_TEXT}
              rows={4}
              className="w-full rounded-md border border-[#E4E4E0] dark:border-[#2A2E38] p-2 text-[10px] leading-relaxed resize-none bg-white dark:bg-[#14171F] text-[#4A4A44] dark:text-[#D8D8D2]"
            />
          ) : (
            <div className="w-full h-24 rounded-md border-2 border-dashed border-[#E4E4E0] dark:border-[#2A2E38] flex flex-col items-center justify-center gap-1.5">
              <HugeiconsIcon
                icon={Upload01Icon}
                size={18}
                color="#8A8A82"
                strokeWidth={1.5}
              />
              <p className="text-[9px] text-[#6B6B63] dark:text-[#B5B5AC] text-center px-2">
                Click to upload .txt, .docx, or .pdf
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-0.5 block">
            The posting
          </label>
          <textarea
            readOnly
            value={SAMPLE_POSTING}
            rows={3}
            className="w-full rounded-md border border-[#E4E4E0] dark:border-[#2A2E38] p-2 text-[10px] leading-relaxed resize-none bg-white dark:bg-[#14171F] text-[#4A4A44] dark:text-[#D8D8D2]"
          />
        </div>

        <button
          type="button"
          onClick={onSeal}
          className="self-start flex items-center gap-2 rounded-full pl-2 pr-4 py-2 text-[11px] font-medium text-white"
          style={{ backgroundColor: "#C9A227" }}
        >
          <span className="w-6 h-6 rounded-full border-2 border-white/70 flex items-center justify-center">
            <HugeiconsIcon
              icon={FeatherIcon}
              size={12}
              color="#ffffff"
              strokeWidth={1.5}
            />
          </span>
          Create CV
        </button>
      </div>
    </div>
  );
}

function GeneratingFrame({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-[#8A8A82] dark:text-[#9A9A92]">
      <span
        className="flex items-center gap-2 rounded-full pl-2 pr-4 py-2 text-[11px] font-medium text-white"
        style={{ backgroundColor: "#C9A227" }}
      >
        <span className="w-6 h-6 rounded-full border-2 border-white/70 flex items-center justify-center">
          <HugeiconsIcon
            icon={Loading03Icon}
            size={12}
            color="#ffffff"
            strokeWidth={1.5}
            className="animate-spin"
          />
        </span>
        {label}
      </span>
    </div>
  );
}

/** Saved detail preview — echoes dashboard detail pane */
function ResultFrame({
  kind,
  body,
  posting,
  dateFull,
  onBack,
}: {
  kind: "proposal" | "cv";
  body: string;
  posting: string;
  dateFull: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <BackLink onClick={onBack} label="Back to archive" />

      <div className="flex items-start justify-between gap-2 mb-2 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[9px] tracking-wide uppercase text-[#8A8A82] dark:text-[#9A9A92]">
              {kind === "proposal" ? "the proposal" : "the tailored cv"} ·{" "}
              {dateFull}
            </span>
            <span
              className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${
                kind === "proposal"
                  ? "bg-[#3B4E90]/10 text-[#3B4E90] dark:bg-[#8FA3E0]/15 dark:text-[#8FA3E0]"
                  : "bg-[#C9A227]/15 text-[#C9A227]"
              }`}
            >
              {kind === "proposal" ? "Proposal" : "CV"}
            </span>
          </div>
          <p className="text-[10px] text-[#8A8A82] dark:text-[#9A9A92] leading-relaxed line-clamp-2">
            {posting}
          </p>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-[#3B4E90] dark:text-[#8FA3E0] shrink-0 mt-0.5">
          <HugeiconsIcon icon={Copy01Icon} size={12} color="currentColor" strokeWidth={1.5} />
          Copy
        </span>
      </div>

      <div className="flex-1 min-h-0 rounded-md border border-[#E4E4E0] dark:border-[#2A2E38] p-3 overflow-hidden">
        <pre className="text-[10px] leading-[1.65] text-[#4A4A44] dark:text-[#D8D8D2] whitespace-pre-wrap font-sans">
          {body}
        </pre>
      </div>
    </div>
  );
}
