"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  Sun03Icon,
  Moon02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

type ThemeChoice = "light" | "dark" | "system";

function applyTheme(choice: ThemeChoice) {
  const isDark =
    choice === "dark" ||
    (choice === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

const OPTIONS: { value: ThemeChoice; label: string; icon: React.ReactNode }[] =
  [
    {
      value: "light",
      label: "Light",
      icon: (
        <HugeiconsIcon
          icon={Sun03Icon}
          size={17}
          color="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      value: "dark",
      label: "Dark",
      icon: (
        <HugeiconsIcon
          icon={Moon02Icon}
          size={17}
          color="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
    {
      value: "system",
      label: "System",
      icon: (
        <HugeiconsIcon
          icon={ComputerIcon}
          size={17}
          color="currentColor"
          strokeWidth={1.5}
        />
      ),
    },
  ];

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored =
      (localStorage.getItem("inkwell-theme") as ThemeChoice) || "system";
    setChoice(stored);
    applyTheme(stored);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current =
        (localStorage.getItem("inkwell-theme") as ThemeChoice) || "system";
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(next: ThemeChoice) {
    setChoice(next);
    localStorage.setItem("inkwell-theme", next);
    applyTheme(next);
    setOpen(false);
  }

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const current = OPTIONS.find((o) => o.value === choice)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Theme: ${current.label}. Click to change.`}
        title={current.label}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E4E4E0] dark:border-[#2A2E38] text-[#4A4A44] dark:text-[#D8D8D2] hover:border-[#2B3A67] dark:hover:border-[#8FA3E0] transition-colors"
      >
        {current.icon}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg border border-[#E4E4E0] dark:border-[#2A2E38] bg-white dark:bg-[#14171F] shadow-lg py-1 z-50">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#4A4A44] dark:text-[#D8D8D2] hover:bg-[#FAFAF8] dark:hover:bg-[#1B1F29] transition-colors"
            >
              <span className="text-[#8A8A82] dark:text-[#9A9A92]">
                {opt.icon}
              </span>
              <span className="flex-1 text-left">{opt.label}</span>
              {choice === opt.value && (
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={15}
                  color="#2B3A67"
                  strokeWidth={2}
                  className="dark:brightness-125"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
