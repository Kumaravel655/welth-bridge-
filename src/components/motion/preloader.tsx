"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * First-load brand intro. Plays the WealthBridge reveal film once per browser
 * session, then fades to reveal the site. Skips instantly for repeat visits
 * (sessionStorage) and for visitors who prefer reduced motion.
 */
const SESSION_KEY = "wb-intro-played";
const PLAY_MS = 4200; // let the particles resolve into the logo
const FADE_MS = 700;

type Phase = "in" | "out" | "gone";

export function Preloader() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("in");

  // Decide whether to play; lock scroll while the intro is on screen.
  useEffect(() => {
    let played = false;
    try {
      played = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}

    if (played || reduce) {
      setPhase("gone");
      return;
    }

    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setPhase("out"), PLAY_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  // Finalize once the fade-out begins.
  useEffect(() => {
    if (phase !== "out") return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    document.body.style.overflow = "";
    const t = window.setTimeout(() => setPhase("gone"), FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  const leaving = phase === "out";

  return (
    <motion.div
      aria-hidden
      onClick={() => setPhase("out")}
      className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center overflow-hidden bg-ink"
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      style={{ pointerEvents: leaving ? "none" : "auto" }}
    >
      {/* Marigold glow behind the film */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[720px] max-w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.145 75 / 0.10) 0%, transparent 62%)",
        }}
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/brand-reveal.gif"
          alt="The Wealth Bridge"
          width={480}
          height={214}
          priority
          unoptimized
          className="h-auto w-[min(90vw,560px)] select-none"
        />
      </motion.div>

      {/* Progress line — fills over the intro duration */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
        style={{ background: "var(--gradient-gold)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: leaving ? 1 : 1 }}
        transition={{ duration: PLAY_MS / 1000, ease: "linear" }}
      />

      {/* Skip affordance */}
      <span className="absolute bottom-6 right-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted/70">
        Tap to skip
      </span>
    </motion.div>
  );
}
