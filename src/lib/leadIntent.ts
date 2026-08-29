import { scrollToSection } from "./utils";

export type LeadIntent = {
  /** Preselects the user-type field (e.g. `parent` from the Kids CTA). */
  userType?: string;
  /** Preselects an interest tag when the user hasn't picked any yet. */
  interest?: string;
};

type Listener = (intent: LeadIntent) => void;

const listeners = new Set<Listener>();

/**
 * Tiny broadcast channel between a CTA anywhere on the page and the lead form.
 * A context would mean turning the whole page into a client tree for two
 * optional strings; this keeps the sections independently renderable.
 */
export function onLeadIntent(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function openLeadForm(intent: LeadIntent = {}) {
  listeners.forEach((l) => l(intent));
  scrollToSection("lead-form");
}
