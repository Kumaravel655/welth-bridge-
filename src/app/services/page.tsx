import {
  ArrowRight,
  Building2,
  Copyright,
  FileCheck2,
  HandCoins,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import {
  categories,
  groupsInCategory,
  services,
  type CategorySlug,
  type Service,
} from "@/lib/services";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Services",
  description: `Browse all ${services.length}+ services — company registration, GST and tax filing, trademarks, funding, legal drafting and NGO registration.`,
  alternates: { canonical: "/services" },
};

const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  "start-a-business": Building2,
  "tax-compliance": FileCheck2,
  "trademark-ip": Copyright,
  funding: HandCoins,
  ngo: HeartHandshake,
};

function ServiceHubCard({ service }: { service: Service }) {
  const Icon = CATEGORY_ICONS[service.category] ?? Building2;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.06]"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent-strong transition-transform duration-300 group-hover:rotate-6">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.short}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
          {service.price ? (
            <>
              Starting from{" "}
              <span className="font-semibold text-foreground">
                {formatINR(service.price)}
              </span>
            </>
          ) : (
            service.timeline
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-accent-strong">
          Learn more
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero — dark, office backdrop */}
      <section className="relative -mt-[4.75rem] overflow-hidden bg-ink pb-14 pt-36 text-ink-foreground">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/hero/office-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(2,8,30,0.82) 0%, rgba(2,8,30,0.6) 50%, rgba(2,8,30,0.4) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Services</span>
          </nav>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent-on-ink">
            Our services
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Everything your business needs, under one roof.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Strategic financial, compliance, and legal solutions tailored for
            modern enterprises — {services.length} services handled end to end.
          </p>

          {/* Category filter pills */}
          <nav aria-label="Service categories" className="mt-8 flex flex-wrap gap-2.5">
            <span className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground">
              All
            </span>
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="rounded-full border border-white/25 bg-white/5 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
              >
                {c.navLabel}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Category sections */}
      {categories.map((cat, i) => (
        <div key={cat.slug}>
          <section
            id={cat.slug}
            aria-labelledby={`${cat.slug}-heading`}
            className={`scroll-mt-24 ${i % 2 === 0 ? "bg-muted" : "bg-background"}`}
          >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
                      {`Phase ${String(i + 1).padStart(2, "0")}`}
                    </p>
                    <h2
                      id={`${cat.slug}-heading`}
                      className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
                    >
                      {cat.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">{cat.tagline}</p>
                  </div>
                  <Link
                    href="/portal/consultations"
                    className="group inline-flex items-center gap-1.5 font-bold text-accent-strong hover:underline"
                  >
                    Talk to an expert
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </div>
              </Reveal>

              {groupsInCategory(cat.slug).map(({ group, items }) => (
                <div key={group} className="mt-12">
                  <Reveal>
                    <p className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {group}
                    </p>
                  </Reveal>
                  <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((s) => (
                      <Reveal key={s.slug} className="h-full">
                        <ServiceHubCard service={s} />
                      </Reveal>
                    ))}
                  </RevealGroup>
                </div>
              ))}
            </div>
          </section>

          {/* Expert band after the first category */}
          {i === 0 && (
            <section className="px-4 py-4 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl bg-ink px-6 py-6 text-ink-foreground sm:flex-row sm:px-10">
                <p className="text-center font-display text-lg font-bold sm:text-left">
                  Not sure what you need? Talk to an expert — free.
                </p>
                <Link
                  href="/portal/consultations"
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Book Consultation
                </Link>
              </div>
            </section>
          )}
        </div>
      ))}

      <CTA />
    </>
  );
}
