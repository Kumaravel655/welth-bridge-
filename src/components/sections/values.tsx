"use client";

import { CheckCircle2, Handshake, Repeat, Sparkles } from "lucide-react";

import { Reveal, RevealGroup } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

const promises = [
  "Transparent, fixed professional fees",
  "One dedicated point of contact",
  "Secure client portal for every document",
];

const values = [
  {
    icon: Handshake,
    title: "Trust",
    body: "We do what we say, every time. Your filings go out when we said they would, and you hear from us before you have to ask.",
  },
  {
    icon: Repeat,
    title: "Consistency",
    body: "Nothing erodes trust faster than inconsistency. The same standard applies to your first filing and your fiftieth.",
  },
  {
    icon: Sparkles,
    title: "Convenience",
    body: "One checklist, one point of contact, zero government-office queues. Compliance should be the easiest part of your week.",
    wide: true,
  },
];

export function Values() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <Reveal className="lg:col-span-1" variant="fade-right">
            <SectionHeading
              eyebrow="How we work"
              title={
                <>
                  What makes a consultant worth{" "}
                  <em className="text-accent-strong font-semibold not-italic">keeping.</em>
                </>
              }
              lede="Eighteen years in, most of our work comes from clients who stayed — and the people they sent our way."
            />
            <ul className="mt-6 space-y-3">
              {promises.map((p) => (
                <li key={p} className="flex items-center gap-3 font-semibold text-foreground">
                  <CheckCircle2 className="size-5 shrink-0 text-accent-strong" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
            {values.map((v) => (
              <Reveal
                key={v.title}
                variant="scale-in"
                className={v.wide ? "sm:col-span-2" : undefined}
              >
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-md">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10">
                    <v.icon className="size-6 text-accent-strong" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-display text-xl tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
