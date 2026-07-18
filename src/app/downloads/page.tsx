import type { Metadata } from "next";

import { CategoryFilter } from "@/components/shared/category-filter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { DownloadCard } from "@/components/downloads/download-card";
import {
  downloadCategories,
  downloads,
  downloadsByCategory,
  type DownloadCategorySlug,
} from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Download Centre",
  description:
    "Free checklists, compliance calendars and templates for company registration, tax filing and fundraising — download and keep.",
  alternates: { canonical: "/downloads" },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function DownloadsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = downloadCategories.find((c) => c.slug === category)?.slug as
    | DownloadCategorySlug
    | undefined;

  const items = activeCategory ? downloadsByCategory(activeCategory) : downloads;

  return (
    <>
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950 text-center"
        style={{
          backgroundImage: 'url(/images/backgrounds/services-ngo-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-on-ink backdrop-blur-md mb-6">
              Download centre
            </span>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              Checklists worth <em className="text-accent-on-ink">keeping.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Free, practical PDFs for registration, tax filing and fundraising
              — no email required.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-slate-50 dark:bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/expert-guidance-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 from-30% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <CategoryFilter
            basePath="/downloads"
            categories={downloadCategories}
            active={activeCategory}
          />

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <Reveal key={d.slug} className="h-full">
                <DownloadCard download={d} />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTA />
    </>
  );
}
