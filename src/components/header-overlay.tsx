"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Rendered by a page that opens with a full-bleed hero: while it is on screen
 * the site header floats transparent over the hero (the `over-hero:` variant).
 */
export function HeaderOverlay() {
  const marker = useRef<HTMLSpanElement>(null);

  // Next keeps a page in the DOM, hidden, after navigating away from it, so the
  // marker is withdrawn while this page is not the one being shown.
  useLayoutEffect(() => {
    const element = marker.current;
    element?.setAttribute("data-header", "overlay");
    return () => element?.removeAttribute("data-header");
  }, []);

  return <span ref={marker} hidden data-header="overlay" />;
}
