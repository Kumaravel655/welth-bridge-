"use client";

import { ArrowUpRight, Star } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

import { SectionHeading } from "./section-heading";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=The+Wealth+Bridge+Vellore";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Founder, TechNova Solutions",
    text: "The Wealth Bridge made our Pvt Ltd incorporation seamless. From name approval to getting our incorporation certificate, everything was handled professionally. Highly recommended for startups.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Director, GreenLeaf Exports",
    text: "Their IEC and APEDA registration service was outstanding. We were exporting within 3 weeks of our first call. The team's knowledge of trade compliance is exceptional.",
    rating: 5,
  },
  {
    name: "Suresh Babu",
    role: "Managing Partner, SB Associates",
    text: "We've trusted The Wealth Bridge with our GST filings and annual compliance for 6 years now. Zero penalties, zero missed deadlines. That says it all.",
    rating: 5,
  },
  {
    name: "Anitha Krishnan",
    role: "CEO, Bloom Healthcare",
    text: "Getting our trademark registered was painless. They handled the objection response so well that we got our TM within the first attempt. True experts.",
    rating: 5,
  },
  {
    name: "Mohan Raj",
    role: "Proprietor, Raj Textiles",
    text: "Converting my proprietorship to a Pvt Ltd was something I'd been putting off for years. The Wealth Bridge did it in under 3 weeks with zero hassle.",
    rating: 5,
  },
  {
    name: "Deepa Venkatesh",
    role: "Co-founder, EduSpark",
    text: "Their startup funding guidance helped us prepare a pitch deck that actually got us seed funding. More than consultants — they're partners in growth.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Client stories"
          title={
            <>
              Trusted by founders across{" "}
              <em className="text-gradient">Tamil Nadu.</em>
            </>
          }
          lede="Every review is from a real business that crossed the bridge with us."
        />
      </div>

      {/* Scrolling testimonial rows */}
      <div className="mt-12 space-y-5">
        {/* Row 1 — scrolls left */}
        <div className="relative">
          <div className="flex animate-marquee gap-5 whitespace-nowrap">
            {[...testimonials.slice(0, 3), ...testimonials.slice(0, 3)].map(
              (t, i) => (
                <TestimonialCard key={`r1-${i}`} testimonial={t} />
              )
            )}
          </div>
          {/* Fade edges */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Row 2 — scrolls right (reverse) */}
        <div className="relative">
          <div
            className="flex gap-5 whitespace-nowrap"
            style={{
              animation: "marquee 44s linear infinite reverse",
            }}
          >
            {[...testimonials.slice(3), ...testimonials.slice(3)].map(
              (t, i) => (
                <TestimonialCard key={`r2-${i}`} testimonial={t} />
              )
            )}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      {/* Google reviews link-out */}
      <Reveal className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-0.5 sm:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" aria-hidden />
              ))}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              See what more clients are saying on Google Reviews.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              Read our Google reviews
              <ArrowUpRight aria-hidden />
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <div className="inline-flex w-[380px] shrink-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-md">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="size-4 fill-accent text-accent"
            aria-hidden
          />
        ))}
      </div>

      {/* Quote */}
      <p className="mt-4 whitespace-normal text-sm leading-relaxed text-muted-foreground">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        {/* Avatar placeholder — initials */}
        <div className="flex size-9 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent-strong">
          {testimonial.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
