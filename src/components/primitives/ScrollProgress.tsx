"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Hairline reading indicator. Scale-transform only — never re-renders. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-70 h-[2px] origin-right bg-violet"
    />
  );
}
