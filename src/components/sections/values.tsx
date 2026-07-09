import { Handshake, Repeat, Sparkles } from "lucide-react";

import { Reveal, RevealGroup } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

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
  },
];

export function Values() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              What makes a consultant worth{" "}
              <em className="text-accent-strong">keeping.</em>
            </>
          }
          lede="Eighteen years in, most of our work comes from clients who stayed — and the people they sent our way. These are the three reasons why."
        />

        <RevealGroup className="mt-12 grid gap-10 md:grid-cols-3">
          {values.map((v) => (
            <Reveal key={v.title}>
              <div className="flex size-11 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent-strong">
                <v.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-xl tracking-tight">
                {v.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
