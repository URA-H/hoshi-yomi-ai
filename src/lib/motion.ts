import type { Transition, Variants } from "motion/react";

/**
 * 東洋の書斎 — Motion presets
 * Principles:
 *  - Duration 250-400ms (avoid the snappy 150ms vibe)
 *  - Custom easeOutCubic for a contemplative "one-breath" feel
 *  - No bounce / spring physics (avoids levity)
 *  - All animations must respect prefers-reduced-motion (handled in globals.css)
 */

export const easeShoseki: Transition = {
  duration: 0.35,
  ease: [0.22, 0.61, 0.36, 1],
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: easeShoseki },
};

export const reveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ...easeShoseki,
      staggerChildren: 0.08,
    },
  },
};

/** Used when streaming a fortune result — text bloom like sumi ink */
export const inkBloom: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};
