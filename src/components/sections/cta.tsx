"use client";

import { ArrowRight, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { GradientMesh } from "@/components/motion/gradient-mesh";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

import { SectionHeading } from "./section-heading";

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
            "radial-gradient(circle, oklch(0.55 0.15 256 / 0.08) 0%, transparent 60%)",
        }}
        initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
        whileInView={reduce ? {} : { scale: [0.8, 1.2, 1], opacity: [0, 0.6, 0.4] }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Ready when you are"
            title="Your company is one booking away."
            lede="Pick a slot that suits you — phone, video, or a visit to our Vellore, Arakkonam or Ranipet office — and ask anything: which registrations you need, what the fees are, how long it takes. The first consultation is free."
            align="center"
            onInk
          />

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3"
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MagneticButton strength={0.2}>
              <Button asChild size="lg" className="glow">
                <Link href="/portal/consultations">
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
