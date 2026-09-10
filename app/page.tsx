import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import ProofStrip from "@/components/landing/ProofStrip";
import FeatureProposals from "@/components/landing/FeatureProposals";
import FeatureCvs from "@/components/landing/FeatureCvs";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyQuote from "@/components/landing/WhyQuote";
import Faq from "@/components/landing/Faq";
import ClosingCta from "@/components/landing/ClosingCta";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#14171F] text-[#14171F] dark:text-[#F2F2EE]">
      <Header />
      <Hero />
      <ProofStrip />
      <FeatureProposals />
      <FeatureCvs />
      <HowItWorks />
      <WhyQuote />
      <Faq />
      <ClosingCta />
      <footer className="bg-[#14171F] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex items-center justify-between text-[13px] text-[#9A9A92]">
          <span>inkwell</span>
          <span>© {new Date().getFullYear()} · Tailored proposals & CVs</span>
        </div>
      </footer>
    </div>
  );
}
