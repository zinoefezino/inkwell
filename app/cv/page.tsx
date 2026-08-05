"use client";

import { useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FeatherIcon,
  Copy01Icon,
  Tick01Icon,
  Loading03Icon,
  Upload01Icon,
  File01Icon,
  ArrowLeft01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Header from "@/components/Header";
import { downloadAsDocx, downloadAsPdf } from "@/lib/export";

type InputMode = "paste" | "upload";

export default function TailorCV() {
  const [mode, setMode] = useState<InputMode>("paste");
  const [name, setName] = useState("");
  const [cvText, setCvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [posting, setPosting] = useState("");
  const [tailored, setTailored] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cvMissing = cvText.trim().length <= 40;
  const postingMissing = posting.trim().length <= 20;
  const canTailor = !cvMissing && !postingMissing && !loading;

  async function handleFile(file: File) {
    setError("");
    setCvText("");
    setFileName(file.name);
    setExtracting(true);

    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      setCvText(text);
      setExtracting(false);
      return;
    }

    if (file.name.endsWith(".docx")) {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value.trim()) {
          setError(
            "Couldn't find any text in that file. It may be empty, image-based, or corrupted — try pasting the text instead.",
          );
          setExtracting(false);
          return;
        }
        setCvText(result.value);
      } catch {
        setError(
          "Couldn't read that .docx file. Try pasting the text instead.",
        );
      } finally {
        setExtracting(false);
      }
      return;
    }

    if (file.name.endsWith(".pdf")) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        if (!data.text || !data.text.trim()) {
          setError(
            "Couldn't find any text in that PDF — it may be a scanned or image-based document. Try pasting the text instead.",
          );
          return;
        }
        setCvText(data.text);
      } catch {
        setError("Couldn't read that PDF. Try pasting the text instead.");
      } finally {
        setExtracting(false);
      }
      return;
    }

    setError(
      "Unsupported file type. Use .txt, .docx, or paste your CV text directly.",
    );
    setExtracting(false);
  }

  async function handleTailor() {
    setAttempted(true);
    if (!canTailor) return;
    setLoading(true);
    setError("");
    setTailored("");
    try {
      const res = await fetch("/api/tailor-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, posting }),
      });
      const data = await res.json();
      setTailored(data.tailored || "No result returned — try again.");
    } catch {
      setError("Couldn't reach the drafting desk. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(tailored);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const filenameBase = `cv-${name || "tailored"}`
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="min-h-screen bg-white dark:bg-[#14171F] text-[#14171F] dark:text-[#F2F2EE]">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[#8A8A82] dark:text-[#9A9A92] hover:text-[#3B4E90] dark:hover:text-[#8FA3E0] transition-colors mb-6"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.5}
          />
          Back to archive
        </Link>
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT: input */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-[13px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-1 block">
                Your name
              </label>
              <p className="text-[12px] text-[#8A8A82] dark:text-[#9A9A92] mb-2">
                Used as the header on your downloaded CV.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/30 dark:focus:ring-[#8FA3E0]/30"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
                  Your CV{" "}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="flex gap-1 bg-[#FAFAF8] dark:bg-[#1B1F29] rounded-full p-1 border border-[#E4E4E0] dark:border-[#2A2E38]">
                  <button
                    onClick={() => setMode("paste")}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      mode === "paste"
                        ? "bg-[#2B3A67] text-white"
                        : "text-[#6B6B63] dark:text-[#B5B5AC]"
                    }`}
                  >
                    Paste
                  </button>
                  <button
                    onClick={() => setMode("upload")}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
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
                <>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Paste your CV text here..."
                    rows={11}
                    className={`w-full rounded-md border p-4 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#3B4E90]/30 dark:focus:ring-[#8FA3E0]/30 ${
                      attempted && cvMissing
                        ? "border-red-400 dark:border-red-500"
                        : "border-[#E4E4E0] dark:border-[#2A2E38] focus:border-[#3B4E90] dark:focus:border-[#8FA3E0]"
                    }`}
                  />
                  {attempted && cvMissing && (
                    <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                      Add your CV text (paste or upload) before tailoring.
                    </p>
                  )}
                </>
              ) : (
                <div
                  onClick={() => !extracting && fileInputRef.current?.click()}
                  className={`w-full h-70 rounded-md border-2 border-dashed border-[#E4E4E0] dark:border-[#2A2E38] flex flex-col items-center justify-center gap-3 transition-colors ${
                    extracting
                      ? "cursor-wait"
                      : "cursor-pointer hover:border-[#3B4E90]/40 dark:hover:border-[#8FA3E0]/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.docx,.pdf"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFile(e.target.files[0])
                    }
                  />
                  <HugeiconsIcon
                    icon={
                      extracting
                        ? Loading03Icon
                        : fileName
                          ? File01Icon
                          : Upload01Icon
                    }
                    size={32}
                    color="#8A8A82"
                    strokeWidth={1.5}
                    className={extracting ? "animate-spin" : ""}
                  />
                  <p className="text-sm text-[#6B6B63] dark:text-[#B5B5AC]">
                    {extracting
                      ? "Extracting text..."
                      : fileName || "Click to upload .txt, .docx, or .pdf"}
                  </p>
                  {cvText && fileName && !extracting && (
                    <p className="text-xs text-[#C9A227]">
                      Text extracted — ready to tailor
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#4A4A44] dark:text-[#D8D8D2] mb-1 block">
                The posting{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <p className="text-[12px] text-[#8A8A82] dark:text-[#9A9A92] mb-2">
                Paste the raw job description text — not a link.
              </p>
              <textarea
                value={posting}
                onChange={(e) => setPosting(e.target.value)}
                placeholder="Paste the job posting here..."
                rows={6}
                className={`w-full rounded-md border p-4 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#3B4E90]/30 dark:focus:ring-[#8FA3E0]/30 ${
                  attempted && postingMissing
                    ? "border-red-400 dark:border-red-500"
                    : "border-[#E4E4E0] dark:border-[#2A2E38] focus:border-[#3B4E90] dark:focus:border-[#8FA3E0]"
                }`}
              />
              {attempted && postingMissing && (
                <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                  Paste the job posting (at least a couple sentences).
                </p>
              )}
            </div>

            <button
              onClick={handleTailor}
              disabled={loading}
              className="self-start flex items-center gap-3 rounded-full pl-3 pr-6 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "#C9A227" }}
            >
              <span className="w-8 h-8 rounded-full border-2 border-white/70 flex items-center justify-center">
                {loading ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={18}
                    color="#ffffff"
                    strokeWidth={1.5}
                    className="animate-spin"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={FeatherIcon}
                    size={18}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                )}
              </span>
              {loading ? "Tailoring..." : "Seal & tailor"}
            </button>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* RIGHT: output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
                The tailored CV
              </label>
              {tailored && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#3B4E90] dark:text-[#8FA3E0] hover:opacity-70"
                  >
                    <HugeiconsIcon
                      icon={copied ? Tick01Icon : Copy01Icon}
                      size={16}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() =>
                      downloadAsDocx(tailored, filenameBase, {
                        title: name,
                        subtitle: "Tailored CV",
                      })
                    }
                    className="flex items-center gap-1.5 text-xs text-[#3B4E90] dark:text-[#8FA3E0] hover:opacity-70"
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={16}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    Word
                  </button>
                  <button
                    onClick={() =>
                      downloadAsPdf(tailored, filenameBase, {
                        title: name,
                        subtitle: "Tailored CV",
                      })
                    }
                    className="flex items-center gap-1.5 text-xs text-[#3B4E90] dark:text-[#8FA3E0] hover:opacity-70"
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={16}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    PDF
                  </button>
                </div>
              )}
            </div>
            <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-md p-6 min-h-105 whitespace-pre-wrap text-[14.5px] leading-[1.7]">
              {tailored ? (
                tailored
              ) : (
                <span className="text-[#B9B9AF] dark:text-[#6B6B63] font-sans text-sm not-italic">
                  Your tailored CV will take shape here once you add your CV and
                  a posting.
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
