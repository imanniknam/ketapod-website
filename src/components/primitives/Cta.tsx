"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/api";
import { openLeadForm, type LeadIntent } from "@/lib/leadIntent";
import { cn, scrollToSection } from "@/lib/utils";

type Variant = "primary" | "violet" | "ghost" | "onnight" | "amber";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-primary",
  violet: "btn-violet",
  ghost: "btn-ghost",
  onnight: "btn-onnight",
  amber: "btn-amber",
};

/**
 * Every call-to-action on the page: scrolls to its target section, fires the
 * matching analytics event, and can hand the lead form a preset (Kids → parent).
 */
export function Cta({
  label,
  target,
  variant = "primary",
  event,
  section,
  element = "primary_cta",
  intent,
  arrow = true,
  icon,
  className,
  metadata,
}: {
  label: string;
  target: string;
  variant?: Variant;
  event: string;
  section: string;
  element?: string;
  intent?: LeadIntent;
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  metadata?: Record<string, unknown>;
}) {
  function handleClick() {
    trackEvent(event, section, element, { target, label, ...metadata });
    if (target === "lead-form") openLeadForm(intent ?? {});
    else scrollToSection(target);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("btn group", VARIANT_CLASS[variant], className)}
    >
      {icon}
      <span>{label}</span>
      {arrow && (
        <ArrowLeft
          className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
          strokeWidth={2}
          aria-hidden
        />
      )}
    </button>
  );
}
