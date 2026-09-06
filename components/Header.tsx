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
          <div className="flex items-center shrink-0">
            <img src="/logo7.png" alt="Inkwell logo" className="w-auto h-20" />
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Show when="signed-in">
              <ThemeToggle />
              <UserButton />
            </Show>

            <Show when="signed-out">
              <ThemeToggle />
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-5 md:pr-6 py-2.5 md:py-3 text-sm font-medium text-white bg-[#3B4E90] hover:opacity-90 transition-opacity">
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
