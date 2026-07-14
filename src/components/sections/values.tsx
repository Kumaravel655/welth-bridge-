"use client";

import { Handshake, Repeat, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Reveal, RevealGroup } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

const values = [
  {
    icon: Handshake,
    title: "Trust",
    body: "We do what we say, every time. Your filings go out when we said they would, and you hear from us before you have to ask.",
    gradient: "from-accent/20 via-accent-strong/10 to-sky-400/20",
  },
  {
    icon: Repeat,
    title: "Consistency",
    body: "Nothing erodes trust faster than inconsistency. The same standard applies to your first filing and your fiftieth.",
    gradient: "from-blue-500/20 via-indigo-500/10 to-cyan-500/20",
  },
  {
    icon: Sparkles,
    title: "Convenience",
    body: "One checklist, one point of contact, zero government-office queues. Compliance should be the easiest part of your week.",
    gradient: "from-emerald-500/20 via-teal-500/10 to-green-500/20",
  },
];

export function Values() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              What makes a consultant worth{" "}
              <em className="text-gradient">keeping.</em>
            </>
          }
          lede="Eighteen years in, most of our work comes from clients who stayed — and the people they sent our way. These are the three reasons why."
        />

        <RevealGroup className="mt-12 grid gap-10 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} variant="scale-in">
              <div className="group relative">
                {/* Connecting line between cards */}
                {i < values.length - 1 && (
                  <motion.div
                    aria-hidden
                    className="absolute -right-5 top-8 hidden h-px w-10 bg-gradient-to-r from-accent/40 to-transparent md:block"
                    initial={reduce ? {} : { scaleX: 0 }}
                    whileInView={reduce ? {} : { scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  />
                )}

                {/* Icon with animated gradient background */}
                <div className={`relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${v.gradient} transition-transform duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-2xl border border-accent/20" />
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
    </section>
  );
}
