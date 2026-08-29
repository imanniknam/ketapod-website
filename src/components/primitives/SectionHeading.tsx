"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO, fadeIn, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tone = "paper" | "night";

/**
 * The page's editorial signature: a mono index, a rule that draws itself, then
 * the Persian headline. Every section uses it so the rhythm is recognisable.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "start",
  tone = "paper",
  className,
  titleClassName,
  action,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  tone?: Tone;
  className?: string;
  titleClassName?: string;
  action?: ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const centered = align === "center";

  return (
    <motion.div
      className={cn(
        "flex flex-col gap-5",
        centered ? "items-center text-center" : "items-start",
        !!action && !centered && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      <div className={cn("flex flex-col gap-4", centered && "items-center")}>
        <motion.div
          variants={prefersReduced ? fadeIn : fadeUp}
          className={cn("eyebrow", tone === "night" && "text-night-muted")}
        >
          <span className="tnum text-[15px] tracking-normal">{index}</span>
          <motion.span
            aria-hidden
            className={cn(
              "block h-px w-10 origin-right",
              tone === "night" ? "bg-night-line" : "bg-line-2",
            )}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
          />
          <span>{eyebrow}</span>
        </motion.div>

        <motion.h2
          variants={prefersReduced ? fadeIn : fadeUp}
          className={cn(
            "max-w-[19ch] text-[32px] font-bold sm:text-[34px] md:text-[42px]",
            tone === "night" ? "text-night-ink" : "text-ink",
            centered && "max-w-[24ch]",
            titleClassName,
          )}
        >
          {title}
        </motion.h2>

        {lead && (
          <motion.p
            variants={prefersReduced ? fadeIn : fadeUp}
            className={cn(
              "max-w-[52ch] text-[17px] leading-[1.95] sm:text-[19px]",
              tone === "night" ? "text-night-muted" : "text-muted",
            )}
          >
            {lead}
          </motion.p>
        )}
      </div>

      {action && (
        <motion.div
          variants={prefersReduced ? fadeIn : fadeUp}
          className={cn("shrink-0", !centered && "self-start")}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
