"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Icon } from "@/components/primitives/Icon";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { ASSETS } from "@/lib/assets";
import { Aura } from "@/components/primitives/Aura";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { WHY_US } from "@/lib/content";
import { springSoft } from "@/lib/motion";
import { pad2 } from "@/lib/utils";

/** The 3D tile for a card, or undefined if that render hasn't landed yet. */
const tile = (id: string): string | undefined =>
  ASSETS[`whyUs.${id}` as keyof typeof ASSETS];

/** Section 4 — Why Us. Four fixed cards, no API. */
export function WhyUs() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="why-us" className="relative overflow-hidden py-16 sm:py-20 md:py-32">
      <Aura tone="violet" mark="orbit" className="-top-24 left-[-12%] hidden md:block" size="size-[460px]" />
      <Aura tone="amber" mark="dots" className="bottom-0 right-[-6%] hidden lg:block" size="size-[300px]" />
      <div className="container-k">
        <SectionHeading
          index="01"
          eyebrow="Why Ketapod"
          title="چرا کتاپاد؟"
          lead="چهار تصمیم طراحی که تجربه شنیدن را از یک فایل صوتی ساده جدا می‌کند."
        />

        <RevealGroup
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
          amount={0.15}
        >
          {WHY_US.map((item, i) => (
            <RevealItem key={item.id}>
              <motion.article
                className="group relative h-full cursor-default overflow-hidden rounded-lg border border-line bg-card p-6 shadow-e1 transition-[border-color,box-shadow] duration-300 hover:border-violet-200 hover:shadow-e3"
                whileHover={prefersReduced ? undefined : { y: -6 }}
                transition={springSoft}
              >
                {/* corner arc reveals on hover — a drawn detail, not a glow */}
                <svg
                  aria-hidden
                  className="pointer-events-none absolute -left-6 -top-6 size-24 text-violet/0 transition-colors duration-400 group-hover:text-violet/15"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle cx="20" cy="20" r="46" stroke="currentColor" strokeWidth="10" />
                </svg>

                <div className="flex items-start justify-between">
                  <motion.span
                    className="grid size-16 place-items-center"
                    whileHover={prefersReduced ? undefined : { rotate: -8, scale: 1.06 }}
                    transition={springSoft}
                  >
                    {tile(item.id) ? (
                      <Image
                        src={tile(item.id) as string}
                        alt=""
                        width={64}
                        height={64}
                        className="size-16 object-contain"
                      />
                    ) : (
                      /* Falls back to the line icon if a render is missing. */
                      <span className="grid size-12 place-items-center rounded-md bg-violet-50 text-violet ring-1 ring-violet-100">
                        <Icon name={item.icon} className="size-[22px]" strokeWidth={1.7} />
                      </span>
                    )}
                  </motion.span>
                  <span className="tnum text-[13px] text-faint">{pad2(i + 1)}</span>
                </div>

                <h3 className="mt-5 text-[20px] font-bold text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.95] text-muted">
                  {item.description}
                </p>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
