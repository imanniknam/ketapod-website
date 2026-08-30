import { AssetSlot, Float } from "@/components/primitives/AssetSlot";
import { Icon } from "@/components/primitives/Icon";
import { IconChip } from "@/components/primitives/IconChip";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { KidsCta } from "./KidsCta";
import { asset } from "@/lib/assets";
import { KIDS } from "@/lib/content";

/**
 * Section 8 — Kids.
 *
 * The warm counterpoint on the page. It keeps its amber identity, but it now
 * wears the same panel as Problem and Final CTA and the same chips, heading and
 * button family as everything else — the warmth is the only thing that differs,
 * which is what it was supposed to be all along. Previously this section had a
 * hand-mixed gradient, its own border colour, its own button hexes and its own
 * icon treatment, and read as if it had been designed by someone else.
 */
export function Kids() {
  return (
    <Section id="kids" shell="warm">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div>
          <SectionHeading index="05" eyebrow="Kids Experience" title={KIDS.title} lead={KIDS.subtitle} />

          <RevealGroup
            className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2"
            stagger={0.08}
            amount={0.15}
          >
            {KIDS.benefits.map((b) => (
              <RevealItem key={b.id} className="group flex gap-3.5">
                <IconChip name={b.icon} tone="amber" size="sm" tilt />
                <div className="min-w-0">
                  <h3 className="text-[18px] font-bold text-ink">{b.title}</h3>
                  <p className="mt-1.5 text-[16px] leading-[1.95] text-muted">{b.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15} className="mt-10">
            <KidsCta />
            <p className="mt-3 text-[15px] text-muted">
              فرم با گزینه «والدین» و علاقه‌مندی «کودک» برایت آماده می‌شود.
            </p>
          </Reveal>
        </div>

        {/* ── 3D asset ─────────────────────────────────────────── */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[380px]">
          <Float amplitude={11} duration={7} rotate={1.5}>
            <AssetSlot
              src={asset("kidsScene")}
              alt="تصویر سه‌بعدی کودک در حال گوش دادن"
              label="کودک با هدفون — رندر سه‌بعدی اصلی این سکشن"
              ratio="328 / 294"
              tone="amber"
              rounded="rounded-2xl"
              sizes="(max-width: 1024px) 380px, 380px"
            />
          </Float>

          {/* floating chips that sell the scenario */}
          <span className="absolute -right-2 top-8 hidden rounded-full border border-amber/30 bg-white/90 px-3 py-2 text-[15px] font-semibold text-ink shadow-e2 backdrop-blur-sm sm:block">
            قصه شب · ۸ دقیقه
          </span>
          <span className="absolute -left-2 bottom-10 hidden items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-3 py-2 text-[15px] font-semibold text-ink shadow-e2 backdrop-blur-sm sm:flex">
            <Icon name="shield-check" className="size-4 text-mint" strokeWidth={1.9} />
            محتوای امن
          </span>
        </Reveal>
      </div>
    </Section>
  );
}
