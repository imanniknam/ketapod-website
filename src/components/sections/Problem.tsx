"use client";

import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/primitives/Icon";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { PROBLEMS } from "@/lib/content";
import { fadeUp } from "@/lib/motion";
import { pad2 } from "@/lib/utils";

/**
 * Section 5 — Problem.
 *
 * The page's only full dark panel. Items sit on a hairline grid rather than in
 * cards: six boxes in a row would flatten the rhythm right after the four cards
 * above, and the ruled grid reads as an argument being laid out.
 */
export function Problem() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="problem" className="relative pb-16 sm:pb-20 md:pb-32">
      <div className="container-k">
        <div className="relative overflow-hidden rounded-2xl bg-night px-5 py-12 sm:px-8 sm:py-14 md:px-14 md:py-20">
          {/* atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 right-[12%] size-[460px] rounded-full bg-[radial-gradient(circle,rgba(42,56,255,0.30)_0%,transparent_66%)]" />
            <div className="absolute -bottom-40 left-[-6%] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,176,32,0.11)_0%,transparent_66%)]" />
            <div className="dotgrid absolute inset-0 text-white/[0.05]" />
          </div>

          <div className="relative">
            <SectionHeading
              index="02"
              eyebrow="The Problem"
              title="مشکل کجاست؟"
              lead="شش شکافی که تجربه فعلی کتاب صوتی را برای شنونده امروزی ناکافی می‌کند."
              tone="night"
              align="center"
              className="mx-auto"
            />

            <RevealGroup
              className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-night-line/70 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.07}
              amount={0.12}
            >
              {PROBLEMS.map((p, i) => (
                <RevealItem
                  key={p.id}
                  variants={fadeUp}
                  className="group relative bg-night px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9"
                >
                  <motion.div
                    className="absolute inset-0 bg-night-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="grid size-10 shrink-0 place-items-center rounded-sm bg-white/[0.06] text-violet-200 ring-1 ring-white/10"
                        whileHover={prefersReduced ? undefined : { rotate: -6 }}
                      >
                        <Icon name={p.icon} className="size-[19px]" strokeWidth={1.7} />
                      </motion.span>
                      <span className="tnum text-[13px] text-white/25">{pad2(i + 1)}</span>
                    </div>

                    <h3 className="mt-5 text-[19px] font-bold leading-[1.6] text-night-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-[16px] leading-[2] text-night-muted">
                      {p.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
