import { Briefcase, Landmark, MapPin, Scale, TrendingUp, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

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
      <section className="bg-background text-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:px-8">
          <Reveal variant="fade-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-strong">
              About us
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              One firm on <span className="text-accent-strong">your side</span>{" "}
              of the paperwork.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The Wealth Bridge is a one-stop business setup and consulting
              company headquartered in Vellore, India. Since 2007, we&apos;ve
              helped individuals and business owners handle the legal and
              regulatory work of starting, funding and running a company — with
              clients across the globe.
            </p>
          </Reveal>

          <Reveal variant="fade-left">
            <div className="glass rounded-2xl border border-border p-3 shadow-xl shadow-accent/[0.06]">
              <Image
                src="/images/hero/office-meeting.jpg"
                alt="The Wealth Bridge team advising a founder"
                width={1264}
                height={848}
                className="w-full rounded-xl object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-muted">
        <RevealGroup className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          {aboutStats.map((s) => (
            <Reveal key={s.label} variant="fade-up" className="text-center lg:text-left">
              <p className="font-display text-4xl font-extrabold tracking-tight text-accent-strong sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* The team behind every file */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
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
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {professions.map((p) => (
            <Reveal key={p.title} className="h-full" variant="fade-up">
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.06]">
                <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent-strong">
                  <p.icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-base font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* Philosophy */}
      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
          <Reveal variant="fade-right">
            <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              &ldquo;The most important differentiator is not{" "}
              <em className="not-italic text-accent-strong">what</em> we do, but{" "}
              <em className="not-italic text-accent-strong">how</em> we do
              it.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              — The principle every engagement starts from
            </p>
          </Reveal>
          <Reveal delay={0.1} variant="fade-left">
            <p className="text-base leading-relaxed text-muted-foreground">
              We advise on the legal and regulatory requirements at every stage
              — from launching to establishing your business — and we are
              committed to delivering value that lasts beyond the filing.
            </p>
            <p className="mb-3 mt-6 font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
              Advisory areas
            </p>
            <ul className="flex flex-wrap gap-2">
              {advisoryAreas.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-strong"
                >
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Values />

      {/* Offices */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
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
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {site.offices.map((o) => (
            <Reveal key={o.city} className="h-full" variant="fade-up">
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent-strong">
                    <MapPin className="size-5" aria-hidden />
                  </div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent-strong">
                    {o.label}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
                  {o.city}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {o.address}
                </p>
                <div className="mt-4 space-y-1 border-t border-border pt-4">
                  {o.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block font-mono text-xs text-muted-foreground transition-colors hover:text-accent-strong"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <CTA />
    </>
  );
}
