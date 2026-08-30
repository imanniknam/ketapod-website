"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandIcon, BrandMark } from "@/components/primitives/BrandMark";
import { Cta } from "@/components/primitives/Cta";
import { HEADER_CTA, NAV_ITEMS } from "@/lib/content";
import { trackEvent } from "@/lib/api";
import { openLeadForm } from "@/lib/leadIntent";
import { EASE_OUT_EXPO, springSoft } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";

export function Header() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 24));

  /* Scroll-spy: highlights the section the reader is actually in. */
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.target);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Lock the page while the drawer owns the screen. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(target: string) {
    setOpen(false);
    if (target === "lead-form") openLeadForm();
    else scrollToSection(target);
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.05 }}
      >
        <motion.div
          className={cn(
            "mx-auto flex max-w-[1216px] items-center gap-3 rounded-full transition-[background-color,box-shadow,border-color] duration-400",
            condensed
              ? "border border-line bg-card/85 shadow-e3 backdrop-blur-xl"
              : "border border-transparent bg-transparent",
          )}
          animate={{ paddingInline: condensed ? 12 : 8 }}
          transition={springSoft}
        >
          {/* Brand */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex shrink-0 cursor-pointer items-center rounded-full py-1 pr-1"
            aria-label="کتاپاد — رفتن به بالای صفحه"
          >
            {/*
              Mark only up here. Without the wordmark beside it the icon has to
              hold the brand by itself, so it is set well above the 34px lockup
              size — at the old size it read as a stray glyph next to the nav.

              The vertical padding comes down as the mark goes up, because the
              brand is the tallest thing in the bar and therefore sets the pill's
              height: at `py-1.5` a 58px mark would have made the whole header
              8px taller rather than 2px.
            */}
            <BrandIcon className="size-[52px] sm:size-[58px]" />
          </button>

          {/* Desktop nav */}
          <nav className="mr-2 hidden flex-1 items-center xl:flex" aria-label="ناوبری اصلی">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.target;
              return (
                <button
                  key={item.target}
                  type="button"
                  onClick={() => go(item.target)}
                  className={cn(
                    "relative cursor-pointer rounded-full px-3.5 py-2 text-[17px] font-medium transition-colors duration-200",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-violet-50 ring-1 ring-violet-100"
                      transition={springSoft}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 xl:flex-none">
            <div className="hidden sm:block">
              <Cta
                label={HEADER_CTA.label}
                target={HEADER_CTA.target}
                event="header_cta_clicked"
                section="header"
                element="header_cta"
                variant="primary"
                arrow={false}
                className="h-12 min-h-12 px-6 text-[17px]"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-12 cursor-pointer place-items-center rounded-full border border-line bg-card/70 text-ink xl:hidden"
              aria-label="باز کردن منو"
              aria-expanded={open}
            >
              <Menu className="size-5" strokeWidth={1.8} />
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-60 xl:hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.button
              type="button"
              aria-label="بستن منو"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-pointer bg-ink/35 backdrop-blur-sm"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-[360px] flex-col bg-paper shadow-e4"
              variants={{ hidden: { x: "100%" }, show: { x: 0 } }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <BrandMark animated={false} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-2"
                  aria-label="بستن منو"
                >
                  <X className="size-5" strokeWidth={1.8} />
                </button>
              </div>

              <motion.nav
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }}
                aria-label="ناوبری موبایل"
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.target}
                    type="button"
                    onClick={() => go(item.target)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-3.5 text-right text-[18px] font-medium text-ink transition-colors hover:bg-paper-2"
                    variants={{
                      hidden: { opacity: 0, x: 24 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <span className="tnum text-[13px] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </motion.button>
                ))}
              </motion.nav>

              <div className="border-t border-line p-4">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("header_cta_clicked", "header", "drawer_cta", {
                      target: HEADER_CTA.target,
                    });
                    go(HEADER_CTA.target);
                  }}
                  className="btn btn-primary w-full"
                >
                  {HEADER_CTA.label}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
