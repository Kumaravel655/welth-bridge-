import type { Metadata } from "next";

import { RelatedServices } from "@/components/shared/related-services";
import { IncomeTaxCalculator } from "@/components/tools/income-tax-calculator";
import { getTool } from "@/lib/tools";

const tool = getTool("income-tax-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
  openGraph: {
    title: tool.name,
    description: tool.description,
    url: `/tools/${tool.slug}`,
    images: ["/og.png"],
  },
};

export default function IncomeTaxCalculatorPage() {
  return (
    <>
      <IncomeTaxCalculator />
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedServices slugs={tool.relatedServiceSlugs} />
        </div>
      </section>
    </>
  );
}
