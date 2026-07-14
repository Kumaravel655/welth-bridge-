"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";

const SLIDES = [
  { src: "/images/hero/skyline-tagline.png", alt: "Bridge and city skyline at dusk" },
  { src: "/images/hero/skyline-chart.png", alt: "City skyline with market growth overlay" },
  { src: "/images/hero/globe.png", alt: "Global network of connections across the world" },
];

const SLIDE_DURATION = 6;
const FADE_DURATION = 1.4;
const ZOOM_TO = 1.08;

/**
 * Full-bleed hero slideshow: a GSAP-driven crossfade between stills, each
 * given a slow continuous ken-burns zoom while it's active. Loops forever
 * via a self-scheduling recursive delayedCall (simpler to reason about and
 * clean up than juggling timeline position parameters). Skipped entirely
 * under prefers-reduced-motion, where the first slide is shown statically.
 */
export function HeroSlideshow({ className }: { className?: string }) {
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const slides = slideRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (slides.length < 2) return;

    gsap.set(slides, { autoAlpha: 0, scale: 1 });
    gsap.set(slides[0], { autoAlpha: 1 });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens: gsap.core.Tween[] = [];
    let delayedCall: gsap.core.Tween;

    const zoom = (el: HTMLDivElement) => {
      tweens.push(gsap.to(el, { scale: ZOOM_TO, duration: SLIDE_DURATION + FADE_DURATION, ease: "none" }));
    };

    const cycle = (i: number) => {
      const current = slides[i];
      const next = slides[(i + 1) % slides.length];

      gsap.set(next, { scale: 1 });
      tweens.push(
        gsap.to(next, { autoAlpha: 1, duration: FADE_DURATION, ease: "power2.inOut" }),
        gsap.to(current, { autoAlpha: 0, duration: FADE_DURATION, ease: "power2.inOut" }),
      );
      zoom(next);

      delayedCall = gsap.delayedCall(SLIDE_DURATION, () => cycle((i + 1) % slides.length));
    };

    zoom(slides[0]);
    delayedCall = gsap.delayedCall(SLIDE_DURATION, () => cycle(0));

    return () => {
      delayedCall?.kill();
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
          className="absolute inset-0 size-full"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Scrim so the real heading/CTAs (bottom-left) stay legible over any slide */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.19 0.075 256 / 0.1) 0%, oklch(0.19 0.075 256 / 0.55) 60%, oklch(0.19 0.075 256 / 0.85) 100%), linear-gradient(90deg, oklch(0.19 0.075 256 / 0.6) 0%, transparent 55%)",
        }}
      />
    </div>
  );
}
