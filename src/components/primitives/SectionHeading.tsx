import type { CSSProperties, ReactNode } from "react";
import { RevealGroup, RevealItem } from "./Reveal";
import { cn } from "@/lib/utils";

type Tone = "paper" | "night";

/**
 * The page's editorial signature: a mono index, a rule that draws itself, then
 * the Persian headline.
 *
 * Every section goes through this — including the Final CTA, which used to
 * hand-roll its own eyebrow and an `h2` two steps larger than everywhere else.
 * One component means the type scale can only ever have one value.
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
  const centered = align === "center";
  const night = tone === "night";

  return (
    <RevealGroup
      stagger={0.08}
      amount={0.4}
      className={cn(
        "flex flex-col gap-5",
        centered ? "items-center text-center" : "items-start",
        !!action && !centered && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <RevealItem className={cn("flex flex-col gap-4", centered && "items-center")}>
        <div className={cn("eyebrow", night && "text-night-muted")}>
          <span className="tnum text-[15px] tracking-normal">{index}</span>
          <span
            aria-hidden
            className={cn("kp-reveal block h-px w-10", night ? "bg-night-line" : "bg-line-2")}
            data-v="rule"
            style={{ "--kp-rd": "0.18s" } as CSSProperties}
          />
          <span>{eyebrow}</span>
        </div>

        <h2
          className={cn(
            "max-w-[19ch] text-[32px] font-bold sm:text-[34px] md:text-[42px]",
            night ? "text-night-ink" : "text-ink",
            centered && "max-w-[24ch]",
            titleClassName,
          )}
        >
          {title}
        </h2>

        {lead && (
          <p
            className={cn(
              "max-w-[52ch] text-[17px] leading-[1.95] sm:text-[19px]",
              night ? "text-night-muted" : "text-muted",
            )}
          >
            {lead}
          </p>
        )}
      </RevealItem>

      {action && (
        <RevealItem className={cn("shrink-0", !centered && "self-start")}>{action}</RevealItem>
      )}
    </RevealGroup>
  );
}
