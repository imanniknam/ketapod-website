"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Seamless ticker. The track holds two identical copies and slides exactly half
 * its width, so the loop point is invisible. Paused entirely under reduced
 * motion — an infinite marquee is exactly what that setting exists to stop.
 */
export function Marquee({
  children,
  speed = 34,
  reverse = false,
  className,
  fade = true,
}: {
  children: ReactNode;
  /** Seconds for one full cycle. Higher = slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  fade?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  const track = (
    <div className="flex shrink-0 items-center gap-3 pl-3">{children}</div>
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to left, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to left, transparent, black 8%, black 92%, transparent)",
            }
          : undefined
      }
      aria-hidden
    >
      <motion.div
        className="flex w-max"
        animate={prefersReduced ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {track}
        {track}
      </motion.div>
    </div>
  );
}
