import type { Metadata } from "next";

import { RelatedServices } from "@/components/shared/related-services";
import { StartupEligibilityChecker } from "@/components/tools/startup-eligibility-checker";
import { getTool } from "@/lib/tools";

const tool = getTool("startup-eligibility-checker")!;

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

export default function StartupEligibilityCheckerPage() {
  return (
    <>
      <StartupEligibilityChecker />
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedServices slugs={tool.relatedServiceSlugs} />
        </div>
      </section>
    </>
  );
}
