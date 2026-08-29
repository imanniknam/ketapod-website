"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/api";

/** Fires `home_page_viewed` once per mount. Renders nothing. */
export function PageView() {
  useEffect(() => {
    trackEvent("home_page_viewed", "page", "home");
  }, []);
  return null;
}
