import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  File01Icon,
  Archive01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#E4E4E0] dark:border-[#2A2E38] bg-white/80 dark:bg-[#14171F]/80 backdrop-blur-md backdrop-saturate-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo2.png"
              alt="Inkwell logo"
              className="w-10 h-10 md:w-10 md:h-10 dark:brightness-125 dark:contrast-125"
            />
            <span className="text-base md:text-lg font-medium text-[#2B3A67] dark:text-[#8FA3E0] -ml-3">
              Inkwell
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Show when="signed-in">
              <nav className="flex items-center gap-1 md:gap-5">
                <Link
                  href="/compose"
                  title="Proposal"
                  className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] dark:text-[#D8D8D2] hover:text-[#2B3A67] dark:hover:text-[#8FA3E0] transition-colors p-2 md:p-0 rounded-full hover:bg-[#2B3A67]/5 dark:hover:bg-[#8FA3E0]/10 md:hover:bg-transparent"
                >
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                  <span className="hidden md:inline">Proposal</span>
                </Link>
                <Link
                  href="/cv"
                  title="CV"
                  className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] dark:text-[#D8D8D2] hover:text-[#2B3A67] dark:hover:text-[#8FA3E0] transition-colors p-2 md:p-0 rounded-full hover:bg-[#2B3A67]/5 dark:hover:bg-[#8FA3E0]/10 md:hover:bg-transparent"
                >
                  <HugeiconsIcon
                    icon={File01Icon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                  <span className="hidden md:inline">CV</span>
                </Link>
                <Link
                  href="/dashboard"
                  title="Archive"
                  className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] dark:text-[#D8D8D2] hover:text-[#2B3A67] dark:hover:text-[#8FA3E0] transition-colors p-2 md:p-0 rounded-full hover:bg-[#2B3A67]/5 dark:hover:bg-[#8FA3E0]/10 md:hover:bg-transparent"
                >
                  <HugeiconsIcon
                    icon={Archive01Icon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                  <span className="hidden md:inline">Archive</span>
                </Link>
              </nav>
              <ThemeToggle />
              <UserButton />
            </Show>

            <Show when="signed-out">
              <ThemeToggle />
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-5 md:pr-6 py-2.5 md:py-3 text-sm font-medium text-white bg-[#2B3A67] hover:opacity-90 transition-opacity">
                  Sign in
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </header>

      {/* Spacer: offsets the fixed header's height so content isn't hidden underneath */}
      <div className="h-16 md:h-20" />
    </>
  );
}
