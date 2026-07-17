import type { Metadata } from "next";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { ToolCard } from "@/components/tools/tool-card";
import { toolCategories, toolsByCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Business Tools & Calculators",
  description:
    "Free EMI, GST and income tax calculators plus startup and funding eligibility checkers — built for Indian founders and businesses.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
            Free tools
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Calculators and checkers,{" "}
            <em className="text-accent-strong">on the house.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Quick answers on EMIs, GST, income tax and eligibility — no
            sign-up required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {toolCategories.map((cat) => {
          const items = toolsByCategory(cat.slug);
          if (items.length === 0) return null;
          return (
            <section key={cat.slug} className="border-b border-border py-12 last:border-b-0">
              <Reveal>
                <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                  {cat.title}
                </h2>
              </Reveal>
              <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((tool) => (
                  <Reveal key={tool.slug} className="h-full">
                    <ToolCard tool={tool} />
                  </Reveal>
                ))}
              </RevealGroup>
            </section>
          );
        })}
      </div>

      <CTA />
    </>
  );
}
