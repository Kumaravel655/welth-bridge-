import type { Metadata } from "next";

import { RelatedServices } from "@/components/shared/related-services";
import { FundingEligibilityChecker } from "@/components/tools/funding-eligibility-checker";
import { getTool } from "@/lib/tools";

const tool = getTool("funding-eligibility-checker")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  openGraph: { title: tool.name, description: tool.description },
};

export default function FundingEligibilityCheckerPage() {
  return (
    <>
      <FundingEligibilityChecker />
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedServices slugs={tool.relatedServiceSlugs} />
        </div>
      </section>
    </>
  );
}
