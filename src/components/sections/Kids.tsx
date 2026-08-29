"use client";

import { motion, useReducedMotion } from "motion/react";
import { AssetSlot, Float } from "@/components/primitives/AssetSlot";
import { asset } from "@/lib/assets";
import { Icon } from "@/components/primitives/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { KIDS } from "@/lib/content";
import { trackEvent } from "@/lib/api";
import { openLeadForm } from "@/lib/leadIntent";
import { springSnappy, springSoft } from "@/lib/motion";

/**
 * Section 8 — Kids.
 *
 * Warm counterpoint to the dark demo above it. The CTA doesn't just scroll: it
 * hands the lead form a `parent` user type and a `kids` interest, so the form
 * arrives already shaped around who clicked it.
 */
export function Kids() {
  const prefersReduced = useReducedMotion();

  function handleCta() {
    trackEvent("kids_cta_clicked", "kids", "primary_cta", {
      target: "lead-form",
      presetUserType: KIDS.cta.presetUserType,
      presetInterest: KIDS.cta.presetInterest,
    });
    openLeadForm({
      userType: KIDS.cta.presetUserType,
      interest: KIDS.cta.presetInterest,
    });
  }

  return (
    <section id="kids" className="relative pb-16 sm:pb-20 md:pb-32">
      <div className="container-k">
        <div className="relative overflow-hidden rounded-2xl border border-amber/25 bg-[linear-gradient(200deg,#FFF4E4_0%,#FBF7F0_42%,#F0F2FF_100%)] px-5 py-12 sm:px-8 md:px-14 md:py-16">
          {/* atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -bottom-24 -left-16 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,176,32,0.20)_0%,transparent_68%)]" />
            <div className="absolute -top-20 right-[18%] size-[320px] rounded-full bg-[radial-gradient(circle,rgba(42,56,255,0.14)_0%,transparent_70%)]" />
            {/* a few drawn stars — the one place the page allows itself to be sweet */}
            {[
              { x: "12%", y: "18%", s: 14, d: 0 },
              { x: "34%", y: "8%", s: 9, d: 0.8 },
              { x: "8%", y: "62%", s: 11, d: 1.4 },
            ].map((st, i) => (
              <motion.svg
                key={i}
                className="absolute text-amber"
                style={{ left: st.x, top: st.y, width: st.s, height: st.s }}
                viewBox="0 0 24 24"
                fill="currentColor"
                animate={
                  prefersReduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }
                }
                transition={{ duration: 3.2, repeat: Infinity, delay: st.d }}
              >
                <path d="M12 0l2.4 8.2L22.6 12l-8.2 2.4L12 24l-2.4-9.6L1.4 12l8.2-3.8z" />
              </motion.svg>
            ))}
          </div>

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            {/* Copy */}
            <div>
              <SectionHeading
                index="05"
                eyebrow="Kids Experience"
                title={KIDS.title}
                lead={KIDS.subtitle}
              />

              <RevealGroup
                className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2"
                stagger={0.08}
                amount={0.15}
              >
                {KIDS.benefits.map((b) => (
                  <RevealItem key={b.id} className="flex gap-3.5">
                    <motion.span
                      className="grid size-10 shrink-0 place-items-center rounded-md bg-white text-amber shadow-e1 ring-1 ring-amber/25"
                      whileHover={prefersReduced ? undefined : { rotate: -10, scale: 1.08 }}
                      transition={springSoft}
                    >
                      <Icon name={b.icon} className="size-5" strokeWidth={1.7} />
                    </motion.span>
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-bold text-ink">{b.title}</h3>
                      <p className="mt-1.5 text-[16px] leading-[1.95] text-muted">
                        {b.description}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.15} className="mt-10">
                <motion.button
                  type="button"
                  onClick={handleCta}
                  className="btn cursor-pointer bg-amber text-[#3a2a06] shadow-e3 hover:bg-[#e5a52f]"
                  whileHover={prefersReduced ? undefined : { y: -2 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                  transition={springSnappy}
                >
                  <Icon name="baby" className="size-[18px]" strokeWidth={1.9} />
                  {KIDS.cta.label}
                </motion.button>
                <p className="mt-3 text-[15px] text-muted">
                  فرم با گزینه «والدین» و علاقه‌مندی «کودک» برایت آماده می‌شود.
                </p>
              </Reveal>
            </div>

            {/* 3D asset */}
            <Reveal delay={0.1} className="relative mx-auto w-full max-w-[380px]">
              <Float amplitude={11} duration={7} rotate={1.5}>
                <AssetSlot
                  src={asset("kidsScene")}
                  alt="تصویر سه‌بعدی کودک در حال گوش دادن"
                  label="کودک با هدفون — رندر سه‌بعدی اصلی این سکشن"
                  ratio="328 / 294"
                  tone="amber"
                  rounded="rounded-2xl"
                />
              </Float>

              {/* floating chips that sell the scenario */}
              <motion.div
                className="absolute -right-2 top-8 hidden rounded-full border border-amber/30 bg-white/90 px-3 py-2 text-[15px] font-semibold text-ink shadow-e2 backdrop-blur-sm sm:block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...springSoft, delay: 0.35 }}
              >
                قصه شب · ۸ دقیقه
              </motion.div>
              <motion.div
                className="absolute -left-2 bottom-10 hidden items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-3 py-2 text-[15px] font-semibold text-ink shadow-e2 backdrop-blur-sm sm:flex"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...springSoft, delay: 0.5 }}
              >
                <Icon name="shield-check" className="size-4 text-mint" strokeWidth={1.9} />
                محتوای امن
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
