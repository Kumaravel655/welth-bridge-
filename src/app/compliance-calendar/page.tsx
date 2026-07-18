import type { Metadata } from "next";

import { DeadlineCard } from "@/components/compliance/deadline-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { CategoryFilter } from "@/components/shared/category-filter";
import {
  complianceByCategory,
  complianceCategories,
  complianceDeadlines,
  type ComplianceCategorySlug,
} from "@/lib/compliance-calendar";

export const metadata: Metadata = {
  title: "Compliance Calendar",
  description:
    "Every recurring GST, income tax and ROC/MCA due date your business needs to track — in one place, so nothing gets missed.",
  alternates: { canonical: "/compliance-calendar" },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ComplianceCalendarPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = complianceCategories.find((c) => c.slug === category)?.slug as
    | ComplianceCategorySlug
    | undefined;

  const items = activeCategory
    ? complianceByCategory(activeCategory)
    : complianceDeadlines;

  return (
    <>
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950 text-center"
        style={{
          backgroundImage: 'url(/images/backgrounds/pricing-bg.png)',
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
              Compliance calendar
            </span>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              Deadlines you <em className="text-accent-on-ink">never</em> want to miss.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              GST, income tax and ROC due dates that repeat every month, quarter
              or year — bookmark this page or talk to us about handling it for you.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-slate-50 dark:bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/services-funding-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-slate-50 from-30% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <CategoryFilter
            basePath="/compliance-calendar"
            categories={complianceCategories}
            active={activeCategory}
          />

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <Reveal key={d.slug} className="h-full">
                <DeadlineCard deadline={d} />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTA />
    </>
  );
}
