import { Briefcase, Landmark, MapPin, Scale, TrendingUp, Users } from "lucide-react";
import type { Metadata } from "next";

import { Counter } from "@/components/motion/counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { Values } from "@/components/sections/values";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Wealth Bridge is a one-stop business setup and consulting company from Vellore, India — business analysts, company secretaries, chartered accountants, corporate lawyers and financial professionals under one roof since 2007.",
  alternates: { canonical: "/about" },
};

const aboutStats = [
  { value: 18, suffix: "+", label: "Years in practice" },
  { value: 65, suffix: "+", label: "Services under one roof" },
  { value: 3, suffix: "", label: "Offices in Tamil Nadu" },
  { value: 4, suffix: "", label: "Professions on your file" },
];

const professions = [
  {
    icon: TrendingUp,
    title: "Business Analysts",
    body: "Map your plans to the right structure and registrations.",
  },
  {
    icon: Briefcase,
    title: "Company Secretaries",
    body: "Keep every board action and ROC filing by the book.",
  },
  {
    icon: Landmark,
    title: "Chartered Accountants",
    body: "Books, taxes and financial reports built to stand scrutiny.",
  },
  {
    icon: Scale,
    title: "Corporate Lawyers",
    body: "Agreements and IP protection drafted, not downloaded.",
  },
  {
    icon: Users,
    title: "Financial Professionals",
    body: "Funding, loans and credit — matched to your profile.",
  },
];

const advisoryAreas = [
  "Finance",
  "Strategy planning",
  "Performance improvement",
  "Risk & governance",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/client-review-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-on-ink backdrop-blur-md mb-6">
              About us
            </span>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              One firm on <span className="text-accent-on-ink">your side</span>{" "}
              of the paperwork.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              The Wealth Bridge is a one-stop business setup and consulting
              company headquartered in Vellore, India. Since 2007, we&apos;ve
              helped individuals and business owners handle the legal and
              regulatory work of starting, funding and running a company — with
              clients across the globe.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats banner */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <RevealGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {aboutStats.map((s) => (
            <Reveal key={s.label} variant="fade-up" className="rounded-3xl border border-border bg-white/85 dark:bg-slate-900/85 p-8 text-center shadow-lg backdrop-blur-md transition-transform hover:-translate-y-1">
              <p className="font-display text-4xl font-extrabold tracking-tight text-accent-strong sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* The team behind every file (Right-aligned image, zigzag) */}
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950 mt-12"
        style={{
          backgroundImage: 'url(/images/backgrounds/expert-guidance-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 from-40% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Who works on your file"
            title={
              <>
                Five professions.{" "}
                <em className="font-semibold not-italic text-accent-strong">
                  One desk.
                </em>
              </>
            }
            lede="Most filings touch more than one discipline. Here, the accountant, the lawyer and the company secretary sit in the same office — so nothing gets lost between specialists."
          />
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {professions.map((p) => (
              <Reveal key={p.title} className="h-full" variant="fade-up">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.06]">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent-strong border border-accent/20">
                    <p.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Philosophy (Left-aligned image, zigzag) */}
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/colorful-office-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 from-40% via-slate-950/90 to-slate-950/10 z-0" />
        
        <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="hidden lg:block" /> {/* Spacer for the left side image */}
          <div>
            <Reveal variant="fade-left">
              <blockquote className="font-display text-3xl font-bold leading-snug tracking-tight sm:text-4xl text-white">
                &ldquo;The most important differentiator is not{" "}
                <em className="not-italic text-accent-on-ink">what</em> we do, but{" "}
                <em className="not-italic text-accent-on-ink">how</em> we do
                it.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm font-medium text-slate-400">
                — The principle every engagement starts from
              </p>
            </Reveal>
            <Reveal delay={0.1} variant="fade-up">
              <p className="mt-8 text-lg leading-relaxed text-slate-300">
                We advise on the legal and regulatory requirements at every stage
                — from launching to establishing your business — and we are
                committed to delivering value that lasts beyond the filing.
              </p>
              <p className="mb-4 mt-10 font-mono text-xs uppercase tracking-[0.16em] text-accent-on-ink">
                Advisory areas
              </p>
              <ul className="flex flex-wrap gap-3">
                {advisoryAreas.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-medium text-white shadow-sm"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <Values />

      {/* Offices (Right-aligned image, zigzag) */}
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/cta-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 from-30% via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Where to find us"
            title={
              <>
                Three offices across{" "}
                <em className="font-semibold not-italic text-accent-strong">
                  Tamil Nadu.
                </em>
              </>
            }
          />
          <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3">
            {site.offices.map((o) => (
              <Reveal key={o.city} className="h-full" variant="fade-up">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent-strong border border-accent/20">
                      <MapPin className="size-5" aria-hidden />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-strong font-semibold">
                      {o.label}
                    </p>
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-bold tracking-tight">
                    {o.city}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                    {o.address}
                  </p>
                  <div className="mt-6 space-y-2 border-t border-border pt-6">
                    {o.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="block font-mono text-sm text-foreground transition-colors hover:text-accent-strong"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTA />
    </>
  );
}
