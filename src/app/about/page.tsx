import { Briefcase, Landmark, Scale, TrendingUp, Users } from "lucide-react";
import type { Metadata } from "next";

import { SceneArt } from "@/components/art/scene-art";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { Stats } from "@/components/sections/stats";
import { Values } from "@/components/sections/values";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Wealth Bridge is a one-stop business setup and consulting company from Vellore, India — business analysts, company secretaries, chartered accountants, corporate lawyers and financial professionals under one roof since 2007.",
};

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
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              About us
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl">
              One firm on <em className="text-[var(--accent)]">your side</em> of
              the paperwork.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              The Wealth Bridge is a one-stop business setup and consulting
              company headquartered in Vellore, India. Since 2007, we&apos;ve
              helped individuals and business owners handle the legal and
              regulatory work of starting, funding and running a company — with
              clients across the globe.
            </p>
          </div>
          <SceneArt
            variant="skyline"
            className="aspect-[4/3] border border-ink-border/40 shadow-2xl shadow-black/30"
          />
        </div>
      </section>

      <Stats />

      {/* The team behind every file */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Who works on your file"
          title={
            <>
              Five professions.{" "}
              <em className="text-accent-strong">One desk.</em>
            </>
          }
          lede="Most filings touch more than one discipline. Here, the accountant, the lawyer and the company secretary sit in the same office — so nothing gets lost between specialists."
        />
        <Reveal className="mt-10">
          <SceneArt
            variant="workspace"
            decorative
            className="h-44 border border-border sm:h-56"
          />
        </Reveal>
        <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {professions.map((p) => (
            <Reveal key={p.title} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-5">
                <p.icon className="size-5 text-accent-strong" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* Philosophy */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <blockquote className="font-display text-2xl leading-snug tracking-tight sm:text-3xl">
              &ldquo;The most important differentiator is not{" "}
              <em className="text-accent-strong">what</em> we do, but{" "}
              <em className="text-accent-strong">how</em> we do it.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              — The principle every engagement starts from
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We advise on the legal and regulatory requirements at every stage
              — from launching to establishing your business — and we are
              committed to delivering value that lasts beyond the filing.
            </p>
            <p className="mt-4 mb-3 font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
              Advisory areas
            </p>
            <ul className="flex flex-wrap gap-2">
              {advisoryAreas.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm"
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
              <em className="text-accent-strong">Tamil Nadu.</em>
            </>
          }
        />
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {site.offices.map((o) => (
            <Reveal key={o.city} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent-strong">
                  {o.label}
                </p>
                <h3 className="mt-2 font-display text-2xl tracking-tight">
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
