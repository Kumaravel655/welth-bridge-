"use client";

import { useReducedMotion } from "motion/react";
import * as React from "react";

/** Simple delayed opacity fade-in, triggered once on mount. */
export function FadeIn({
  children,
  delay = 0,
  duration = 1000,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = React.useState(!!reduce);

  React.useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, reduce]);

  return (
    <div
      className={`transition-opacity ${visible ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
