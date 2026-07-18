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
  const bgImages = [
    '/images/backgrounds/pricing-bg.png', // Calculators (Numbers/Dashboard)
    '/images/backgrounds/expert-guidance-bg.png', // Eligibility Checkers (Guidance/Strategy)
  ];

  return (
    <>
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/colorful-office-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-on-ink mb-4">
              Free tools
            </p>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              Calculators and checkers,{" "}
              <em className="text-accent-on-ink">on the house.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Quick answers on EMIs, GST, income tax and eligibility — no
              sign-up required.
            </p>
          </Reveal>
        </div>
      </section>

      {toolCategories.map((cat, index) => {
        const items = toolsByCategory(cat.slug);
        if (items.length === 0) return null;

        const isEven = index % 2 === 0;
        const bgImage = bgImages[index % bgImages.length];
        
        return (
          <section 
            key={cat.slug} 
            className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950 border-b border-border last:border-b-0"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: isEven ? 'right center' : 'left center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Gradient overlay fades to transparent to reveal the image on the designated side */}
            <div 
              className={`absolute inset-0 z-0 ${
                isEven 
                  ? 'bg-gradient-to-r from-slate-50 from-30% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10' 
                  : 'bg-gradient-to-l from-slate-50 from-30% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10'
              }`} 
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col gap-16 lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                
                {/* Text Content */}
                <div className="flex-1 lg:max-w-xl lg:pt-8">
                  <Reveal>
                    <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                      {cat.title}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      {cat.slug === "calculator" 
                        ? "Run the numbers instantly with our precision financial tools." 
                        : "Find out what you qualify for in just a few clicks."}
                    </p>
                  </Reveal>
                </div>

                {/* Tool Cards Grid */}
                <div className="flex-[1.5]">
                  <RevealGroup className="grid gap-5 sm:grid-cols-2">
                    {items.map((tool) => (
                      <Reveal key={tool.slug} className="h-full">
                        <ToolCard tool={tool} />
                      </Reveal>
                    ))}
                  </RevealGroup>
                </div>

              </div>
            </div>
          </section>
        );
      })}

      <CTA />
    </>
  );
}
