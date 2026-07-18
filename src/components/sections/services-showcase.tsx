"use client";

import {
  ArrowRight,
  Building2,
  Copyright,
  FileCheck2,
  HandCoins,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import {
  categories,
  servicesByCategory,
  services,
  type CategorySlug,
} from "@/lib/services";

import { SectionHeading } from "./section-heading";

const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  "start-a-business": Building2,
  "tax-compliance": FileCheck2,
  "trademark-ip": Copyright,
  funding: HandCoins,
  ngo: HeartHandshake,
};

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  const Icon = CATEGORY_ICONS[category.slug] ?? Building2;
  const count = servicesByCategory(category.slug).length;
  return (
    <Link
      href={`/services#${category.slug}`}
      aria-label={`${category.title} — ${count} services`}
      className="group flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-7 shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.06] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent-strong transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
          <Icon className="size-6" aria-hidden />
        </span>
        {/* Trust metric — real count of services in this area */}
        <span className="rounded-full bg-muted px-3 py-1 font-mono text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
          {count} services
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
        {category.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {category.tagline}
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-accent-strong">
        Explore
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}

export function ServicesShowcase() {
  // Duplicate the categories so the marquee can loop seamlessly.
  const loop = [...categories, ...categories, ...categories, ...categories];

  return (
    <section 
      className="relative overflow-hidden py-20 sm:py-32 bg-indigo-950"
      style={{
        backgroundImage: 'url(/images/backgrounds/expert-guidance-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Gradient overlay fades from solid to transparent to keep the image bright and crisp without fog */}
      <div className="absolute inset-0 bg-gradient-to-l from-indigo-950 from-40% to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 flex-row-reverse">
          <SectionHeading
            align="right"
            eyebrow="What we do"
            title={
              <>
                Expert guidance for every stage of{" "}
                <em className="font-semibold not-italic text-indigo-300">
                  your business.
                </em>
              </>
            }
            lede={`From incorporation to annual audits — ${services.length} services across five areas, each handled start to finish by the right professional.`}
            onInk={true}
          />
          <Reveal delay={0.1} variant="fade-left">
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 rounded-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
            >
              <ArrowRight
                className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                aria-hidden
              />
              View all services
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Auto-scrolling category rail — pauses on hover and keyboard focus */}
      <div className="group relative mt-12 pb-12">
        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none pl-5">
          {loop.map((c, i) => (
            <CategoryCard key={`${c.slug}-${i}`} category={c} />
          ))}
        </div>

        {/* Fade mask for the right side (solid color), no mask on left to let cards glide over the image */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-indigo-950 to-transparent sm:w-32" />
      </div>
    </section>
  );
}
