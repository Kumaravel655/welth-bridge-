"use client";

import { SectionHeading } from "@/components/sections/section-heading";

export function BrandFilm() {

  return (
    <section className="relative overflow-hidden border-y border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-indigo-50">

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
