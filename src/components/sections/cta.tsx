"use client";

import { ArrowRight, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { GradientMesh } from "@/components/motion/gradient-mesh";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { TextRevealOnScroll } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CTA() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {/* Animated gradient background */}
      <GradientMesh />

      {/* Radial pulse */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.145 75 / 0.08) 0%, transparent 60%)",
        }}
        initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
        whileInView={reduce ? {} : { scale: [0.8, 1.2, 1], opacity: [0, 0.6, 0.4] }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]"
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready when you are
          </motion.p>

          <TextRevealOnScroll
            as="h2"
            delay={0.1}
            className="mt-4 font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl"
          >
            Your company is one call away.
          </TextRevealOnScroll>

          <motion.p
            className="mt-5 text-base leading-relaxed text-ink-muted"
            initial={reduce ? {} : { opacity: 0, y: 12 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Tell us what you&apos;re building. We&apos;ll tell you exactly which
            registrations you need, what they cost, and how long they take —
            free, on the first call.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3"
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MagneticButton strength={0.2}>
              <Button asChild size="lg" className="glow">
                <Link href="/contact">
                  Book a free consultation
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <Button asChild size="lg" variant="outline-ink">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                  <Phone aria-hidden />
                  Call {site.phone}
                </a>
              </Button>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
