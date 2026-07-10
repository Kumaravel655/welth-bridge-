"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import * as React from "react";

type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "blur-in";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render as a different element */
  as?: "div" | "section" | "li" | "span";
  /** Animation variant */
  variant?: RevealVariant;
};

const variants: Record<RevealVariant, { initial: TargetAndTransition }> = {
  "fade-up": { initial: { opacity: 0, y: 24 } },
  "fade-left": { initial: { opacity: 0, x: -32 } },
  "fade-right": { initial: { opacity: 0, x: 32 } },
  "scale-in": { initial: { opacity: 0, scale: 0.92 } },
  "blur-in": { initial: { opacity: 0, filter: "blur(8px)", y: 8 } },
};

/** Scroll-triggered reveal with multiple animation variants. Respects prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "fade-up",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const v = variants[variant];

  return (
    <Comp
      initial={reduce ? false : v.initial}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
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
