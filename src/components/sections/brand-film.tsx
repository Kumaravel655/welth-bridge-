"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

export function BrandFilm() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {/* Soft marigold wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[760px] max-w-[130vw] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.145 75 / 0.10) 0%, transparent 62%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Making more possibilities"
          title="One name behind every filing."
          lede="From a single spark of an idea to a fully incorporated business — the same steady hand at every step. This is the bridge your business crosses."
          align="center"
          onInk
        />

        <Reveal variant="scale-in" delay={0.1}>
          <figure className="group relative mx-auto mt-12 max-w-4xl">
            {/* Gold hairline frame */}
            <div
              className="rounded-[1.35rem] p-px shadow-2xl shadow-black/40"
              style={{ background: "var(--gradient-gold)" }}
            >
              <div className="relative overflow-hidden rounded-[1.3rem] bg-ink-raised ring-1 ring-inset ring-white/5">
                <Image
                  src={reduce ? "/brand-reveal-poster.jpg" : "/brand-reveal.gif"}
                  alt="The Wealth Bridge brand film — particles resolving into the Wealth Bridge logo"
                  width={480}
                  height={214}
                  unoptimized={!reduce}
                  className="h-auto w-full select-none"
                />
                {/* Cinematic vignette */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 50% 50%, transparent 60%, oklch(0.15 0.03 250 / 0.35) 100%)",
                  }}
                />
              </div>
            </div>
            <figcaption className="mt-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
              The Wealth Bridge · Brand film
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
