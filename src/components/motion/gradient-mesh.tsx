"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Animated gradient mesh background — flowing color blobs that
 * shift continuously for a cinematic hero feel.
 */
export function GradientMesh({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {/* Base gradient layer */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, oklch(0.28 0.06 260 / 0.6), transparent 70%), " +
            "radial-gradient(ellipse 60% 80% at 80% 30%, oklch(0.24 0.05 255 / 0.5), transparent 70%), " +
            "radial-gradient(ellipse 50% 50% at 50% 80%, oklch(0.78 0.145 75 / 0.08), transparent 60%)",
        }}
      />

      {/* Animated blob 1 */}
      <motion.div
        className="absolute -left-[10%] -top-[20%] size-[500px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.145 75 / 0.4), transparent 65%)",
          animation: reduce ? "none" : "blob 14s ease-in-out infinite",
        }}
        initial={reduce ? {} : { scale: 0.7, opacity: 0 }}
        animate={reduce ? {} : { scale: 1, opacity: 0.12 }}
        transition={{ duration: 2, delay: 0.2 }}
      />

      {/* Animated blob 2 */}
      <motion.div
        className="absolute -right-[5%] top-[10%] size-[400px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.12 250 / 0.4), transparent 65%)",
          animation: reduce ? "none" : "blob 18s ease-in-out 3s infinite reverse",
        }}
        initial={reduce ? {} : { scale: 0.7, opacity: 0 }}
        animate={reduce ? {} : { scale: 1, opacity: 0.08 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Animated blob 3 — bottom */}
      <motion.div
        className="absolute -bottom-[10%] left-[30%] size-[350px] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.145 75 / 0.3), transparent 65%)",
          animation: reduce ? "none" : "blob 16s ease-in-out 1s infinite",
        }}
        initial={reduce ? {} : { scale: 0.7, opacity: 0 }}
        animate={reduce ? {} : { scale: 1, opacity: 0.06 }}
        transition={{ duration: 2, delay: 0.8 }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
