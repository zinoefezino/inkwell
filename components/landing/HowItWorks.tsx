import { STEPS } from "@/lib/landingContent";

export default function HowItWorks() {
  return (
    <section className="border-b border-[#E4E4E0] dark:border-[#2A2E38]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20 md:py-24">
        <div className="mb-12 text-center md:text-left max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F2F2EE]">
            How it works
          </h2>
          <p className="mt-3 text-[15.5px] text-[#6B6B63] dark:text-[#B5B5AC]">
            Three steps from raw posting to a saved proposal and CV.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-[#E4E4E0] dark:border-[#2A2E38] bg-white dark:bg-[#14171F] p-7"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2B3A67]/8 dark:bg-[#8FA3E0]/12 text-[13px] font-semibold text-[#2B3A67] dark:text-[#8FA3E0]">
                {s.n}
              </span>
              <h3 className="text-xl font-semibold mt-5 mb-2 tracking-tight">
                {s.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
