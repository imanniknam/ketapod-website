import { cn } from "@/lib/utils";

type Tone = "violet" | "amber" | "mint";

const WASH: Record<Tone, string> = {
  violet:
    "bg-[radial-gradient(ellipse_closest-side_at_center,rgba(42,56,255,0.18)_0%,rgba(42,56,255,0.06)_42%,transparent_70%)]",
  amber:
    "bg-[radial-gradient(ellipse_closest-side_at_center,rgba(255,176,32,0.18)_0%,rgba(255,176,32,0.06)_42%,transparent_70%)]",
  mint: "bg-[radial-gradient(ellipse_closest-side_at_center,rgba(23,182,124,0.15)_0%,transparent_66%)]",
};

const STROKE: Record<Tone, string> = {
  violet: "text-violet/12",
  amber: "text-amber/20",
  mint: "text-mint/15",
};

/**
 * Section furniture: a colour wash plus one drawn mark.
 *
 * The page backdrop supplies the continuous atmosphere; this adds a local
 * accent so a section reads as a place rather than a stretch of scroll. Three
 * marks only — an orbit, a dotted field and an arc — reused across the page, so
 * the decoration stays a vocabulary instead of a pile of one-offs.
 */
export function Aura({
  tone = "violet",
  mark = "orbit",
  className,
  size = "size-[420px]",
}: {
  tone?: Tone;
  mark?: "orbit" | "dots" | "arc" | "none";
  className?: string;
  size?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute -z-10", size, className)}>
      <div className={cn("absolute inset-0 rounded-full blur-[2px]", WASH[tone])} />

      {mark === "orbit" && (
        <svg
          className={cn("absolute inset-0 size-full", STROKE[tone])}
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="98" stroke="currentColor" strokeDasharray="2 8" />
          <circle cx="100" cy="100" r="74" stroke="currentColor" strokeDasharray="2 8" />
          <circle cx="100" cy="100" r="46" stroke="currentColor" />
        </svg>
      )}

      {mark === "dots" && (
        <div
          className={cn(
            "dotgrid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_closest-side_at_center,black,transparent_72%)]",
            STROKE[tone],
          )}
        />
      )}

      {mark === "arc" && (
        <svg
          className={cn("absolute inset-0 size-full", STROKE[tone])}
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M10 190 A 180 180 0 0 1 190 10"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M42 190 A 148 148 0 0 1 190 42"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="3 9"
          />
        </svg>
      )}
    </div>
  );
}
