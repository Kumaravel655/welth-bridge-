"use client";

import { SectionHeading } from "@/components/sections/section-heading";

export function BrandFilm() {

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {/* Soft blue wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[760px] max-w-[130vw] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.15 256 / 0.10) 0%, transparent 62%)",
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


      </div>
    </section>
  );
}
