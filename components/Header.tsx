import { HugeiconsIcon } from "@hugeicons/react";
import {
  FeatherIcon,
  Mail01Icon,
  File01Icon,
  Archive01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center shrink-0">
        {/* <HugeiconsIcon
          icon={FeatherIcon}
          size={28}
          color="#2B3A67"
          strokeWidth={1.5}
          className="md:w-8! md:h-8!"
        /> */}
        <img
          src="/logo2.png"
          alt="Inkwell logo"
          className="w-20 h-20 md:w-20 md:h-20"
        />
        <span className="text-base md:text-lg font-medium text-[#2B3A67]">
          Inkwell
        </span>
      </Link>

      <div className="flex items-center gap-3 md:gap-6">
        <Show when="signed-in">
          <nav className="flex items-center gap-1 md:gap-5">
            <Link
              href="/compose"
              title="Proposal"
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] hover:text-[#2B3A67] transition-colors p-2 md:p-0 rounded-full hover:bg-[#2B3A67]/5 md:hover:bg-transparent"
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
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] hover:text-[#2B3A67] transition-colors p-2 md:p-0 rounded-full hover:bg-[#2B3A67]/5 md:hover:bg-transparent"
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
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] hover:text-[#2B3A67] transition-colors p-2 md:p-0 rounded-full hover:bg-[#2B3A67]/5 md:hover:bg-transparent"
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
          <UserButton />
        </Show>

        <Show when="signed-out">
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
            <button className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-5 md:pr-6 py-2.5 md:py-3 text-sm font-medium text-white bg-[#2B3A67] hover:opacity-90 transition-opacity">
              Sign in
            </button>
          </SignInButton>
        </Show>
      </div>
    </header>
  );
}
