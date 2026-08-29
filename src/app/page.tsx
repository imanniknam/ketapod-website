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

/**
 * Home. Section order follows design-web-v1.1-HomePage:
 * Header → Hero → Why Us → Problem → Features → Interactive Demo → Kids →
 * Localization → Social Proof → FAQ → Lead Form → Final CTA → Footer.
 *
 * The spec's Trust Strip (the KPI card under the hero) was dropped at the
 * client's request; the same figures still appear in Social Proof.
 */
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
