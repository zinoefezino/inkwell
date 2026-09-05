import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FeatherIcon,
  Mail01Icon,
  File01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Header from "@/components/Header";

const STEPS = [
  {
    n: "01",
    title: "Paste the posting",
    body: "Drop in the raw job listing, exactly as you found it. No formatting, no cleanup.",
  },
  {
    n: "02",
    title: "Add your voice",
    body: "Your skills, your tone, a project worth referencing. Set once, reused every time.",
  },
  {
    n: "03",
    title: "Seal & send",
    body: "A tailored proposal and CV in seconds — no generic filler, no dwelling on what you don't have.",
  },
];

const FAQS = [
  {
    q: "Is Inkwell free?",
    a: "Yes, for now — there's no paid tier yet.",
  },
  {
    q: "Does it just make things up about my experience?",
    a: "No — for CVs, Inkwell only reorders and re-emphasizes what's already in your CV. It doesn't invent skills or experience you don't have.",
  },
  {
    q: "Is my data private?",
    a: "Your proposals and CVs are saved to your account so you can find them later, and are only visible to you when signed in.",
  },
  {
    q: "What file formats can I upload for my CV?",
    a: "Paste your CV as text, or upload a .txt, .docx, or .pdf file — Inkwell extracts the text automatically.",
  },
  {
    q: "Can I download what I generate?",
    a: "Yes — copy to clipboard, or download as a formatted Word (.docx) or PDF document.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#14171F] text-[#14171F] dark:text-[#F2F2EE]">
      <Header />

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto overflow-hidden px-4 sm:px-8 pt-16 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div className="absolute inset-x-0 bottom-0 z-20 h-20 bg-white dark:bg-[#14171F]" />
        <div className="absolute inset-x-0 bottom-20 z-30 border-t border-[#E4E4E0] dark:border-[#2A2E38]" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-[#F2F2EE] leading-[1.1] mb-6">
            Tailored proposals and CVs, in{" "}
            <span className="text-[#2B3A67] dark:text-[#8FA3E0]">seconds.</span>
          </h1>
          <p className="mx-auto max-w-md text-[17px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] mb-8 md:mx-0">
            Inkwell reorders and re-emphasizes your existing experience so every
            proposal and every CV leads with what you do have, not what you
            don&apos;t.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/compose"
              className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-white bg-[#2B3A67] hover:opacity-90 transition-opacity"
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                size={18}
                color="#ffffff"
                strokeWidth={1.5}
              />
              Tailor a proposal
            </Link>
            <Link
              href="/cv"
              className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-[#2B3A67] dark:text-[#8FA3E0] border border-[#2B3A67] dark:border-[#8FA3E0] hover:bg-[#2B3A67]/5 dark:hover:bg-[#8FA3E0]/10 transition-colors"
            >
              <HugeiconsIcon
                icon={File01Icon}
                size={18}
                color="#2B3A67"
                strokeWidth={1.5}
              />
              Tailor a CV
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex translate-y-20 justify-center md:justify-end">
          <div className="relative w-full max-w-95 aspect-380/600 rounded-[3.2rem] border-10 border-[#14171F] dark:border-[#2A2E38] bg-white dark:bg-[#14171F] shadow-2xl overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-27.5 h-7.5 bg-black rounded-full z-10" />

            {/* Mini app content */}
            <div className="px-6 pt-14 pb-8 h-full flex flex-col">
              {/* Mini header */}
              <div className="flex items-center mb-8">
                <img
                  src="/logo4.png"
                  alt="Inkwell logo"
                  className="w-auto h-15"
                />

                <span className="ml-auto w-8 h-8 rounded-full bg-[#2B3A67]/10 dark:bg-[#8FA3E0]/20" />
              </div>

              <p className="text-[19px] font-medium mb-1">Your archive</p>
              <p className="text-[12px] text-[#8A8A82] dark:text-[#9A9A92] mb-5">
                6 sealed so far.
              </p>

              {/* Mini filter pills */}
              <div className="flex gap-1.5 mb-5">
                <span className="text-[11px] px-3 py-1.5 rounded-full bg-[#2B3A67] text-white">
                  All
                </span>
                <span className="text-[11px] px-3 py-1.5 rounded-full text-[#6B6B63] dark:text-[#B5B5AC] border border-[#E4E4E0] dark:border-[#2A2E38]">
                  Proposals
                </span>
                <span className="text-[11px] px-3 py-1.5 rounded-full text-[#6B6B63] dark:text-[#B5B5AC] border border-[#E4E4E0] dark:border-[#2A2E38]">
                  CVs
                </span>
              </div>

              {/* Mini archive rows */}
              <div className="flex flex-col gap-2.5">
                {[
                  { color: "bg-[#2B3A67] dark:bg-[#8FA3E0]", w: "w-[85%]" },
                  { color: "bg-[#C9A227]", w: "w-[70%]" },
                  { color: "bg-[#2B3A67] dark:bg-[#8FA3E0]", w: "w-[90%]" },
                  { color: "bg-[#C9A227]", w: "w-[60%]" },
                  { color: "bg-[#2B3A67] dark:bg-[#8FA3E0]", w: "w-[75%]" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="relative rounded border border-[#E4E4E0] dark:border-[#2A2E38] pl-4 pr-3 py-3.5 overflow-hidden"
                  >
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-0.75 ${row.color}`}
                    />
                    <div
                      className={`h-2 rounded-full bg-[#E4E4E0] dark:bg-[#2A2E38] ${row.w}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT INKWELL DOES */}
      <section>
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-lg grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E4E4E0] dark:divide-[#2A2E38]">
            <div className="p-8">
              <div className="w-10 h-10 rounded-full bg-[#2B3A67]/5 dark:bg-[#8FA3E0]/10 flex items-center justify-center mb-5">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  color="#2B3A67"
                  strokeWidth={1.5}
                  className="dark:brightness-125"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Proposals</h3>
              <p className="text-[14.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC] max-w-xs">
                A tailored, tone-matched proposal for the specific posting —
                never a template with the blanks filled in.
              </p>
            </div>
            <div className="p-8">
              <div className="w-10 h-10 rounded-full bg-[#2B3A67]/5 dark:bg-[#8FA3E0]/10 flex items-center justify-center mb-5">
                <HugeiconsIcon
                  icon={File01Icon}
                  size={18}
                  color="#2B3A67"
                  strokeWidth={1.5}
                  className="dark:brightness-125"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">CVs</h3>
              <p className="text-[14.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC] max-w-xs">
                A structured, formatted CV that emphasizes the skills and
                experience the client is looking for without inventing anything
                you don't have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]">
        <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-10">
          {STEPS.map((s) => (
            <div key={s.n}>
              <span className="text-[13px] text-[#C9A227]">{s.n}</span>
              <h3 className="text-xl font-medium mt-2 mb-2">{s.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 bg-[#FAFAF8] dark:bg-[#1B1F29] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <span className="text-[80px] leading-none text-[#2B3A67] dark:text-[#8FA3E0] font-serif block opacity-50 select-none">
            "
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight max-w-2xl mx-auto -mt-12">
            Your tenth application of the day should never sound like your
            first.
          </h2>
          <p className="text-[#6B6B63] dark:text-[#B5B5AC] text-base max-w-xl mx-auto leading-relaxed">
            Inkwell eliminates application fatigue by automatically framing your
            proven history around what each client needs.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]">
        <div className="max-w-3xl mx-auto px-8 py-20">
          <h2 className="text-2xl font-medium mb-8">Questions</h2>
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

      {/* CLOSING CTA */}
      <section className="py-20 bg-slate-50 dark:bg-[#1B1F29]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-[#2B3A67] px-8 py-16 text-center text-white shadow-xl shadow-[#2B3A67]/10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Stop starting from a blank page.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
              Transform your raw experience into targeted proposals and
              structured CVs in seconds.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link
                href="/compose"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#2B3A67] bg-white hover:bg-slate-100 transition-colors shadow-sm"
              >
                Tailor a Proposal
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  color="#2B3A67"
                  strokeWidth={2}
                />
              </Link>
              <Link
                href="/cv"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                Tailor a CV
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between text-[13px] text-[#8A8A82] dark:text-[#9A9A92]">
        <span>inkwell</span>
        <span>© {new Date().getFullYear()} · Tailored proposals & CVs</span>
      </footer>
    </div>
  );
}
