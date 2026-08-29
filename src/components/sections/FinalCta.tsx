"use client";

import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { AssetSlot, Float } from "@/components/primitives/AssetSlot";
import { asset } from "@/lib/assets";
import { Cta } from "@/components/primitives/Cta";
import { Reveal } from "@/components/primitives/Reveal";
import { Waveform } from "@/components/primitives/Waveform";
import { FINAL_CTA } from "@/lib/content";
import { EASE_OUT_EXPO } from "@/lib/motion";

/** Section 13 — Final CTA. Static copy, last push before the footer. */
export function FinalCta() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="final-cta" className="relative pb-16 sm:pb-20 md:pb-28">
      <div className="container-k">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(215deg,#151C5E_0%,#0F1440_48%,#0B0F2A_100%)] px-5 py-12 sm:px-8 sm:py-14 md:px-16 md:py-20">
          {/* atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 right-[10%] size-[480px] rounded-full bg-[radial-gradient(circle,rgba(110,120,255,0.34)_0%,transparent_66%)]" />
            <div className="dotgrid absolute inset-0 text-white/[0.06]" />
            <Waveform
              bars={70}
              active={!prefersReduced}
              seed={57}
              minScale={0.08}
              className="absolute inset-x-0 bottom-0 h-24 text-white/[0.09]"
              barClassName="w-[4px]"
            />
          </div>

          <div className="relative grid items-center gap-10 md:grid-cols-[1.25fr_0.75fr]">
            <div>
              <Reveal>
                <span className="eyebrow text-violet-200">
                  <span className="tnum text-[15px] tracking-normal">10</span>
                  <span className="block h-px w-10 bg-white/20" aria-hidden />
                  Start Listening
                </span>
              </Reveal>

              <motion.h2
                className="mt-5 max-w-[18ch] text-[32px] font-extrabold leading-[1.45] text-white sm:text-[40px] md:text-[46px]"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              >
                {FINAL_CTA.title}
              </motion.h2>

              <Reveal delay={0.12}>
                <p className="mt-5 max-w-[46ch] text-[18px] leading-[2] text-white/70">
                  {FINAL_CTA.subtitle}
                </p>
              </Reveal>

              <Reveal delay={0.2} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Cta
                  label={FINAL_CTA.primaryCta.label}
                  target={FINAL_CTA.primaryCta.target}
                  event="final_cta_clicked"
                  section="final-cta"
                  element="primary_cta"
                  variant="violet"
                  className="h-[60px] min-h-[60px] w-full bg-white px-8 text-[19px] text-violet-700 shadow-e3 hover:bg-violet-100 sm:w-auto"
                />
                <Cta
                  label={FINAL_CTA.secondaryCta.label}
                  target={FINAL_CTA.secondaryCta.target}
                  event="hero_secondary_cta_clicked"
                  section="final-cta"
                  element="secondary_cta"
                  variant="onnight"
                  arrow={false}
                  icon={<Play className="size-4 fill-current" strokeWidth={0} aria-hidden />}
                  className="h-[60px] min-h-[60px] w-full px-7 text-[19px] sm:w-auto"
                />
              </Reveal>
            </div>

            <Reveal delay={0.15} className="relative mx-auto w-full max-w-[260px]">
              <Float amplitude={12} duration={6.5} rotate={2}>
                <AssetSlot
                  src={asset("finalCtaHeadphones")}
                  alt="هدفون سه‌بعدی با دکمه پخش"
                  label="هدفون سه‌بعدی — المان پایانی صفحه"
                  ratio="384 / 212"
                  tone="night"
                  rounded="rounded-2xl"
                />
              </Float>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
