"use client";

import * as React from "react";

const VIDEO_SRC = "/Create_a_second_ultra_reali.mp4";
const POSTER_SRC = "/images/hero/bridge-video-poster.jpg";

/**
 * Full-bleed hero background video: a looping cinematic skyline/bridge shot.
 * Under prefers-reduced-motion we skip the <video> entirely and show its
 * poster frame as a static image instead of an autoplaying-but-frozen tag.
 */
export function HeroVideo({ className }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      {reduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <video
          className="absolute inset-0 size-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
      )}

      {/* Scrim: a vivid blue glow (fbspl.com-inspired) over the existing
          directional navy fade, so bottom-left text stays legible while the
          skyline's lights read as a glowing accent rather than washed out. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(62% 75% at 74% 38%, oklch(0.55 0.18 256 / 0.4) 0%, transparent 62%), linear-gradient(180deg, oklch(0.19 0.075 256 / 0.15) 0%, oklch(0.19 0.075 256 / 0.6) 60%, oklch(0.14 0.07 256 / 0.92) 100%), linear-gradient(90deg, oklch(0.14 0.07 256 / 0.72) 0%, transparent 55%)",
        }}
      />
    </div>
  );
}
