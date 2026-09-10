import { HugeiconsIcon } from "@hugeicons/react";
import { PROOF } from "@/lib/landingContent";

export default function ProofStrip() {
  return (
    <section className="border-b border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
        <div className="mb-8 sm:mb-10 text-center max-w-lg mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F2F2EE] leading-[1.15] mb-4">
            Honest output. Fast turnaround. Ready to send.
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {PROOF.map((p) => (
            <div
              key={p.title}
              className="group relative rounded-2xl border border-[#E4E4E0] dark:border-[#2A2E38] bg-white dark:bg-[#14171F] p-5 sm:p-6 shadow-sm shadow-[#14171F]/[0.03] transition-shadow hover:shadow-md hover:shadow-[#14171F]/[0.06]"
            >
              <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent opacity-80" />
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2B3A67]/[0.08] dark:bg-[#8FA3E0]/12 ring-1 ring-[#2B3A67]/10 dark:ring-[#8FA3E0]/20">
                <HugeiconsIcon
                  icon={p.icon}
                  size={18}
                  color="#2B3A67"
                  strokeWidth={1.5}
                  className="dark:brightness-125"
                />
              </span>
              <p className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-[#F2F2EE]">
                {p.title}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
