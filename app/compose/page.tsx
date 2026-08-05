"use client";

import { useState, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FeatherIcon,
  Copy01Icon,
  Tick01Icon,
  Loading03Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Header from "@/components/Header";
import { downloadAsDocx, downloadAsPdf } from "@/lib/export";

const TONES = [
  "Concise & direct",
  "Warm & consultative",
  "Technical & precise",
];

interface Profile {
  name: string;
  skills: string;
  snippet: string;
  tone: string;
}

export default function Compose() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    skills: "",
    snippet: "",
    tone: TONES[0],
  });
  const [profileOpen, setProfileOpen] = useState(true);
  const [posting, setPosting] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("inkwell-profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {}
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem("inkwell-profile", JSON.stringify(profile));
  }, [profile]);

  const nameMissing = profile.name.trim().length === 0;
  const skillsMissing = profile.skills.trim().length === 0;
  const postingMissing = posting.trim().length <= 20;
  const canDraft =
    !postingMissing && !nameMissing && !skillsMissing && !loading;

  async function handleDraft() {
    setAttempted(true);
    if (!canDraft) {
      if (nameMissing || skillsMissing) setProfileOpen(true);
      return;
    }
    setLoading(true);
    setError("");
    setDraft("");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posting, profile }),
      });
      const data = await res.json();
      setDraft(data.draft || "No draft returned — try again.");
    } catch {
      setError("Couldn't reach the drafting desk. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const filenameBase = `proposal-${profile.name || "draft"}`
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
                The posting
              </label>
              <p className="text-[12px] text-[#8A8A82] dark:text-[#9A9A92] mb-2">
                Paste the raw job description text — not a link.
              </p>
              <textarea
                value={posting}
                onChange={(e) => setPosting(e.target.value)}
                placeholder="Paste the job posting here..."
                rows={11}
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

            <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-md">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]"
              >
                Your voice
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={20}
                  color="currentColor"
                  strokeWidth={1.5}
                  className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>
              {profileOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3">
                  <div>
                    <label className="text-[12px] text-[#8A8A82] dark:text-[#9A9A92] mb-1 block">
                      Your name{" "}
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Your name"
                      className={`w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3B4E90]/30 dark:focus:ring-[#8FA3E0]/30 ${
                        attempted && nameMissing
                          ? "border-red-400 dark:border-red-500"
                          : "border-[#E4E4E0] dark:border-[#2A2E38]"
                      }`}
                    />
                    {attempted && nameMissing && (
                      <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                        Required.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[12px] text-[#8A8A82] dark:text-[#9A9A92] mb-1 block">
                      Core skills / expertise{" "}
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      value={profile.skills}
                      onChange={(e) =>
                        setProfile({ ...profile, skills: e.target.value })
                      }
                      placeholder="Core skills / expertise"
                      className={`w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3B4E90]/30 dark:focus:ring-[#8FA3E0]/30 ${
                        attempted && skillsMissing
                          ? "border-red-400 dark:border-red-500"
                          : "border-[#E4E4E0] dark:border-[#2A2E38]"
                      }`}
                    />
                    {attempted && skillsMissing && (
                      <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                        Required.
                      </p>
                    )}
                  </div>
                  <textarea
                    value={profile.snippet}
                    onChange={(e) =>
                      setProfile({ ...profile, snippet: e.target.value })
                    }
                    placeholder="A past project worth referencing (optional)"
                    rows={2}
                    className="w-full border border-[#E4E4E0] dark:border-[#2A2E38] rounded px-3 py-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/30 dark:focus:ring-[#8FA3E0]/30"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setProfile({ ...profile, tone: t })}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          profile.tone === t
                            ? "bg-[#3B4E90] text-white border-[#3B4E90]"
                            : "border-[#E4E4E0] dark:border-[#2A2E38] text-[#4A4A44] dark:text-[#D8D8D2]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleDraft}
              disabled={loading}
              className="self-start mt-1 flex items-center gap-3 rounded-full pl-3 pr-6 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
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
              {loading ? "Drafting..." : "Seal & draft"}
            </button>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* RIGHT: output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-[#4A4A44] dark:text-[#D8D8D2]">
                The draft
              </label>
              {draft && (
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
                      downloadAsDocx(draft, filenameBase, {
                        title: profile.name,
                        subtitle: "Proposal",
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
                      downloadAsPdf(draft, filenameBase, {
                        title: profile.name,
                        subtitle: "Proposal",
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
            <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-md p-6 min-h-105 whitespace-pre-wrap text-[15px] leading-[1.75]">
              {draft ? (
                draft
              ) : (
                <span className="text-[#B9B9AF] dark:text-[#6B6B63] font-sans text-sm not-italic">
                  Your proposal will take shape here once you paste a posting
                  and seal it.
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
