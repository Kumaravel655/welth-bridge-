"use client";

import { ArrowRight, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { site } from "@/lib/site";

import { SectionHeading } from "./section-heading";

export function CTA() {
  const reduce = useReducedMotion();

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl text-ink-foreground bg-indigo-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/cta-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Gradient overlay fades from solid to transparent to keep the image bright and crisp without fog */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 from-40% to-transparent z-0" />

        {/* Decorative circles (z-index adjusted to sit above the overlay) */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 z-10"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 size-72 translate-y-1/2 rounded-full bg-white/[0.07] z-10"
          initial={reduce ? {} : { scale: 0.6, opacity: 0 }}
          whileInView={reduce ? {} : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
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
                <Link
                  href="/portal/consultations"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-bold text-accent-strong shadow-xl transition-all hover:bg-white/90 active:scale-[0.98]"
                >
                  Book a free consultation
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-8 text-base font-bold text-white transition-colors hover:bg-white/10"
                >
                  <Phone className="size-4" aria-hidden />
                  Call {site.phone}
                </a>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
