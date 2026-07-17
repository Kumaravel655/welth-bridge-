"use client";

import { motion, useReducedMotion } from "motion/react";

import { Reveal, RevealGroup } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

const steps = [
  {
    title: "Consult",
    body: "Book a free slot online — phone, video or in-office — and an expert confirms exactly which registrations your business needs, what the fees are, and which you can skip.",
  },
  {
    title: "Documents",
    body: "You get one simple checklist. Send everything over WhatsApp or email; we verify each document before anything is filed.",
  },
  {
    title: "Filing",
    body: "We prepare and submit the application, then chase the department so you never have to visit a government office.",
  },
  {
    title: "Registered",
    body: "Certificate in hand, with clear guidance on the compliance calendar that starts the day your business does.",
  },
];

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        onInk
        eyebrow="Crossing the bridge"
        title={
          <>
            Four steps. <em className="text-white font-semibold not-italic drop-shadow-sm">One crossing.</em>
          </>
        }
        lede="The same path, whether it's a GST number or a private limited company — you stay on your business, we handle the paperwork."
      />

      <RevealGroup className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} className="relative" variant="fade-up">
            {/* Animated connector line to the next step */}
            {i < steps.length - 1 && (
              <motion.span
                aria-hidden
                className="absolute left-14 top-5 hidden h-px w-[calc(100%-2rem)] origin-left bg-gradient-to-r from-white/50 via-white/20 to-transparent lg:block"
                initial={reduce ? {} : { scaleX: 0 }}
                whileInView={reduce ? {} : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5 + i * 0.2,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            )}

            {/* Step number with pulse ring */}
            <div className="relative">
              <span className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 font-mono text-sm font-semibold text-white drop-shadow-md backdrop-blur-sm">
                {i + 1}
              </span>
              {/* Pulse ring animation on scroll */}
              <motion.span
                aria-hidden
                className="absolute inset-0 size-10 rounded-full border border-white/30"
                initial={reduce ? {} : { scale: 1, opacity: 0 }}
                whileInView={
                  reduce
                    ? {}
                    : {
                        scale: [1, 1.6],
                        opacity: [0.5, 0],
                      }
                }
                viewport={{ once: true }}
                transition={{
                  delay: 0.8 + i * 0.15,
                  duration: 1,
                  ease: "easeOut",
                }}
              />
            </div>

            <h3 className="mt-4 font-display text-lg tracking-tight">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-indigo-200/90">
              {s.body}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
      </div>
    </section>
  );
}
