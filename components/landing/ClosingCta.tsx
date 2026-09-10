import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function ClosingCta() {
  return (
    <section className="py-16 sm:py-20 bg-[#14171F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-[#3B4E90] px-8 py-14 sm:py-16 text-center text-white shadow-xl shadow-black/20 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Stop starting from a blank page.
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
            Turn raw experience into targeted proposals and structured CVs in
            seconds.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/compose"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[#3B4E90] bg-white hover:bg-[#F2F2EE] transition-colors shadow-sm"
            >
              Create a proposal
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="#3B4E90"
                strokeWidth={2}
              />
            </Link>
            <Link
              href="/cv"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Create a CV
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}