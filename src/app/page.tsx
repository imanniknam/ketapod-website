import { PageBackdrop } from "@/components/primitives/PageBackdrop";
import { PageView } from "@/components/primitives/PageView";
import { ScrollProgress } from "@/components/primitives/ScrollProgress";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { InteractiveDemo } from "@/components/sections/InteractiveDemo";
import { Kids } from "@/components/sections/Kids";
import { LeadForm } from "@/components/sections/LeadForm";
import { Localization } from "@/components/sections/Localization";
import { Problem } from "@/components/sections/Problem";
import { SocialProof } from "@/components/sections/SocialProof";
import { WhyUs } from "@/components/sections/WhyUs";

export default function HomePage() {
  return (
    <>
      <PageBackdrop />
      <ScrollProgress />
      <PageView />
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Problem />
        <Features />
        <InteractiveDemo />
        <Kids />
        <Localization />
        <SocialProof />
        <Faq />
        <LeadForm />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
