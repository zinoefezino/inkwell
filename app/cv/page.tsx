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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cvMissing = cvText.trim().length <= 40;
  const postingMissing = posting.trim().length <= 20;
  const canTailor = !cvMissing && !postingMissing && !loading;

  async function handleFile(file: File) {
    setError("");
    setFileName(file.name);

    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      setCvText(text);
      return;
    }

    if (file.name.endsWith(".docx")) {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setCvText(result.value);
      } catch {
        setError(
          "Couldn't read that .docx file. Try pasting the text instead.",
        );
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
        setCvText(data.text);
      } catch {
        setError("Couldn't read that PDF. Try pasting the text instead.");
      }
      return;
    }

    setError(
      "Unsupported file type. Use .txt, .docx, or paste your CV text directly.",
    );
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

  return (
    <div className="min-h-screen bg-white text-[#14171F]">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[#8A8A82] hover:text-[#2B3A67] transition-colors mb-6"
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
              <label className="text-[13px] font-medium text-[#4A4A44] mb-1 block">
                Your name
              </label>
              <p className="text-[12px] text-[#8A8A82] mb-2">
                Used as the header on your downloaded CV.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-[#E4E4E0] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/30"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#4A4A44]">
                  Your CV <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1 bg-[#FAFAF8] rounded-full p-1 border border-[#E4E4E0]">
                  <button
                    onClick={() => setMode("paste")}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      mode === "paste"
                        ? "bg-[#2B3A67] text-white"
                        : "text-[#6B6B63]"
                    }`}
                  >
                    Paste
                  </button>
                  <button
                    onClick={() => setMode("upload")}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      mode === "upload"
                        ? "bg-[#2B3A67] text-white"
                        : "text-[#6B6B63]"
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
                    className={`w-full rounded-md border p-4 text-[13.5px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/30 ${
                      attempted && cvMissing
                        ? "border-red-400"
                        : "border-[#E4E4E0] focus:border-[#2B3A67]"
                    }`}
                  />
                  {attempted && cvMissing && (
                    <p className="text-[12px] text-red-600 mt-1">
                      Add your CV text (paste or upload) before tailoring.
                    </p>
                  )}
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[280px] rounded-md border-2 border-dashed border-[#E4E4E0] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#2B3A67]/40 transition-colors"
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
                    icon={fileName ? File01Icon : Upload01Icon}
                    size={32}
                    color="#8A8A82"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm text-[#6B6B63]">
                    {fileName || "Click to upload .txt, .docx, or .pdf"}
                  </p>
                  {cvText && fileName && (
                    <p className="text-xs text-[#C9A227]">
                      Text extracted — ready to tailor
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#4A4A44] mb-1 block">
                The posting <span className="text-red-500">*</span>
              </label>
              <p className="text-[12px] text-[#8A8A82] mb-2">
                Paste the raw job description text — not a link.
              </p>
              <textarea
                value={posting}
                onChange={(e) => setPosting(e.target.value)}
                placeholder="Paste the job posting here..."
                rows={6}
                className={`w-full rounded-md border p-4 text-[13.5px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/30 ${
                  attempted && postingMissing
                    ? "border-red-400"
                    : "border-[#E4E4E0] focus:border-[#2B3A67]"
                }`}
              />
              {attempted && postingMissing && (
                <p className="text-[12px] text-red-600 mt-1">
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
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* RIGHT: output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-[#4A4A44]">
                The tailored CV
              </label>
              {tailored && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#2B3A67] hover:opacity-70"
                  >
                    <HugeiconsIcon
                      icon={copied ? Tick01Icon : Copy01Icon}
                      size={16}
                      color="#2B3A67"
                      strokeWidth={1.5}
                    />
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() =>
                      downloadAsDocx(tailored, "tailored-cv", {
                        title: name,
                        subtitle: "Tailored CV",
                      })
                    }
                    className="flex items-center gap-1.5 text-xs text-[#2B3A67] hover:opacity-70"
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={16}
                      color="#2B3A67"
                      strokeWidth={1.5}
                    />
                    Word
                  </button>
                  <button
                    onClick={() =>
                      downloadAsPdf(tailored, "tailored-cv", {
                        title: name,
                        subtitle: "Tailored CV",
                      })
                    }
                    className="flex items-center gap-1.5 text-xs text-[#2B3A67] hover:opacity-70"
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={16}
                      color="#2B3A67"
                      strokeWidth={1.5}
                    />
                    PDF
                  </button>
                </div>
              )}
            </div>
            <div className="border border-[#E4E4E0] rounded-md p-6 min-h-[420px] whitespace-pre-wrap text-[14.5px] leading-[1.7]">
              {tailored ? (
                tailored
              ) : (
                <span className="text-[#B9B9AF] font-sans text-sm not-italic">
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
