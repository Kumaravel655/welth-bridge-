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
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
            Download centre
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Checklists worth <em className="text-accent-strong">keeping.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Free, practical PDFs for registration, tax filing and fundraising
            — no email required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryFilter
          basePath="/downloads"
          categories={downloadCategories}
          active={activeCategory}
        />

        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <Reveal key={d.slug} className="h-full">
              <DownloadCard download={d} />
            </Reveal>
          ))}
        </RevealGroup>
      </div>

      <CTA />
    </>
  );
}
