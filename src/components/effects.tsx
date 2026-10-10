"use client";

import { useEffect } from "react";

/**
 * Feeds the pointer position to the `.spotlight` card glow. It only writes CSS
 * variables on <html> — never on elements React renders inside the page — so it
 * can't cause hydration mismatches. (Scroll reveals are pure CSS.)
 */
export function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const onPointerMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${e.clientX}px`);
        root.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return null;
}
