"use client";

import { useEffect, useRef } from "react";

/**
 * Hairline reading indicator.
 *
 * Writes the transform straight onto the node from a rAF-throttled passive
 * scroll listener — no state, so React never re-renders, and no spring, so the
 * page doesn't carry an animation loop that runs from the first frame whether
 * you scroll or not.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.transform = `scaleX(${progress.toFixed(4)})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-70 h-[2px] origin-right bg-violet"
    />
  );
}
