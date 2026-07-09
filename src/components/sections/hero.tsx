"use client";

import { ArrowRight, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Bridge } from "@/components/motion/bridge";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

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
      {/* Faint radial glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="max-w-3xl">
          <motion.p
            {...rise(0)}
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]"
          >
            Business setup &amp; compliance · Since 2007
          </motion.p>

          <motion.h1
            {...rise(0.1)}
            className="mt-5 font-display text-[2.75rem] leading-[1.06] tracking-tight sm:text-6xl md:text-7xl"
          >
            From idea to{" "}
            <em className="text-[var(--accent)]">incorporated.</em>
          </motion.h1>

          <motion.p
            {...rise(0.22)}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            Company registration, GST, trademarks, funding and every filing in
            between — handled end to end by chartered accountants, company
            secretaries and corporate lawyers.
          </motion.p>

          <motion.div {...rise(0.34)} className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                Start your company
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-ink">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                <Phone aria-hidden />
                {site.phone}
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Signature: the bridge every business crosses */}
        <Bridge className="mt-14 text-ink-foreground sm:mt-16" />
      </div>
    </section>
  );
}
