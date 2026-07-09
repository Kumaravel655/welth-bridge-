"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render as a different element, e.g. "section", "li" */
  as?: "div" | "section" | "li" | "span";
};

/** Scroll-triggered fade + rise. Respects prefers-reduced-motion. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct children that are <Reveal> via index-based delays. */
export function RevealGroup({
  children,
  className,
  step = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement<RevealProps>(child)
          ? React.cloneElement(child, { delay: i * step })
          : child
      )}
    </div>
  );
}
