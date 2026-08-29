"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AudioLines, Loader2, Pause, Play, Sparkles, TriangleAlert } from "lucide-react";
import { AssetSlot, Float } from "@/components/primitives/AssetSlot";
import { asset } from "@/lib/assets";
import { CoverArt } from "@/components/primitives/CoverArt";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Waveform } from "@/components/primitives/Waveform";
import { useDemoPlayer } from "@/hooks/useDemoPlayer";
import { EASE_OUT_EXPO, springSoft } from "@/lib/motion";
import { cn, formatTime } from "@/lib/utils";

const PANEL_DARK = "#101538";
const PANEL_KIDS = "#FFF6E6";

/**
 * Section 7 — Interactive Demo.
 *
 * A real player, not a mockup: audio streams from the API's CDN URLs and every
 * control drives the element directly. Kids mode is a page-local UI state (never
 * persisted here, per the spec) and repaints the whole console so the difference
 * between the two scenarios is something you can see, not just read.
 */
export function InteractiveDemo() {
  const prefersReduced = useReducedMotion();
  const {
    audioRef,
    demo,
    status,
    error,
    canPlay,
    isPlaying,
    currentTime,
    duration,
    progress,
    availableVoices,
    activeSource,
    selectedVoiceId,
    selectedRecommendationId,
    recommendations,
    recommendedVoiceId,
    kidsModeEnabled,
    nowPlayingTitle,
    nowPlayingCover,
    toggle,
    seek,
    selectVoice,
    selectRecommendation,
    toggleKidsMode,
  } = useDemoPlayer();
  const kids = kidsModeEnabled;

  const ink = kids ? "text-ink" : "text-night-ink";
  const sub = kids ? "text-muted" : "text-night-muted";
  const surface = kids ? "bg-white/80 ring-line" : "bg-white/[0.05] ring-white/10";

  return (
    <section id="demo" className="relative pb-16 sm:pb-20 md:pb-32">
      <div className="container-k">
        <motion.div
          className="relative overflow-hidden rounded-2xl px-4 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16"
          /* `initial={false}` paints the panel on first render instead of
             fading it up from transparent on mount. */
          initial={false}
          animate={{ backgroundColor: kids ? PANEL_KIDS : PANEL_DARK }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        >
          {/* atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute -top-24 left-[8%] size-[440px] rounded-full"
              initial={false}
              animate={{
                background: kids
                  ? "radial-gradient(circle, rgba(255,176,32,0.32) 0%, transparent 66%)"
                  : "radial-gradient(circle, rgba(110,120,255,0.34) 0%, transparent 66%)",
              }}
              transition={{ duration: 0.55 }}
            />
            <div
              className={cn(
                "dotgrid absolute inset-0 transition-colors duration-500",
                kids ? "text-amber/15" : "text-white/[0.06]",
              )}
            />
          </div>

          <div className="relative">
            {/* ── Header row ─────────────────────────────────────── */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                index="04"
                eyebrow="Interactive Demo"
                title="محصول را همین‌جا گوش کن"
                lead="پخش واقعی، انتخاب گوینده و پیشنهادهای هوشمند — بدون نصب و بدون ثبت‌نام."
                tone={kids ? "paper" : "night"}
              />

              {/* Decorative only, and only where there is room for it. */}
              <Float
                className="pointer-events-none absolute -top-4 left-0 hidden w-[168px] xl:block"
                amplitude={10}
                duration={7}
                rotate={2}
              >
                <AssetSlot
                  src={asset("demoMicrophone")}
                  alt=""
                  label="میکروفون سه‌بعدی"
                  ratio="207 / 245"
                  tone="night"
                  rounded="rounded-2xl"
                />
              </Float>

              <Reveal className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1",
                    kids
                      ? "bg-amber-100 text-[#8a5c0a] ring-amber/30"
                      : "bg-white/10 text-violet-200 ring-white/15",
                  )}
                >
                  <AudioLines className="size-3.5" strokeWidth={2} aria-hidden />
                  پخش واقعی
                </span>
                <KidsToggle on={kids} onToggle={toggleKidsMode} />
              </Reveal>
            </div>

            {/* ── Console ────────────────────────────────────────── */}
            <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,290px)]">
              {/* Voices */}
              <Reveal
                className={cn("rounded-lg p-5 ring-1 backdrop-blur-sm", surface)}
                delay={0.05}
              >
                <PanelTitle tone={ink}>انتخاب صدا</PanelTitle>
                <p className={cn("mt-1 text-[15px]", sub)}>
                  {kids ? "صدایی که برای بچه‌ها ساخته شده." : "سبک روایت را عوض کن."}
                </p>

                <ul className="mt-4 flex flex-col gap-2">
                  {availableVoices.map((v) => {
                    const active = v.id === selectedVoiceId;
                    const recommended = kids && v.id === recommendedVoiceId;
                    return (
                      <li key={v.id}>
                        <motion.button
                          type="button"
                          disabled={!v.available}
                          onClick={() => selectVoice(v.id)}
                          whileHover={
                            prefersReduced || !v.available ? undefined : { x: -4 }
                          }
                          transition={springSoft}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-right transition-colors duration-200",
                            v.available ? "cursor-pointer" : "cursor-not-allowed opacity-40",
                            active
                              ? kids
                                ? "bg-amber text-white"
                                : "bg-violet text-white"
                              : kids
                                ? "hover:bg-amber-100"
                                : "hover:bg-white/10",
                          )}
                          aria-pressed={active}
                        >
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-full text-[16px] font-bold ring-1",
                              active
                                ? "bg-white/20 text-white ring-white/30"
                                : kids
                                  ? "bg-amber-100 text-[#8a5c0a] ring-amber/25"
                                  : "bg-white/10 text-violet-200 ring-white/10",
                            )}
                          >
                            {v.name.slice(0, 1)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block truncate text-[16px] font-semibold",
                                active ? "text-white" : ink,
                              )}
                            >
                              {v.name}
                            </span>
                            <span
                              className={cn(
                                "block truncate text-[13px]",
                                active ? "text-white/75" : sub,
                              )}
                            >
                              {active && activeSource
                                ? activeSource.voiceName
                                : STYLE_LABEL[v.style] ?? v.style}
                            </span>
                          </span>
                          {recommended && !active && (
                            <span className="shrink-0 rounded-full bg-amber px-2 py-0.5 text-[13px] font-bold text-white">
                              پیشنهاد
                            </span>
                          )}
                          {active && (
                            <Waveform
                              bars={4}
                              active={isPlaying}
                              seed={3}
                              minScale={0.35}
                              className="h-4 w-5 shrink-0 text-white"
                              barClassName="w-[2px]"
                            />
                          )}
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              {/* Player */}
              <Reveal
                className={cn(
                  "relative p-6 ring-1 backdrop-blur-sm md:p-7",
                  surface,
                  kids ? "rounded-2xl" : "rounded-lg",
                )}
                delay={0.1}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <CoverArt
                    src={nowPlayingCover || undefined}
                    alt={`کاور ${nowPlayingTitle}`}
                    index={selectedRecommendationId ? 2 : 0}
                    rounded={kids ? "rounded-xl" : "rounded-md"}
                    className="size-20 shrink-0 shadow-e3 md:size-24"
                    sizes="96px"
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold",
                        kids
                          ? "bg-amber-100 text-[#8a5c0a]"
                          : "bg-violet/25 text-violet-200",
                      )}
                    >
                      <Sparkles className="size-3" strokeWidth={2} aria-hidden />
                      {demo?.sampleBook.aiTag ?? "پیشنهاد هوشمند"}
                    </span>
                    <h3 className={cn("mt-2.5 line-clamp-2 text-[19px] font-bold sm:text-[22px]", ink)}>
                      {nowPlayingTitle || "—"}
                    </h3>
                    <p className={cn("mt-1 line-clamp-2 text-[15px] sm:text-[16px]", sub)}>
                      {demo?.sampleBook.author}
                      {activeSource ? ` · ${activeSource.voiceName}` : ""}
                    </p>
                  </div>
                </div>

                {/* waveform */}
                <div className="mt-6">
                  <Waveform
                    bars={54}
                    active={isPlaying}
                    seed={17}
                    className={cn("h-14", kids ? "text-amber/45" : "text-violet-200/35")}
                    barClassName="w-[3px]"
                  />
                </div>

                {/* seek */}
                <div className="mt-3">
                  <ProgressBar
                    progress={progress}
                    disabled={!canPlay}
                    kids={kids}
                    onSeek={seek}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className={cn("tnum text-[13px]", sub)}>
                      {formatTime(currentTime)}
                    </span>
                    <span className={cn("tnum text-[13px]", sub)}>
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* transport */}
                <div className="mt-5 flex items-center justify-center gap-4">
                  <motion.button
                    type="button"
                    onClick={toggle}
                    disabled={!canPlay}
                    aria-label={isPlaying ? "توقف پخش" : "پخش"}
                    whileHover={prefersReduced || !canPlay ? undefined : { scale: 1.06 }}
                    whileTap={prefersReduced || !canPlay ? undefined : { scale: 0.94 }}
                    transition={springSoft}
                    className={cn(
                      "grid size-16 place-items-center rounded-full text-white transition-colors duration-200",
                      canPlay
                        ? kids
                          ? "cursor-pointer bg-amber shadow-e3 hover:bg-[#dd9d26]"
                          : "cursor-pointer bg-violet shadow-violet hover:bg-violet-600"
                        : "cursor-not-allowed bg-white/15 text-white/40",
                    )}
                  >
                    {status === "loading" ? (
                      <Loader2 className="size-6 animate-spin" strokeWidth={2} />
                    ) : isPlaying ? (
                      <Pause className="size-6 fill-current" strokeWidth={0} />
                    ) : (
                      <Play className="size-6 translate-x-[-2px] fill-current" strokeWidth={0} />
                    )}
                  </motion.button>
                </div>

                {/* player-level error / unavailable notice */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      key={error}
                      role="status"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "mt-4 flex items-center justify-center gap-2 rounded-sm px-3 py-2 text-center text-[15px]",
                        kids
                          ? "bg-rose-100 text-[#8d2f28]"
                          : "bg-white/[0.07] text-night-muted",
                      )}
                    >
                      <TriangleAlert className="size-3.5 shrink-0" strokeWidth={1.9} aria-hidden />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <audio ref={audioRef} preload="metadata" className="hidden" />
              </Reveal>

              {/* Recommendations + continue listening */}
              <Reveal className="flex flex-col gap-4" delay={0.15}>
                <div className={cn("rounded-lg p-5 ring-1 backdrop-blur-sm", surface)}>
                  <PanelTitle tone={ink}>
                    {kids ? "برای کودک انتخاب کن" : "پیشنهادهای هوشمند برای تو"}
                  </PanelTitle>

                  <ul className="mt-4 flex flex-col gap-2">
                    {recommendations.map((r, i) => {
                      const active = r.id === selectedRecommendationId;
                      const isKidsItem = r.type === "kids";
                      return (
                        <li key={r.id}>
                          <motion.button
                            type="button"
                            onClick={() =>
                              selectRecommendation(r.id, r.bookId, r.tag, i + 1)
                            }
                            whileHover={prefersReduced ? undefined : { x: -4 }}
                            transition={springSoft}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 rounded-sm p-2 text-right transition-colors duration-200",
                              active
                                ? kids
                                  ? "bg-amber-100 ring-1 ring-amber/40"
                                  : "bg-white/12 ring-1 ring-white/20"
                                : kids
                                  ? "hover:bg-amber-100/60"
                                  : "hover:bg-white/[0.07]",
                            )}
                            aria-pressed={active}
                          >
                            <CoverArt
                              src={r.coverUrl || undefined}
                              alt={`کاور ${r.title}`}
                              index={i + 1}
                              rounded={kids ? "rounded-md" : "rounded-xs"}
                              className="size-11 shrink-0"
                              sizes="44px"
                            />
                            <span className="min-w-0 flex-1">
                              <span className={cn("block truncate text-[16px] font-semibold", ink)}>
                                {r.title}
                              </span>
                              <span
                                className={cn(
                                  "mt-1 inline-block rounded-full px-2 py-0.5 text-[13px] font-semibold",
                                  isKidsItem && kids
                                    ? "bg-amber text-white"
                                    : kids
                                      ? "bg-white text-muted ring-1 ring-line"
                                      : "bg-white/10 text-night-muted",
                                )}
                              >
                                {r.tag}
                              </span>
                            </span>
                          </motion.button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {demo?.continueListening && (
                  <div
                    className={cn(
                      "p-4 ring-1 backdrop-blur-sm",
                      surface,
                      kids ? "rounded-2xl" : "rounded-lg",
                    )}
                  >
                    <PanelTitle tone={ink} className="text-[13px]">
                      ادامه شنیدن
                    </PanelTitle>
                    <div className="mt-3 flex items-center gap-3">
                      <CoverArt
                        src={demo.continueListening.coverUrl || undefined}
                        alt={`کاور ${demo.continueListening.title}`}
                        index={4}
                        rounded={kids ? "rounded-md" : "rounded-xs"}
                        className="size-10 shrink-0"
                        sizes="40px"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-[16px] font-semibold", ink)}>
                          {demo.continueListening.title}
                        </p>
                        <div
                          className={cn(
                            "mt-2 h-1 overflow-hidden rounded-full",
                            kids ? "bg-amber-100" : "bg-white/12",
                          )}
                        >
                          <motion.span
                            className={cn(
                              "block h-full rounded-full",
                              kids ? "bg-amber" : "bg-violet-200",
                            )}
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${demo.continueListening.progressPercent}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                          />
                        </div>
                      </div>
                      <span dir="ltr" className={cn("tnum shrink-0 text-[13px]", sub)}>
                        {demo.continueListening.progressPercent}%
                      </span>
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

const STYLE_LABEL: Record<string, string> = {
  calm: "آرام و یکنواخت",
  dramatic: "پرکشش و نمایشی",
  kids: "مناسب کودک",
};

function PanelTitle({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone: string;
  className?: string;
}) {
  return (
    <h3 className={cn("text-[16px] font-bold tracking-tight", tone, className)}>
      {children}
    </h3>
  );
}

function KidsToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-full py-1.5 pe-2 ps-3.5 text-[15px] font-semibold ring-1 transition-colors duration-300",
        on
          ? "bg-amber text-white ring-amber"
          : "bg-white/10 text-night-ink ring-white/15 hover:bg-white/15",
      )}
    >
      حالت کودک
      <span
        className={cn(
          "flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-300",
          on ? "bg-white/35" : "bg-white/20",
        )}
      >
        <motion.span
          className="block size-5 rounded-full bg-white shadow-e1"
          animate={{ x: on ? -20 : 0 }}
          transition={springSoft}
        />
      </span>
    </button>
  );
}

/**
 * Seek control. A real range input carries the keyboard and screen-reader
 * behaviour; the visible track is painted underneath it.
 */
function ProgressBar({
  progress,
  disabled,
  kids,
  onSeek,
}: {
  progress: number;
  disabled: boolean;
  kids: boolean;
  onSeek: (ratio: number) => void;
}) {
  const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 1000) / 10;

  return (
    <div className="group relative h-5">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full",
          kids ? "bg-amber/20" : "bg-white/12",
        )}
      >
        <span
          className={cn(
            "block h-full rounded-full transition-[width] duration-150",
            kids ? "bg-amber" : "bg-violet-200",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full shadow-e2 transition-transform duration-200",
          kids ? "bg-amber" : "bg-white",
          disabled ? "opacity-0" : "scale-0 group-hover:scale-100",
        )}
        style={{ right: `${pct}%` }}
      />
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        disabled={disabled}
        onChange={(e) => onSeek(Number(e.target.value) / 1000)}
        aria-label="جابه‌جایی در فایل صوتی"
        className={cn(
          "absolute inset-0 h-full w-full appearance-none bg-transparent",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent",
          "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent",
        )}
      />
    </div>
  );
}
