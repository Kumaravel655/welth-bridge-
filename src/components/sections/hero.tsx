"use client";

import { ArrowRight, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Bridge } from "@/components/motion/bridge";
import { GradientMesh } from "@/components/motion/gradient-mesh";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { ParallaxFloat } from "@/components/motion/parallax-float";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const trustBadges = [
  "18+ Years in Practice",
  "65+ Services Under One Roof",
  "3 Offices in Tamil Nadu",
  "Chartered Accountants",
  "Company Secretaries",
  "Corporate Lawyers",
  "Startup India Recognized",
  "ISO 9001 Certified",
];

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            delay,
            duration: 0.65,
            ease: [0.21, 0.47, 0.32, 0.98] as const,
          },
        };

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {/* Animated gradient mesh background */}
      <GradientMesh />

      {/* Parallax floating shapes */}
      <ParallaxFloat />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="max-w-3xl">
          <motion.p
            {...rise(0)}
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]"
          >
            Business setup &amp; compliance · Since 2007
          </motion.p>

          <TextReveal
            as="h1"
            delay={0.15}
            className="mt-5 font-display text-[2.75rem] leading-[1.06] tracking-tight sm:text-6xl md:text-7xl"
          >
            From idea to incorporated.
          </TextReveal>

          <motion.p
            {...rise(0.4)}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            Company registration, GST, trademarks, funding and every filing in
            between — handled end to end by chartered accountants, company
            secretaries and corporate lawyers.
          </motion.p>

          <motion.div {...rise(0.55)} className="mt-9 flex flex-wrap gap-3">
            <MagneticButton strength={0.2}>
              <Button asChild size="lg" className="glow">
                <Link href="/contact">
                  Start your company
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <Button asChild size="lg" variant="outline-ink">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                  <Phone aria-hidden />
                  {site.phone}
                </a>
              </Button>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Signature: the bridge every business crosses */}
        <Bridge className="mt-14 text-ink-foreground sm:mt-16" />
      </div>

      {/* Trust badge marquee */}
      <div className="relative border-t border-ink-border/40">
        <div className="mx-auto max-w-7xl overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-3.5">
            {[...trustBadges, ...trustBadges].map((badge, i) => (
              <span
                key={`${badge}-${i}`}
                className="mx-6 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted"
              >
                <span className="size-1.5 rounded-full bg-accent/60" aria-hidden />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
