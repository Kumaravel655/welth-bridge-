"use client";

import { SectionHeading } from "@/components/sections/section-heading";

export function BrandFilm() {

  return (
    <section className="relative overflow-hidden border-y border-ink-border bg-ink text-ink-foreground">
      {/* Diagonal navy gradient — inline style, not a Tailwind palette class,
          so it renders the same regardless of the build environment. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-navy)" }}
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
