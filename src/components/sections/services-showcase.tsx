import {
  ArrowRight,
  Building2,
  ChevronRight,
  Copyright,
  FileCheck2,
  HandCoins,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { categories } from "@/lib/services";

import { SectionHeading } from "./section-heading";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "start-a-business": Building2,
  "tax-compliance": FileCheck2,
  "trademark-ip": Copyright,
  funding: HandCoins,
  ngo: HeartHandshake,
};

export function ServicesShowcase() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Expert guidance for every stage of{" "}
              <em className="font-semibold not-italic text-accent-strong">
                your business.
              </em>
            </>
          }
          lede="From incorporation to annual audits, we provide a complete suite of services tailored for modern entrepreneurs."
        />
        <Reveal delay={0.1} variant="fade-right">
          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 font-bold text-accent-strong hover:underline"
          >
            View all services
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug] ?? Building2;
          return (
            <Reveal key={cat.slug} className="h-full" variant="fade-up">
              <Link
                href={`/services#${cat.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.06]"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent-strong transition-transform duration-300 group-hover:rotate-12">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {cat.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cat.tagline}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-bold text-accent-strong">
                  Learn more
                  <ChevronRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </RevealGroup>
    </section>
  );
}
