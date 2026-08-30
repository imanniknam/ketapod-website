import type { Transition } from "motion/react";

/**
 * Shared motion vocabulary.
 *
 * One easing curve does the entrances (expo-out — fast start, long settle) and
 * one spring does the interactions. Reusing exactly two curves across the page
 * is what makes the motion read as a single hand rather than a pile of effects.
 *
 * Most of what used to live here — the `fadeUp` / `fadeIn` / `scaleIn` variants
 * and the stagger helpers — moved into CSS as the `.kp-reveal` rules in
 * `globals.css`. What's left is the vocabulary for the four sections that
 * genuinely need an animation library: the header, the player, the lead form
 * and the two API-backed rails. Their easing values mirror `--ease-out-expo`
 * and `--ease-out-quint` so JS-driven and CSS-driven motion still agree.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/** The page's single hover displacement, in pixels. Matches `.lift` in CSS. */
export const LIFT = -5;
