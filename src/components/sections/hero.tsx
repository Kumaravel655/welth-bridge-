"use client";

import Link from "next/link";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { HeroVideo } from "@/components/motion/hero-video";

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
  return (
    <>
      <section className="relative h-[calc(100vh-4rem)] min-h-[560px] w-full overflow-hidden bg-ink text-ink-foreground">
        {/* Full-bleed background video */}
        <HeroVideo className="absolute inset-0 size-full" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-12 md:px-12 lg:grid lg:grid-cols-2 lg:items-end lg:px-16 lg:pb-16">
          <div>
            <AnimatedHeading
              text={"Shaping tomorrow\nwith vision and action."}
              initialDelay={200}
              className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            />

            <FadeIn delay={800} duration={1000}>
              <p className="mb-5 max-w-xl text-base text-ink-muted md:text-lg">
                We handle every registration, filing and compliance need — so
                your business can define what comes next. Start by booking a
                free slot: consultations and fee enquiries cost nothing.
              </p>
            </FadeIn>

            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/portal/consultations"
                  className="rounded-full bg-ink-foreground px-8 py-3 font-medium text-ink transition-colors hover:brightness-95"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/services"
                  className="liquid-glass rounded-full border border-ink-foreground/20 px-8 py-3 font-medium text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
                >
                  Explore Now
                </Link>
              </div>
            </FadeIn>
          </div>

          <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass rounded-xl border border-ink-foreground/20 px-6 py-3">
                <span className="text-lg font-light md:text-xl lg:text-2xl">
                  Registration. Compliance. Advisory.
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Trust badge marquee */}
      <div className="relative border-t border-ink-border/40 bg-ink">
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
    </>
  );
}
