"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { fadeIn, fadeUp, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Use for hand-tuned beats, not for faking a stagger. */
  delay?: number;
  variants?: Variants;
  amount?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "footer";
};

/**
 * Scroll-triggered entrance. Falls back to a plain fade when the visitor has
 * asked for reduced motion — the content still arrives, it just stops moving.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  amount = viewportOnce.amount,
  as = "div",
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const Cmp = motion[as];

  return (
    <Cmp
      className={className}
      variants={prefersReduced ? fadeIn : variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Cmp>
  );
}

/**
 * Parent for `RevealItem` children. Children animate in sequence via variant
 * propagation rather than per-child delays.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0,
  amount = viewportOnce.amount,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const Cmp = motion[as];
  return (
    <Cmp
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Cmp>
  );
}

export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li" | "article";
}) {
  const prefersReduced = useReducedMotion();
  const Cmp = motion[as];
  return (
    <Cmp className={className} variants={prefersReduced ? fadeIn : variants}>
      {children}
    </Cmp>
  );
}
