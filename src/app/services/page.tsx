import type { Metadata } from "next";

import Image from "next/image";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { ServiceCard } from "@/components/service/service-card";
import { categories, groupsInCategory, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "All Services",
  description: `Browse all ${services.length}+ services — company registration, GST and tax filing, trademarks, funding, legal drafting and NGO registration.`,
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            All services
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            {services.length}+ ways we carry the{" "}
            <em className="text-[var(--accent)]">paperwork.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            Every service below is handled end to end — you send documents
            once, we file, follow up and deliver.
          </p>
          <nav aria-label="Service categories" className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="rounded-full border border-ink-border px-4 py-1.5 text-sm text-ink-muted transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {c.navLabel}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => (
          <section
            key={cat.slug}
            id={cat.slug}
            aria-labelledby={`${cat.slug}-heading`}
            className="scroll-mt-24 border-b border-border py-16 last:border-b-0 sm:py-20"
          >
            <Reveal>
              <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
                <div>
                  <h2
                    id={`${cat.slug}-heading`}
                    className="font-display text-3xl tracking-tight sm:text-4xl"
                  >
                    {cat.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{cat.tagline}</p>
                </div>
                <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-ink-border/40">
                  <Image
                    src={`/images/categories/${cat.slug}.png`}
                    alt={cat.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/10" />
                </div>
              </div>
            </Reveal>

            {groupsInCategory(cat.slug).map(({ group, items }) => (
              <div key={group} className="mt-10">
                <Reveal>
                  <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
                    {group}
                  </p>
                </Reveal>
                <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <Reveal key={s.slug} className="h-full">
                      <ServiceCard service={s} showGroup={false} />
                    </Reveal>
                  ))}
                </RevealGroup>
              </div>
            ))}
          </section>
        ))}
      </div>

      <CTA />
    </>
  );
}
