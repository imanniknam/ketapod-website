import dynamic from "next/dynamic";
import { PageBackdrop } from "@/components/primitives/PageBackdrop";
import { PageView } from "@/components/primitives/PageView";
import { ScrollProgress } from "@/components/primitives/ScrollProgress";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Kids } from "@/components/sections/Kids";
import { Problem } from "@/components/sections/Problem";
import { WhyUs } from "@/components/sections/WhyUs";

/*
 * These four are the only sections left that still need an animation library,
 * and they are also the four nobody can see on arrival: the audio player and
 * its state machine, the validated lead form, and the two API-backed rails.
 *
 * Split out, they still server-render into the HTML — no `loading` fallback and
 * no `ssr: false`, so nothing flashes and the content is in the document for
 * crawlers. Only their JavaScript becomes a separate chunk, so it stops
 * competing with hydrating the part of the page that is actually on screen.
 */
const InteractiveDemo = dynamic(() =>
  import("@/components/sections/InteractiveDemo").then((m) => m.InteractiveDemo),
);

const Localization = dynamic(() =>
  import("@/components/sections/Localization").then((m) => m.Localization),
);

const SocialProof = dynamic(() =>
  import("@/components/sections/SocialProof").then((m) => m.SocialProof),
);

const LeadForm = dynamic(() =>
  import("@/components/sections/LeadForm").then((m) => m.LeadForm),
);

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
