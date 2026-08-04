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
    <header className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <HugeiconsIcon
          icon={FeatherIcon}
          size={32}
          color="#2B3A67"
          strokeWidth={1.5}
        />
        <span className="text-lg font-medium text-[#2B3A67]">Inkwell</span>
      </Link>

      <div className="flex items-center gap-6">
        <Show when="signed-in">
          <nav className="flex items-center gap-5">
            <Link
              href="/compose"
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] hover:text-[#2B3A67] transition-colors"
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
              />
              Proposal
            </Link>
            <Link
              href="/cv"
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] hover:text-[#2B3A67] transition-colors"
            >
              <HugeiconsIcon
                icon={File01Icon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
              />
              CV
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A44] hover:text-[#2B3A67] transition-colors"
            >
              <HugeiconsIcon
                icon={Archive01Icon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
              />
              Archive
            </Link>
          </nav>
          <UserButton />
        </Show>

        <Show when="signed-out">
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
            <button className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-white bg-[#2B3A67] hover:opacity-90 transition-opacity">
              Sign in
            </button>
          </SignInButton>
        </Show>
      </div>
    </header>
  );
}
