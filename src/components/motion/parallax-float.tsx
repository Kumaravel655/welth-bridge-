"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import * as React from "react";

/**
 * Decorative floating shapes that move at different speeds on scroll,
 * creating a parallax depth effect. Purely visual — aria-hidden.
 */
export function ParallaxFloat({
  className,
}: {
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {/* Large soft circle — top right */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute -right-20 -top-10 size-80 rounded-full opacity-[0.07]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.07 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="size-full rounded-full bg-accent" style={{ animation: "blob 12s ease-in-out infinite" }} />
      </motion.div>

      {/* Small golden ring — left */}
      <motion.div
        style={{ y: y2 }}
        className="absolute left-[8%] top-[35%] size-16 rounded-full border-2 border-accent/20 opacity-60"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />

      {/* Diagonal line — decorative */}
      <motion.div
        style={{ y: y3, rotate: rotate2 }}
        className="absolute right-[15%] top-[20%] h-32 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* Dot cluster — bottom left */}
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-[15%] left-[12%] grid grid-cols-3 gap-2 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="size-1.5 rounded-full bg-accent/50" />
        ))}
      </motion.div>

      {/* Cross shape — mid right */}
      <motion.div
        style={{ y: y2 }}
        className="absolute right-[10%] top-[55%] opacity-20"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="relative size-6">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent" />
        </div>
      </motion.div>
    </div>
  );
}
