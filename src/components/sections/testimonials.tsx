import { ArrowUpRight, Quote, Star } from "lucide-react";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

import { SectionHeading } from "./section-heading";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=The+Wealth+Bridge+Vellore";

// Three of the strongest, most specific reviews — a still proof wall reads as
// more trustworthy than a ticker, and each quote earns its space.
const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Founder, TechNova Solutions",
    text: "They made our Pvt Ltd incorporation seamless. From name approval to the certificate, everything was handled professionally — I never chased a single form.",
  },
  {
    name: "Suresh Babu",
    role: "Managing Partner, SB Associates",
    text: "We've trusted The Wealth Bridge with our GST filings and annual compliance for six years. Zero penalties, zero missed deadlines. That says it all.",
  },
  {
    name: "Deepa Venkatesh",
    role: "Co-founder, EduSpark",
    text: "Their funding guidance helped us prepare a pitch that actually landed our seed round. More than consultants — they're partners in growth.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Client stories"
          title={
            <>
              Trusted by founders across{" "}
              <em className="font-semibold not-italic text-accent-strong">
                Tamil Nadu.
              </em>
            </>
          }
          lede="Every review is from a real business that crossed the bridge with us."
        />

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Reveal key={t.name} className="h-full" variant="fade-up">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/[0.06]">
                <Quote
                  className="size-8 shrink-0 text-accent/25"
                  aria-hidden
                />
                <div className="mt-4 flex gap-0.5" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                  {t.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent-strong">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mt-8">
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
      </div>
    </section>
  );
}
