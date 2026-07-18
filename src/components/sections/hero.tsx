"use client";

import { ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Counter } from "@/components/motion/counter";
import { FadeIn } from "@/components/motion/fade-in";

const heroStats: {
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
}[] = [
  { value: 500, suffix: "+", label: "Businesses Managed" },
  { value: 3, suffix: "", label: "Office Locations" },
  { text: "GST & ROC", label: "Expert Support" },
];

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
      <section className="relative -mt-[4.75rem] flex min-h-[92vh] w-full items-center overflow-hidden bg-ink pb-16 pt-36 text-ink-foreground">
        {/* Full-bleed office photography background */}
        <div aria-hidden className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src="/Transform_this_still_image_int.mp4" type="video/mp4" />
          </video>
          {/* Directional scrim: darker on the left so the copy stays readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(2, 8, 30, 0.78) 0%, rgba(2, 8, 30, 0.55) 45%, rgba(2, 8, 30, 0.35) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgba(2,8,30,0.7)] to-transparent" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:px-8">
          <div>
            <FadeIn delay={0} duration={800}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                <BadgeCheck className="size-4" aria-hidden />
                Trusted since 2007
              </span>
            </FadeIn>

            <FadeIn delay={150} duration={900}>
              <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Elite business{" "}
                <span className="text-accent-on-ink">compliance</span> for
                modern founders.
              </h1>
            </FadeIn>

            <FadeIn delay={500} duration={1000}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                Focus on growing your vision while we handle the complexities
                of GST, ROC, and legal filings. Accurate, on-time, and
                human-led finance for the next generation of Indian startups.
              </p>
            </FadeIn>

            <FadeIn delay={800} duration={1000}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/portal/consultations"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-lg font-bold text-accent-foreground shadow-xl shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Book Free Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  Explore Services
                  <ArrowRight className="size-5" aria-hidden />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={1100} duration={1000}>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-8 text-white">
                {heroStats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-bold sm:text-3xl">
                      {s.text ?? (
                        <Counter to={s.value ?? 0} suffix={s.suffix ?? ""} />
                      )}
                    </p>
                    <p className="mt-1 text-sm text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="relative border-b border-border bg-background py-10">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by founders across Tamil Nadu
        </p>
        <div className="mx-auto mt-6 max-w-7xl overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...trustBadges, ...trustBadges].map((badge, i) => (
              <span
                key={`${badge}-${i}`}
                className="mx-6 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground"
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
