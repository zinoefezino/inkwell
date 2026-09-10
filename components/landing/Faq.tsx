import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { FAQS } from "@/lib/landingContent";

export default function Faq() {
  return (
    <section className="border-b border-[#E4E4E0] dark:border-[#2A2E38]">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          Questions
        </h2>
        <div className="divide-y divide-[#E4E4E0] dark:divide-[#2A2E38]">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                <span className="text-[15px] font-medium">{f.q}</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="shrink-0 text-[#8A8A82] dark:text-[#9A9A92] transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="text-[14px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC] mt-3 max-w-lg">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
