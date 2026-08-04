"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("inkwell-theme", next ? "dark" : "light");
  }

  // Avoid a flash of the wrong icon before hydration determines the real state
  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E4E4E0] dark:border-[#2A2E38] text-[#4A4A44] dark:text-[#D8D8D2] hover:border-[#2B3A67] dark:hover:border-[#8FA3E0] transition-colors"
    >
      <HugeiconsIcon
        icon={dark ? Sun03Icon : Moon02Icon}
        size={18}
        color="currentColor"
        strokeWidth={1.5}
      />
    </button>
  );
}
