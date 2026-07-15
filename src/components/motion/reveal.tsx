"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "blur-in";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
  variant?: RevealVariant;
};

const variants: Record<RevealVariant, any> = {
  "fade-up": { hidden: { opacity: 0, y: 24 } },
  "fade-left": { hidden: { opacity: 0, x: -32 } },
  "fade-right": { hidden: { opacity: 0, x: 32 } },
  "scale-in": { hidden: { opacity: 0, scale: 0.92 } },
  "blur-in": { hidden: { opacity: 0, filter: "blur(8px)", y: 8 } },
};

const baseVisible = { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" };

const RevealGroupContext = React.createContext(false);

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
  const inGroup = React.useContext(RevealGroupContext);

  const transition = {
    duration: 0.6,
    ...(delay > 0 ? { delay } : {}),
    ease: [0.21, 0.47, 0.32, 0.98] as const,
  };

  return (
    <Comp
      initial={reduce ? false : (inGroup ? undefined : "hidden")}
      whileInView={reduce ? undefined : (inGroup ? undefined : "visible")}
      viewport={inGroup ? undefined : { once: true, margin: "-64px" }}
      variants={{
        hidden: v.hidden,
        visible: { ...baseVisible, transition },
      }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct children that are <Reveal> via Framer Motion orchestrator. */
export function RevealGroup({
  children,
  className,
  step = 0.08,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  as?: "div" | "ol" | "ul";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[Tag];

  return (
    <RevealGroupContext.Provider value={true}>
      <Comp
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={{ once: true, margin: "-64px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: step,
            },
          },
        }}
        className={className}
      >
        {children}
      </Comp>
    </RevealGroupContext.Provider>
  );
}
