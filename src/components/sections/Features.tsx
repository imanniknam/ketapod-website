"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Icon } from "@/components/primitives/Icon";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { Aura } from "@/components/primitives/Aura";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Waveform } from "@/components/primitives/Waveform";
import { FEATURES } from "@/lib/content";
import { trackEvent } from "@/lib/api";
import { openLeadForm } from "@/lib/leadIntent";
import { springSoft } from "@/lib/motion";
import { PRIMARY_CTA_LABEL } from "@/lib/content";

const [lead, ...rest] = FEATURES;

/**
 * Section 6 — Features.
 *
 * Bento rather than an eight-up grid: the AI recommendation feature is the
 * product's actual argument, so it gets a 2×2 tile and the violet fill, and the
 * remaining seven read as supporting detail. The twelfth cell is the CTA, which
 * is why the grid resolves cleanly instead of leaving a hole.
 */
export function Features() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="features" className="relative overflow-hidden py-16 sm:py-20 md:py-32">
      <Aura tone="violet" mark="arc" className="right-[-10%] top-16 hidden md:block" size="size-[380px]" />
      <Aura tone="mint" mark="dots" className="bottom-16 left-[-8%] hidden lg:block" size="size-[320px]" />
      <div className="container-k">
        <SectionHeading
          index="03"
          eyebrow="Features"
          title="چه چیزی داخل کتاپاد است؟"
          lead="از انتخاب گوینده تا کتابخانه شخصی — امکاناتی که تجربه شنیدن را شخصی و پیوسته نگه می‌دارند."
        />

        <RevealGroup
          className="mt-14 grid auto-rows-[minmax(168px,auto)] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
          amount={0.1}
        >
          {/* ── Lead tile ─────────────────────────────────────── */}
          <RevealItem className="sm:col-span-2 lg:row-span-2">
            <motion.article
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-violet p-7 text-white shadow-violet md:p-8"
              whileHover={prefersReduced ? undefined : { y: -6 }}
              transition={springSoft}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_15%_0%,rgba(255,255,255,0.22)_0%,transparent_55%)]"
              />
              <div
                aria-hidden
                className="dotgrid pointer-events-none absolute inset-0 text-white/10"
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-md bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                    <Icon name={lead.icon} className="size-6" strokeWidth={1.7} />
                  </span>
                  {"badge" in lead && lead.badge && (
                    <span className="tnum rounded-full bg-white px-3 py-1 text-[13px] font-bold tracking-[0.08em] text-violet-700">
                      {lead.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-[25px] font-bold leading-[1.5] md:text-[30px]">
                  {lead.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[17px] leading-[2] text-white/80">
                  {lead.description}
                </p>
              </div>

              <div className="relative mt-8">
                <Waveform
                  bars={44}
                  active
                  seed={23}
                  className="h-12 text-white/45"
                  barClassName="w-[3px]"
                />
              </div>
            </motion.article>
          </RevealItem>

          {/* ── Supporting tiles ──────────────────────────────── */}
          {rest.map((f) => (
            <RevealItem key={f.id}>
              <motion.article
                className="group relative flex h-full cursor-default flex-col rounded-lg border border-line bg-card p-6 shadow-e1 transition-[border-color,box-shadow] duration-300 hover:border-violet-200 hover:shadow-e3"
                whileHover={prefersReduced ? undefined : { y: -5 }}
                transition={springSoft}
              >
                <motion.span
                  className="grid size-11 place-items-center rounded-md bg-paper-2 text-ink-2 ring-1 ring-line transition-colors duration-300 group-hover:bg-violet-50 group-hover:text-violet group-hover:ring-violet-100"
                  whileHover={prefersReduced ? undefined : { rotate: -8 }}
                  transition={springSoft}
                >
                  <Icon name={f.icon} className="size-5" strokeWidth={1.7} />
                </motion.span>
                <h3 className="mt-4 text-[18px] font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.95] text-muted">
                  {f.description}
                </p>
              </motion.article>
            </RevealItem>
          ))}

          {/* ── Closing CTA tile ──────────────────────────────── */}
          <RevealItem>
            <motion.button
              type="button"
              onClick={() => {
                trackEvent("final_cta_clicked", "features", "grid_cta", {
                  target: "lead-form",
                });
                openLeadForm();
              }}
              className="group flex h-full w-full cursor-pointer flex-col justify-between rounded-lg border border-dashed border-line-2 bg-transparent p-6 text-right transition-colors duration-300 hover:border-violet hover:bg-violet-50"
              whileHover={prefersReduced ? undefined : { y: -5 }}
              transition={springSoft}
            >
              <span className="grid size-11 place-items-center rounded-full border border-line-2 text-ink transition-colors duration-300 group-hover:border-violet group-hover:bg-violet group-hover:text-white">
                <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="mt-6 block">
                <span className="block text-[18px] font-bold text-ink">
                  {PRIMARY_CTA_LABEL}
                </span>
                <span className="mt-1.5 block text-[16px] leading-relaxed text-muted">
                  همه امکانات را از داخل محصول ببین.
                </span>
              </span>
            </motion.button>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
