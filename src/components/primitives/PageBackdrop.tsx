"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * The page's ambient ground.
 *
 * A flat fill behind twelve sections reads as unfinished, so the paper gets
 * three things instead: a slow vertical temperature shift, a handful of very
 * wide colour washes that drift at different rates as you scroll, and a layer
 * of grain over the whole thing.
 *
 * It is one fixed layer rather than per-section decoration, which means the
 * colour moves *through* the page as a continuous field — sections inherit an
 * atmosphere rather than each carrying their own blob. Everything here is
 * behind the content and inert to pointers; opaque cards and panels sit on top
 * of it cleanly, which is what keeps the copy legible.
 */
export function PageBackdrop() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* Spring-smoothed so the washes glide instead of tracking the wheel 1:1. */
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 26, restDelta: 0.0005 });

  /* Different rates give the field depth: the far washes travel least. */
  const still = ["0%", "0%"];
  const violetTop = useTransform(p, [0, 1], prefersReduced ? still : ["0%", "-140%"]);
  const amberMid = useTransform(p, [0, 1], prefersReduced ? still : ["0%", "-60%"]);
  const violetLow = useTransform(p, [0, 1], prefersReduced ? still : ["0%", "-95%"]);
  const mintLow = useTransform(p, [0, 1], prefersReduced ? still : ["0%", "-40%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {/* Base: warm at the top, a touch cooler through the middle, warm again. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#FBFAF7_0%,#F3F3F1_34%,#EFF0F6_58%,#F6F6F2_80%,#F9F8F5_100%)]" />

      {/* Wide colour washes. Sized well beyond the viewport so the edges never
          resolve into a visible circle. */}
      <motion.div
        style={{ y: violetTop }}
        className="absolute -top-[30vh] right-[-25vw] h-[95vh] w-[95vw] rounded-full bg-[radial-gradient(ellipse_closest-side_at_center,rgba(42,56,255,0.24)_0%,rgba(42,56,255,0.10)_38%,transparent_68%)]"
      />
      <motion.div
        style={{ y: amberMid }}
        className="absolute top-[55vh] left-[-30vw] h-[85vh] w-[85vw] rounded-full bg-[radial-gradient(ellipse_closest-side_at_center,rgba(255,176,32,0.20)_0%,rgba(255,176,32,0.08)_40%,transparent_70%)]"
      />
      <motion.div
        style={{ y: violetLow }}
        className="absolute top-[130vh] right-[-20vw] h-[90vh] w-[80vw] rounded-full bg-[radial-gradient(ellipse_closest-side_at_center,rgba(110,120,255,0.24)_0%,rgba(110,120,255,0.09)_40%,transparent_70%)]"
      />
      <motion.div
        style={{ y: mintLow }}
        className="absolute top-[210vh] left-[-25vw] h-[80vh] w-[75vw] rounded-full bg-[radial-gradient(ellipse_closest-side_at_center,rgba(23,182,124,0.16)_0%,transparent_66%)]"
      />

      {/* Structure: a faint column grid, fading out before it becomes graph paper. */}
      <div className="absolute inset-0 hidden text-line-2/60 lg:block">
        <div className="container-k h-full">
          <div className="rules h-full opacity-70 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]" />
        </div>
      </div>

      {/* Grain over everything, so the washes never band. */}
      <div className="grain absolute inset-0 opacity-[0.028] mix-blend-multiply" />
    </div>
  );
}
