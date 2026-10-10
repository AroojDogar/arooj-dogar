import type { CSSProperties } from "react";

/**
 * Staggers `.reveal` items so cards in a row appear one after another:
 * <div className="reveal" style={delay(i)}>. Each step starts the reveal a bit
 * later in the scroll (see the reveal rules in globals.css).
 */
export const delay = (index: number, stepPercent = 8) =>
  ({ "--start": `${index * stepPercent}%` }) as CSSProperties;
