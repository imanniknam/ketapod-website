"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn, seeded } from "@/lib/utils";

/**
 * The brand's recurring motif. Bars are seeded (not random) so server and
 * client agree, and only animate while audio is actually playing — a waveform
 * dancing over a paused player is the classic tell of a fake product shot.
 *
 * Resting height is a rounded CSS percentage rather than a transform: motion
 * serialises transforms at a different precision on the server than in the
 * browser, which hydrates as a mismatch. Only the `active` pulse touches
 * `scaleY`, and it starts at exactly 1 so both renders agree.
 */
export function Waveform({
  bars = 32,
  active = false,
  className,
  barClassName,
  seed = 7,
  minScale = 0.18,
}: {
  bars?: number;
  active?: boolean;
  className?: string;
  barClassName?: string;
  seed?: number;
  minScale?: number;
}) {
  const prefersReduced = useReducedMotion();
  const animating = active && !prefersReduced;

  const heights = Array.from({ length: bars }, (_, i) => {
    const a = seeded(i + seed);
    const b = seeded((i + seed) * 2.7);
    // Envelope keeps the ends short so the shape reads as a clip, not a fence.
    const envelope = Math.sin((i / Math.max(bars - 1, 1)) * Math.PI) * 0.65 + 0.35;
    return Math.max(minScale, (a * 0.6 + b * 0.4) * envelope);
  });

  return (
    <div
      className={cn("flex min-w-0 items-center gap-[3px]", className)}
      aria-hidden
      role="presentation"
    >
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className={cn(
            "block min-w-0 w-[3px] flex-1 origin-center rounded-full bg-current",
            barClassName,
          )}
          style={{ height: `${(h * 100).toFixed(2)}%` }}
          initial={{ scaleY: 1 }}
          animate={animating ? { scaleY: [1, 1.55, 0.62, 1] } : { scaleY: 1 }}
          transition={
            animating
              ? {
                  duration: 0.9 + seeded(i * 3.3) * 0.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: seeded(i * 1.7) * 0.5,
                }
              : { duration: 0.35 }
          }
        />
      ))}
    </div>
  );
}

/** Flat decorative wave line — used as a section divider. */
export function WaveRule({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-full text-line-2", className)}
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 12 Q 25 2, 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12 T 450 12 T 500 12 T 550 12 T 600 12 T 650 12 T 700 12 T 750 12 T 800 12 T 850 12 T 900 12 T 950 12 T 1000 12 T 1050 12 T 1100 12 T 1150 12 T 1200 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
