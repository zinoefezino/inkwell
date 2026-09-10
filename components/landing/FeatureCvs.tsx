"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FeatherIcon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  Copy01Icon,
  Download01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";

const GEN_MS = 750;
const FADE_MS = 220;
const HOLD_MS = 3200;
const CHAR_MS = 24;
const CHUNK = 2;

type CvInputMode = "paste" | "upload";
type Step = "form" | "generating" | "result";
type TypingField = "name" | "cv" | "posting" | null;

const SAMPLE_NAME = "Alex Chen";

const SAMPLE_CV =
  "Alex Chen — Frontend Engineer. Northwind Digital: React/TypeScript product UIs, Lighthouse performance, accessible design-system components…";

const SAMPLE_POSTING =
  "Senior Frontend Engineer — Acme Labs. Build accessible React/TypeScript product UIs with strong design-system ownership…";

const CV_RESULT = `Alex Chen
Frontend Engineer · Remote

Experience
Northwind Digital — Frontend Engineer · 2021–Present
• Led React/TypeScript UI for core product flows
• Improved Lighthouse performance on checkout
• Partnered with design on accessible components

Skills
React · TypeScript · Next.js · CSS · A11y`;

function Caret({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      aria-hidden
      className="inline-block w-[1.5px] h-2.75 ml-0.5 align-middle bg-[#3B4E90] dark:bg-[#8FA3E0]"
      style={{ animation: "inkwell-caret 1s step-end infinite" }}
    />
  );
}

