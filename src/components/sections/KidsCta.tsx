"use client";

import { Icon } from "@/components/primitives/Icon";
import { trackEvent } from "@/lib/api";
import { KIDS } from "@/lib/content";
import { openLeadForm } from "@/lib/leadIntent";

/**
 * The kids call-to-action.
 *
 * It doesn't just scroll: it hands the lead form a `parent` user type and a
 * `kids` interest, so the form arrives already shaped around who clicked it.
 *
 * The button is `btn btn-violet` — the same primary CTA as the hero and the
 * final panel. It used to be a one-off amber button with its own hex values.
 */
export function KidsCta() {
  return (
    <button
      type="button"
      className="btn btn-violet cursor-pointer"
      onClick={() => {
        trackEvent("kids_cta_clicked", "kids", "primary_cta", {
          target: "lead-form",
          presetUserType: KIDS.cta.presetUserType,
          presetInterest: KIDS.cta.presetInterest,
        });
        openLeadForm({
          userType: KIDS.cta.presetUserType,
          interest: KIDS.cta.presetInterest,
        });
      }}
    >
      <Icon name="baby" className="size-[18px]" strokeWidth={1.9} />
      {KIDS.cta.label}
    </button>
  );
}
