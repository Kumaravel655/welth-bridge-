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

const CATEGORY_COLORS: Record<CategorySlug, { color: string; bg: string; border: string }> = {
  "start-a-business": { color: "text-blue-600", bg: "bg-blue-100", border: "hover:border-blue-200" },
  "tax-compliance": { color: "text-purple-600", bg: "bg-purple-100", border: "hover:border-purple-200" },
  "trademark-ip": { color: "text-emerald-600", bg: "bg-emerald-100", border: "hover:border-emerald-200" },
  funding: { color: "text-amber-600", bg: "bg-amber-100", border: "hover:border-amber-200" },
  ngo: { color: "text-rose-600", bg: "bg-rose-100", border: "hover:border-rose-200" },
};

const CATEGORY_BACKGROUNDS: Record<CategorySlug, string> = {
  "start-a-business": "url(/images/backgrounds/services-start-bg.png)",
  "tax-compliance": "url(/images/backgrounds/services-tax-bg.png)",
  "trademark-ip": "url(/images/backgrounds/services-ip-bg.png)",
  funding: "url(/images/backgrounds/services-funding-bg.png)",
  ngo: "url(/images/backgrounds/services-ngo-bg.png)",
};

function ServiceHubCard({ service }: { service: Service }) {
  const Icon = CATEGORY_ICONS[service.category] ?? Building2;
  const theme = CATEGORY_COLORS[service.category] ?? CATEGORY_COLORS["start-a-business"];
  
  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group flex h-full flex-col rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 border border-transparent shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.border}`}
    >
      <div className={`mb-6 flex size-14 items-center justify-center rounded-2xl ${theme.bg} transition-transform duration-300 group-hover:-translate-y-1`}>
        <Icon className={`size-7 ${theme.color}`} aria-hidden />
      </div>
      <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
        {service.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.short}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
          {service.price ? (
            <>
              Starting from{" "}
              <span className="font-bold text-foreground">
                {formatINR(service.price)}
              </span>
            </>
          ) : (
            <span className="font-medium text-foreground">{service.timeline}</span>
          )}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${theme.color}`}>
          Explore
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </div>
      </section>

      {/* Sticky Category Navigation */}
      <div className="sticky top-[4.5rem] z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Service categories" className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
            <span className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm">
              All
            </span>
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
              >
                {c.navLabel}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Category sections */}
      {categories.map((cat, i) => {
        const isEven = i % 2 === 0;
        return (
        <div key={cat.slug}>
          <section
            id={cat.slug}
            aria-labelledby={`${cat.slug}-heading`}
            className="scroll-mt-28 py-20 sm:py-24 relative overflow-hidden"
            style={{
              backgroundImage: CATEGORY_BACKGROUNDS[cat.slug],
              backgroundSize: 'cover',
              backgroundPosition: isEven ? 'right center' : 'left center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Gradient overlay fades from solid to transparent to keep the image bright and crisp without fog */}
            <div 
              className={`absolute inset-0 z-0 ${
                isEven 
                  ? "bg-gradient-to-r from-slate-50 from-40% to-transparent dark:from-slate-950 dark:to-transparent" 
                  : "bg-gradient-to-l from-white from-40% to-transparent dark:from-slate-900 dark:to-transparent"
              }`} 
            />
            
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className={`flex flex-wrap items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8 ${isEven ? "" : "flex-row-reverse text-right"}`}>
                  <div className="max-w-2xl">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                      {`Phase ${String(i + 1).padStart(2, "0")}`}
                    </p>
                    <h2
                      id={`${cat.slug}-heading`}
                      className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                    >
                      {cat.title}
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground">{cat.tagline}</p>
                  </div>
                  <Link
                    href="/portal/consultations"
                    className={`group inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline ${isEven ? "" : "flex-row-reverse"}`}
                  >
                    Talk to an expert
                    <ArrowRight
                      className={`size-4 transition-transform duration-300 ${isEven ? "group-hover:translate-x-1" : "rotate-180 group-hover:-translate-x-1"}`}
                      aria-hidden
                    />
                  </Link>
                </div>
              </Reveal>

              {groupsInCategory(cat.slug).map(({ group, items }) => (
                <div key={group} className="mt-12">
                  <Reveal>
                    <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground border-l-2 border-indigo-600 pl-3">
                      {group}
                    </p>
                  </Reveal>
                  <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <section className="bg-white dark:bg-slate-900 px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 p-8 shadow-xl sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full" />
                <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row text-center sm:text-left">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">
                      Not sure what you need?
                    </h3>
                    <p className="text-indigo-100/80 text-lg">
                      Talk to an expert for free. We'll build a custom compliance roadmap for you.
                    </p>
                  </div>
                  <Link
                    href="/portal/consultations"
                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-indigo-900 shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      )})}

      <CTA />
    </>
  );
}
