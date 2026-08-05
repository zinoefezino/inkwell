import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  File01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Header from "@/components/Header";

const WHAT = [
  {
    icon: Mail01Icon,
    title: "Proposals",
    body: "A tailored, tone-matched proposal for the specific posting — never a template with the blanks filled in.",
  },
  {
    icon: File01Icon,
    title: "CVs",
    body: "Your CV, re-ordered and re-weighted around what this posting actually cares about — same experience, sharper framing.",
  },
];

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

const TESTIMONIALS = [
  {
    name: "Amara",
    role: "Freelance copywriter",
    rating: 5,
    quote:
      "I used to spend twenty minutes rewriting the same proposal for every posting. Now it actually reads like I read the job.",
  },
  {
    name: "Daniel",
    role: "Product designer, job seeking",
    rating: 5,
    quote:
      "It didn't invent anything about my background, it just moved the right parts of my CV to the top. That's the part I trust.",
  },
  {
    name: "Priya",
    role: "Freelance developer",
    rating: 5,
    quote:
      "Cut my application time down a lot. I still tweak the tone before sending, but the first draft isn't generic filler anymore.",
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

// Shared button styles, used identically in the Hero and the Closing CTA
const btnPrimary =
  "inline-flex items-center justify-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-white bg-[#2B3A67] hover:opacity-90 transition-opacity";
const btnPrimaryInverted =
  "inline-flex items-center justify-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-[#2B3A67] bg-white hover:opacity-90 transition-opacity";
const btnSecondary =
  "inline-flex items-center justify-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-[#2B3A67] dark:text-[#8FA3E0] border border-[#2B3A67] dark:border-[#8FA3E0] hover:bg-[#2B3A67]/5 dark:hover:bg-[#8FA3E0]/10 transition-colors";
const btnSecondaryInverted =
  "inline-flex items-center justify-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-white border border-white/40 hover:bg-white/10 transition-colors";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] tracking-[0.15em] uppercase text-[#8A8A82] dark:text-[#9A9A92]">
      {children}
    </span>
  );
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#14171F] text-[#14171F] dark:text-[#F2F2EE]">
      <Header />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* <Eyebrow>for freelancers & job seekers</Eyebrow> */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mt-4 mb-6">
            Tailored proposals and CVs, in{" "}
            <span className="text-[#2B3A67] dark:text-[#8FA3E0]">seconds.</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] max-w-md mb-8">
            Inkwell reorders and re-emphasizes your existing experience so every
            proposal and every CV leads with what you do have, not what you
            don&apos;t.
          </p>
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-xs sm:max-w-none md:w-auto">
            <Link href="/compose" className={btnPrimary}>
              <HugeiconsIcon
                icon={Mail01Icon}
                size={18}
                color="#ffffff"
                strokeWidth={1.5}
              />
              Tailor a proposal
            </Link>
            <Link href="/cv" className={btnSecondary}>
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

        <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E4E4E0] dark:border-[#2A2E38] text-[11px] tracking-wide uppercase text-[#8A8A82] dark:text-[#9A9A92]">
            the posting
          </div>
          <p className="px-4 py-3 text-[12.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC] border-b border-[#E4E4E0] dark:border-[#2A2E38]">
            &quot;...seeking someone with strong client communication and a
            proven track record delivering on tight deadlines...&quot;
          </p>

          <div className="grid grid-cols-2 divide-x divide-[#E4E4E0] dark:divide-[#2A2E38]">
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10.5px] tracking-wide uppercase text-[#8A8A82] dark:text-[#9A9A92] mb-2">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={14}
                  color="#8A8A82"
                  strokeWidth={1.5}
                />
                proposal
              </div>
              <p className="text-[13px] leading-relaxed">
                &quot;I&apos;ve delivered client work end to end under similar
                timelines, most recently with weekly check-ins and a hard launch
                date...&quot;
              </p>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10.5px] tracking-wide uppercase text-[#8A8A82] dark:text-[#9A9A92] mb-2">
                <HugeiconsIcon
                  icon={File01Icon}
                  size={14}
                  color="#8A8A82"
                  strokeWidth={1.5}
                />
                cv
              </div>
              <p className="text-[13px] leading-relaxed">
                Client-delivery experience moved to the top, framed around speed
                and communication...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT INKWELL DOES */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              What Inkwell does
            </h2>
          </div>

          <div className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-lg grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E4E4E0] dark:divide-[#2A2E38] bg-white dark:bg-[#14171F]">
            {WHAT.map((w) => (
              <div key={w.title} className="p-8">
                <div className="w-10 h-10 rounded-full bg-[#2B3A67]/5 dark:bg-[#8FA3E0]/10 flex items-center justify-center mb-5">
                  <HugeiconsIcon
                    icon={w.icon}
                    size={18}
                    color="#2B3A67"
                    strokeWidth={1.5}
                    className="dark:brightness-125"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">{w.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-[#6B6B63] dark:text-[#B5B5AC] max-w-xs">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38]">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
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
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38] py-20 bg-[#FAFAF8] dark:bg-[#1B1F29] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <span className="text-[80px] leading-none text-[#C9A227] font-serif block opacity-60 select-none">
            &ldquo;
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-2xl mx-auto -mt-12">
            Your tenth application of the day should never sound like your
            first.
          </h2>
          <p className="text-[#6B6B63] dark:text-[#B5B5AC] text-base max-w-xl mx-auto leading-relaxed">
            Inkwell eliminates application fatigue by automatically framing your
            proven history around what each client needs.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38]">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              Loved by freelancers and job seekers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="border border-[#E4E4E0] dark:border-[#2A2E38] rounded-lg p-6 flex flex-col"
              >
                <div
                  className="flex gap-0.5 mb-4"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < t.rating
                          ? "text-[#C9A227]"
                          : "text-[#E4E4E0] dark:text-[#2A2E38]"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[14.5px] leading-relaxed text-[#4A4A44] dark:text-[#D8D8D2] mb-6 flex-1">
                  &quot;{t.quote}&quot;
                </p>
                <div>
                  <p className="text-[14px] font-medium">{t.name}</p>
                  <p className="text-[12.5px] text-[#8A8A82] dark:text-[#9A9A92]">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38] bg-[#FAFAF8] dark:bg-[#1B1F29]">
        <div className="max-w-3xl mx-auto px-8 py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mt-3">Questions</h2>
          </div>
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
      <section className="border-t border-[#E4E4E0] dark:border-[#2A2E38] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl bg-[#2B3A67] dark:bg-[#3B4E90] px-8 py-16 text-center text-white shadow-xl shadow-[#2B3A67]/10 dark:shadow-none dark:ring-1 dark:ring-white/10 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Stop starting from a blank page.
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
              Transform your raw experience into targeted proposals and
              structured CVs in seconds.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link href="/compose" className={btnPrimaryInverted}>
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  color="#2B3A67"
                  strokeWidth={1.5}
                />
                Tailor a proposal
              </Link>
              <Link href="/cv" className={btnSecondaryInverted}>
                <HugeiconsIcon
                  icon={File01Icon}
                  size={18}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                Tailor a CV
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E4E4E0] dark:border-[#2A2E38] max-w-6xl mx-auto px-8 py-8 flex items-center justify-between text-[13px] text-[#8A8A82] dark:text-[#9A9A92]">
        <span>inkwell</span>
        <span>© {new Date().getFullYear()} · Tailored proposals & CVs</span>
      </footer>
    </div>
  );
}