function CvMockCard() {
  const [step, setStep] = useState<Step>("form");
  const [cvMode, setCvMode] = useState<CvInputMode>("upload");
  const [interacted, setInteracted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [name, setName] = useState("");
  const [cvText, setCvText] = useState("");
  const [posting, setPosting] = useState("");
  const [typingField, setTypingField] = useState<TypingField>(null);
  const [btnPressed, setBtnPressed] = useState(false);
  const [paused, setPaused] = useState(false);

  const genTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const runIdRef = useRef(0);
  const pausedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const interactedRef = useRef(false);
  const stepRef = useRef<Step>("form");
  const fromDemoRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    interactedRef.current = interacted;
  }, [interacted]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const on = mq.matches;
      setReduceMotion(on);
      reduceMotionRef.current = on;
      if (on) {
        setName(SAMPLE_NAME);
        setCvText(SAMPLE_CV);
        setPosting(SAMPLE_POSTING);
        setCvMode("paste");
        setTypingField(null);
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const clearGenFade = useCallback(() => {
    if (genTimerRef.current) {
      window.clearTimeout(genTimerRef.current);
      genTimerRef.current = null;
    }
    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const sleep = useCallback((ms: number, runId: number) => {
    return new Promise<boolean>((resolve) => {
      let remaining = ms;
      const tick = () => {
        if (runIdRef.current !== runId) {
          resolve(false);
          return;
        }
        if (pausedRef.current) {
          window.setTimeout(tick, 40);
          return;
        }
        if (remaining <= 0) {
          resolve(true);
          return;
        }
        const slice = Math.min(40, remaining);
        remaining -= slice;
        window.setTimeout(tick, slice);
      };
      tick();
    });
  }, []);

  const typeText = useCallback(
    async (
      full: string,
      setter: (v: string) => void,
      field: TypingField,
      runId: number,
    ) => {
      setTypingField(field);
      let i = 0;
      while (i < full.length) {
        if (runIdRef.current !== runId) return false;
        while (pausedRef.current) {
          if (runIdRef.current !== runId) return false;
          await new Promise((r) => window.setTimeout(r, 40));
        }
        i = Math.min(full.length, i + CHUNK);
        setter(full.slice(0, i));
        const ok = await sleep(CHAR_MS * 1.15, runId);
        if (!ok) return false;
      }
      setTypingField(null);
      return true;
    },
    [sleep],
  );

  const goTo = useCallback(
    (next: Step, opts?: { fromDemo?: boolean }) => {
      if (!opts?.fromDemo) {
        setInteracted(true);
        interactedRef.current = true;
        runIdRef.current += 1;
        setTypingField(null);
        setBtnPressed(false);
      }
      fromDemoRef.current = Boolean(opts?.fromDemo);
      clearGenFade();

      const apply = () => {
        setStep(next);
        stepRef.current = next;
        setVisible(true);
      };

      if (reduceMotionRef.current) {
        apply();
        return;
      }
      setVisible(false);
      fadeTimerRef.current = window.setTimeout(apply, FADE_MS);
    },
    [clearGenFade],
  );

  // Pause-aware generating → result
  useEffect(() => {
    if (step !== "generating") return;
    let cancelled = false;
    let remaining = GEN_MS;
    const tick = () => {
      if (cancelled) return;
      if (pausedRef.current) {
        genTimerRef.current = window.setTimeout(tick, 40);
        return;
      }
      remaining -= 40;
      if (remaining <= 0) {
        goTo("result", { fromDemo: fromDemoRef.current });
      } else {
        genTimerRef.current = window.setTimeout(tick, 40);
      }
    };
    genTimerRef.current = window.setTimeout(tick, 40);
    return () => {
      cancelled = true;
      if (genTimerRef.current) {
        window.clearTimeout(genTimerRef.current);
        genTimerRef.current = null;
      }
    };
  }, [step, goTo]);

  const canCreate =
    name.trim().length >= 2 &&
    (cvMode === "paste" ? cvText.trim().length >= 12 : false) &&
    posting.trim().length >= 12;

  const handleCreateClick = () => {
    if (!canCreate || step !== "form") return;
    goTo("generating");
  };

  const resetFormFields = useCallback(() => {
    setName("");
    setCvText("");
    setPosting("");
    setCvMode("upload");
    setTypingField(null);
    setBtnPressed(false);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const runId = ++runIdRef.current;
    let cancelled = false;

    const loop = async () => {
      while (!cancelled && runIdRef.current === runId) {
        if (interactedRef.current) return;

        resetFormFields();
        setStep("form");
        stepRef.current = "form";
        setVisible(true);

        let ok = await sleep(400, runId);
        if (!ok || interactedRef.current) return;

        // Briefly show Upload, then settle on Paste
        setCvMode("upload");
        ok = await sleep(700, runId);
        if (!ok || interactedRef.current) return;
        setCvMode("paste");
        ok = await sleep(320, runId);
        if (!ok || interactedRef.current) return;

        if (!(await typeText(SAMPLE_NAME, setName, "name", runId))) return;
        if (interactedRef.current) return;
        await sleep(180, runId);

        if (!(await typeText(SAMPLE_CV, setCvText, "cv", runId))) return;
        if (interactedRef.current) return;
        await sleep(180, runId);

        if (!(await typeText(SAMPLE_POSTING, setPosting, "posting", runId)))
          return;
        if (interactedRef.current) return;
        await sleep(420, runId);
        if (interactedRef.current || runIdRef.current !== runId) return;

        setBtnPressed(true);
        await sleep(200, runId);
        setBtnPressed(false);
        if (interactedRef.current || runIdRef.current !== runId) return;

        goTo("generating", { fromDemo: true });

        // Timed wait for generating → result (avoids TS2367 ref narrowing on stepRef)
        const okGen = await sleep(GEN_MS + FADE_MS + 120, runId);
        if (!okGen) return;
        if (runIdRef.current !== runId || interactedRef.current) return;

        await sleep(HOLD_MS, runId);
        if (runIdRef.current !== runId || interactedRef.current) return;

        clearGenFade();
        setVisible(false);
        await sleep(FADE_MS, runId);
        if (runIdRef.current !== runId || interactedRef.current) return;
        setStep("form");
        stepRef.current = "form";
        setVisible(true);
      }
    };

    void loop();

    return () => {
      cancelled = true;
      runIdRef.current += 1;
      clearGenFade();
    };
  }, [reduceMotion, typeText, sleep, goTo, resetFormFields, clearGenFade]);

  useEffect(() => {
    return () => {
      clearGenFade();
      runIdRef.current += 1;
    };
  }, [clearGenFade]);

  const onPause = () => setPaused(true);
  const onResume = () => setPaused(false);

  return (
    <div>
      <style>{`
        @keyframes inkwell-caret {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
      <div
        className="rounded-2xl border border-[#E4E4E0] dark:border-[#2A2E38] bg-white dark:bg-[#14171F] ring-1 ring-[#2B3A67]/4 dark:ring-[#8FA3E0]/10 overflow-hidden select-none"
        onMouseEnter={onPause}
        onMouseLeave={onResume}
        onFocusCapture={onPause}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            onResume();
          }
        }}
      >
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]">
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={12}
            color="currentColor"
            strokeWidth={1.5}
            className="text-[#8A8A82] dark:text-[#9A9A92]"
          />
          <span className="text-[11px] text-[#8A8A82] dark:text-[#9A9A92]">
            Back to archive
          </span>
          <span className="ml-auto text-[11px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
            Create CV
          </span>
        </div>

        <div
          className={`p-4 sm:p-5 flex flex-col gap-3.5 min-h-80 transition-opacity duration-220 ease-out ${
            visible || reduceMotion ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          {step === "form" && (
            <>
              <div>
                <p className="text-[12px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-0.5">
                  Your name
                </p>
                <p className="text-[10px] text-[#8A8A82] dark:text-[#9A9A92] mb-1.5">
                  Used as the header on your downloaded CV.
                </p>
                <div
                  className={`w-full border rounded px-2.5 py-1.5 text-[11px] text-[#14171F] dark:text-[#F2F2EE] min-h-[30px] ${
                    typingField === "name"
                      ? "border-[#3B4E90]/50 dark:border-[#8FA3E0]/40"
                      : "border-[#E4E4E0] dark:border-[#2A2E38]"
                  }`}
                >
                  {name || (
                    <span className="text-[#B5B5AC] dark:text-[#6B6B63]">
                      Your name
                    </span>
                  )}
                  <Caret show={typingField === "name"} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[12px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
                    Your CV
                  </p>
                  <div className="flex gap-1 bg-[#FAFAF8] dark:bg-[#1B1F29] rounded-full p-0.5 border border-[#E4E4E0] dark:border-[#2A2E38]">
                    <button
                      type="button"
                      onClick={() => {
                        setInteracted(true);
                        setCvMode("paste");
                      }}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full transition-colors ${
                        cvMode === "paste"
                          ? "bg-[#3B4E90] text-white"
                          : "text-[#6B6B63] dark:text-[#B5B5AC]"
                      }`}
                    >
                      Paste
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInteracted(true);
                        setCvMode("upload");
                      }}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full transition-colors ${
                        cvMode === "upload"
                          ? "bg-[#3B4E90] text-white"
                          : "text-[#6B6B63] dark:text-[#B5B5AC]"
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                {cvMode === "paste" ? (
                  <div
                    className={`w-full rounded-md border p-3 text-[11px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] max-h-[64px] overflow-hidden min-h-[48px] ${
                      typingField === "cv"
                        ? "border-[#3B4E90]/50 dark:border-[#8FA3E0]/40"
                        : "border-[#E4E4E0] dark:border-[#2A2E38]"
                    }`}
                  >
                    {cvText || (
                      <span className="text-[#B5B5AC] dark:text-[#6B6B63]">
                        Paste your CV…
                      </span>
                    )}
                    <Caret show={typingField === "cv"} />
                  </div>
                ) : (
                  <div className="w-full h-16 rounded-md border-2 border-dashed border-[#E4E4E0] dark:border-[#2A2E38] flex flex-col items-center justify-center gap-1">
                    <HugeiconsIcon
                      icon={Upload01Icon}
                      size={16}
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
                <p className="text-[12px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-0.5">
                  The posting
                </p>
                <p className="text-[10px] text-[#8A8A82] dark:text-[#9A9A92] mb-1.5">
                  Paste the raw job description text not a link.
                </p>
                <div
                  className={`w-full rounded-md border p-3 text-[11px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] max-h-[52px] overflow-hidden min-h-[40px] ${
                    typingField === "posting"
                      ? "border-[#3B4E90]/50 dark:border-[#8FA3E0]/40"
                      : "border-[#E4E4E0] dark:border-[#2A2E38]"
                  }`}
                >
                  {posting || (
                    <span className="text-[#B5B5AC] dark:text-[#6B6B63]">
                      Job description…
                    </span>
                  )}
                  <Caret show={typingField === "posting"} />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateClick}
                disabled={!canCreate}
                className={`self-start flex items-center gap-2.5 rounded-full pl-2.5 pr-5 py-2 text-[12px] font-medium text-white transition-[opacity,transform,filter] ${
                  canCreate
                    ? "hover:opacity-90"
                    : "opacity-45 cursor-not-allowed"
                } ${btnPressed ? "scale-[0.97] brightness-95" : ""}`}
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
            </>
          )}

          {step === "generating" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-[#8A8A82] dark:text-[#9A9A92]">
              <span
                className="flex items-center gap-2.5 rounded-full pl-2.5 pr-5 py-2 text-[12px] font-medium text-white"
                style={{ backgroundColor: "#C9A227" }}
              >
                <span className="w-6 h-6 rounded-full border-2 border-white/70 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={12}
                    color="#ffffff"
                    strokeWidth={1.5}
                    className={reduceMotion ? "" : "animate-spin"}
                  />
                </span>
                Creating…
              </span>
            </div>
          )}

          {step === "result" && (
            <>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[12px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
                  The tailored CV
                </p>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-[#3B4E90] dark:text-[#8FA3E0]">
                    <HugeiconsIcon
                      icon={Copy01Icon}
                      size={12}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    Copy
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#3B4E90] dark:text-[#8FA3E0]">
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={12}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    Word
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#3B4E90] dark:text-[#8FA3E0]">
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={12}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    PDF
                  </span>
                </div>
              </div>
              <div className="w-full rounded-md border border-[#E4E4E0] dark:border-[#2A2E38] p-3 text-[11px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                {CV_RESULT}
              </div>
              <button
                type="button"
                onClick={() => {
                  setInteracted(true);
                  setName(SAMPLE_NAME);
                  setCvText(SAMPLE_CV);
                  setPosting(SAMPLE_POSTING);
                  setCvMode("paste");
                  setTypingField(null);
                  setBtnPressed(false);
                  goTo("form");
                }}
                className="self-start text-[11px] font-medium text-[#3B4E90] dark:text-[#8FA3E0] hover:opacity-70 transition-opacity"
              >
                Create another
              </button>
            </>
          )}
        </div>
      </div>
      {!interacted && (
        <p className="mt-2 text-center text-[11px] text-[#8A8A82] dark:text-[#9A9A92]">
          {reduceMotion ? "Click Create CV" : "Watch it fill — or click Create"}
        </p>
      )}
    </div>
  );
}

export default function FeatureCvs() {
  return (
    <section className="border-b border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20 md:py-24 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="order-2 md:order-1">
          <CvMockCard />
        </div>

        <div className="order-1 md:order-2 rounded-3xl border border-[#E4E4E0]/80 dark:border-[#2A2E38] bg-white/70 dark:bg-[#14171F]/55 p-6 sm:p-8">
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C9A227]">
            Tailored CVs
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F2F2EE] leading-[1.15] mb-4">
            Same history. Better emphasis for this role.
          </h2>
          <p className="text-[15.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC] mb-7 max-w-md">
            Upload or paste your CV. Inkwell reorders and reframes what you
            already wrote so the right experience leads without fabricating a
            single line.
          </p>
          <ul className="space-y-2.5">
            {[
              "Reorders around the posting",
              "Keeps your facts intact",
              "Export to Word or PDF",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[#E4E4E0]/90 dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29] px-3.5 py-3 text-[14px] text-[#4A4A44] dark:text-[#D8D8D2]"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#2B3A67]/10 dark:bg-[#8FA3E0]/15">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={14}
                    color="#2B3A67"
                    strokeWidth={1.75}
                    className="dark:brightness-125"
                  />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
