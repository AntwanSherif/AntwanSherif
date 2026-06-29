"use client";

// Shared building blocks for CV variants: the variant contract type and a few
// reduced-motion-safe Motion primitives. Variants may use these or roll their
// own — they exist to keep the common "fade up on enter, stagger children"
// pattern consistent and accessible across all 8 directions.

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import type { CVData } from "@/data/cv";

// Every variant is a component that takes the locked CV data and renders a full
// page. The switcher renders exactly one at a time.
export type CVVariantProps = { data: CVData };

// Stagger container: children animate in sequence. When the user prefers
// reduced motion, everything renders instantly (no transforms, no delays).
export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: {
      transition: reduce
        ? { duration: 0 }
        : { staggerChildren: stagger, delayChildren: delay },
    },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

// A single child that fades + lifts into place. No-op transform under
// prefers-reduced-motion.
export function FadeItem({
  children,
  className,
  y = 12,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.5, ease: [0.21, 0.5, 0.3, 1] },
    },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
