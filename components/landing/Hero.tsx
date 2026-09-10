import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, File01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import ProductPhoneDemo from "@/components/ProductPhoneDemo";

export default function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto overflow-hidden px-4 sm:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
      <div className="absolute inset-x-0 bottom-0 z-20 h-20 bg-white dark:bg-[#14171F]" />
      <div className="absolute inset-x-0 bottom-20 z-30 border-t border-[#E4E4E0] dark:border-[#2A2E38]" />

      <div className="relative z-10 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-[#F2F2EE] leading-[1.1] mb-6">
          Tailored proposals and CVs, in{" "}
          <span className="text-[#3B4E90] dark:text-[#8FA3E0]">seconds.</span>
        </h1>
        <p className="mx-auto max-w-md text-[17px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] mb-8 md:mx-0">
          Transform your raw experience into targeted proposals and structured
          CVs in seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          <Link
            href="/compose"
            className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-white bg-[#3B4E90] hover:opacity-90 transition-opacity shadow-sm shadow-[#3B4E90]/20"
          >
            <HugeiconsIcon
              icon={Mail01Icon}
              size={18}
              color="#ffffff"
              strokeWidth={1.5}
            />
            Create a proposal
          </Link>
          <Link
            href="/cv"
            className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-[#3B4E90] dark:text-[#8FA3E0] border border-[#3B4E90]/40 dark:border-[#8FA3E0]/50 hover:bg-[#3B4E90]/5 dark:hover:bg-[#8FA3E0]/10 transition-colors"
          >
            <HugeiconsIcon
              icon={File01Icon}
              size={18}
              color="currentColor"
              strokeWidth={1.5}
            />
            Create a CV
          </Link>
        </div>
      </div>

      <ProductPhoneDemo className="translate-y-20 justify-center md:justify-end" />
    </section>
  );
}