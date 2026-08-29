"use client";

import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn, faFigure } from "@/lib/utils";

/**
 * Counts up to the numeric head of a display string ("20K+" → 20 then "K+").
 * Driven by a MotionValue so the tick doesn't re-render the tree every frame;
 * only the text node is written.
 */
export function Counter({
  displayValue,
  className,
  duration = 1.6,
}: {
  displayValue: string;
  className?: string;
  duration?: number;
}) {
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(displayValue.trim());
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : displayValue;
  const decimals = match?.[1].includes(".") ? 1 : 0;

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReduced = useReducedMotion();
  const value = useMotionValue(0);
  const [animated, setAnimated] = useState(0);
  /* Reduced motion skips the tween entirely and renders the final value. */
  const display = prefersReduced ? target : animated;

  useEffect(() => {
    if (!inView || !match || prefersReduced) return;
    const controls = animate(value, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setAnimated(v),
    });
    return () => controls.stop();
  }, [inView, target, duration, value, prefersReduced, match]);

  if (!match) {
    return (
      <span ref={ref} className={cn("tnum", className)}>
        {faFigure(displayValue)}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {display.toFixed(decimals)}
      {faFigure(suffix)}
    </span>
  );
}
