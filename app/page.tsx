import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FeatherIcon,
  Mail01Icon,
  File01Icon,
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
    <div className="min-h-screen bg-white text-[#14171F]">
      <Header />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div>
          <span className="text-[11px] tracking-[0.15em] uppercase text-[#8A8A82]">
            for freelancers & job seekers
          </span>
          <h1 className="text-[2.75rem] md:text-[3.5rem] leading-[1.05] font-medium mt-4 mb-6">
            Every application deserves work that sounds like you.
          </h1>
          <p className="text-[17px] leading-relaxed text-[#4A4A44] max-w-md mb-8">
            Inkwell reads the job, remembers your voice, and tailors both your
            proposal and your CV to it — because it did the reading so you
            didn&apos;t have to.
          </p>
          <div className="flex flex-wrap gap-3">
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
              className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-[#2B3A67] border border-[#2B3A67] hover:bg-[#2B3A67]/5 transition-colors"
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

        <div className="border border-[#E4E4E0] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E4E4E0] text-[11px] tracking-wide uppercase text-[#8A8A82]">
            the posting
          </div>
          <p className="px-4 py-3 text-[12.5px] leading-relaxed text-[#6B6B63] border-b border-[#E4E4E0]">
            &quot;...seeking someone with strong client communication and a
            proven track record delivering on tight deadlines...&quot;
          </p>

          <div className="grid grid-cols-2 divide-x divide-[#E4E4E0]">
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10.5px] tracking-wide uppercase text-[#8A8A82] mb-2">
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
              <div className="flex items-center gap-1.5 text-[10.5px] tracking-wide uppercase text-[#8A8A82] mb-2">
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
      <section className="border-t border-[#E4E4E0]">
        <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-8">
          <div className="border border-[#E4E4E0] rounded-lg p-6">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={28}
              color="#2B3A67"
              strokeWidth={1.5}
            />
            <h3 className="text-xl font-medium mt-4 mb-2">Proposals</h3>
            <p className="text-[14.5px] leading-relaxed text-[#6B6B63]">
              A tailored, tone-matched proposal for the specific posting — never
              a template with the blanks filled in.
            </p>
          </div>
          <div className="border border-[#E4E4E0] rounded-lg p-6">
            <HugeiconsIcon
              icon={File01Icon}
              size={28}
              color="#2B3A67"
              strokeWidth={1.5}
            />
            <h3 className="text-xl font-medium mt-4 mb-2">CVs</h3>
            <p className="text-[14.5px] leading-relaxed text-[#6B6B63]">
              Your CV, re-ordered and re-weighted around what this posting
              actually cares about — same experience, sharper framing.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[#E4E4E0] bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-10">
          {STEPS.map((s) => (
            <div key={s.n}>
              <span className="text-[13px] text-[#C9A227]">{s.n}</span>
              <h3 className="text-xl font-medium mt-2 mb-2">{s.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-[#6B6B63]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-[#E4E4E0]">
        <div className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <span className="text-[80px] leading-none text-[#C9A227]">
            &ldquo;
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-medium mb-4 max-w-xl">
              The tenth application of the day shouldn&apos;t sound like the
              first.
            </h2>
            <p className="text-[15.5px] leading-relaxed text-[#6B6B63] max-w-lg">
              Inkwell never dwells on what you don&apos;t have — it leads with
              what you do, drawn from your own work, so every proposal and every
              CV still sounds like you.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E4E4E0] bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl font-medium">Questions</h2>
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#8A8A82]">
              before you seal your first one
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {FAQS.map((f) => (
              <div key={f.q} className="border-t border-[#E4E4E0] pt-4">
                <h3 className="text-[15px] font-medium mb-1.5">{f.q}</h3>
                <p className="text-[14px] leading-relaxed text-[#6B6B63]">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-8 py-16">
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#2B3A67] px-8 py-14 text-center">
          <HugeiconsIcon
            icon={FeatherIcon}
            size={32}
            color="#C9A227"
            strokeWidth={1.5}
            className="mx-auto mb-5"
          />
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">
            Stop starting from a blank page.
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/compose"
              className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-[#2B3A67] bg-white hover:opacity-90 transition-opacity"
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                size={18}
                color="#2B3A67"
                strokeWidth={1.5}
              />
              Tailor a proposal
            </Link>
            <Link
              href="/cv"
              className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3 text-sm font-medium text-white border border-white/40 hover:bg-white/10 transition-colors"
            >
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
      </section>

      <footer className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between text-[13px] text-[#8A8A82]">
        <span>inkwell</span>
        <span>© 2026 · built for people who tailor</span>
      </footer>
    </div>
  );
}
