import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary.
 *
 * One easing curve does the entrances (expo-out — fast start, long settle) and
 * one spring does the interactions. Reusing exactly two curves across the page
 * is what makes the motion read as a single hand rather than a pile of effects.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
};

export const enterTransition: Transition = {
  duration: 0.68,
  ease: EASE_OUT_EXPO,
};

/** Default viewport config for scroll reveals across the page. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
export const viewportEarly = { once: true, amount: 0.1 } as const;

/* ── Reveal primitives ───────────────────────────────────────────────────── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: enterTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: enterTransition },
};

/** RTL page: content enters from the right edge, matching the reading flow. */
export const fadeInline: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: enterTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: enterTransition },
};

/* ── Orchestration ───────────────────────────────────────────────────────── */

export function stagger(childDelay = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: childDelay, delayChildren },
    },
  };
}

export const staggerContainer = stagger();

/** Motion-safe variants: strips the movement, keeps the fade. */
export function reduce(variants: Variants, prefersReduced: boolean): Variants {
  return prefersReduced ? fadeIn : variants;
}
