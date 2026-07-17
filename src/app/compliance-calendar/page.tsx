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
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
            Compliance calendar
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Deadlines you <em className="text-accent-strong">never</em> want to miss.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            GST, income tax and ROC due dates that repeat every month, quarter
            or year — bookmark this page or talk to us about handling it for you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryFilter
          basePath="/compliance-calendar"
          categories={complianceCategories}
          active={activeCategory}
        />

        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <Reveal key={d.slug} className="h-full">
              <DeadlineCard deadline={d} />
            </Reveal>
          ))}
        </RevealGroup>
      </div>

      <CTA />
    </>
  );
}
