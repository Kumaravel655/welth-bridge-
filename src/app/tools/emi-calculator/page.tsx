import type { Metadata } from "next";

import { EmiCalculator } from "@/components/tools/emi-calculator";
import { RelatedServices } from "@/components/shared/related-services";
import { getTool } from "@/lib/tools";

const tool = getTool("emi-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  openGraph: { title: tool.name, description: tool.description },
};

export default function EmiCalculatorPage() {
  return (
    <>
      <EmiCalculator />
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedServices slugs={tool.relatedServiceSlugs} />
        </div>
      </section>
    </>
  );
}
