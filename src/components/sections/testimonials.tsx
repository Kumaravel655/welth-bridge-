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
    initials: "RK",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    name: "Suresh Babu",
    role: "Managing Partner, SB Associates",
    text: "We've trusted The Wealth Bridge with our GST filings and annual compliance for six years. Zero penalties, zero missed deadlines. That says it all.",
    initials: "SB",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Deepa Venkatesh",
    role: "Co-founder, EduSpark",
    text: "Their funding guidance helped us prepare a pitch that actually landed our seed round. More than consultants — they're partners in growth.",
    initials: "DV",
    gradient: "from-emerald-400 to-teal-500"
  },
];

export function Testimonials() {
  return (
    <section 
      className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950"
      style={{
        backgroundImage: 'url(/images/backgrounds/client-review-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Gradient overlay fades from solid to transparent to keep the image bright and crisp without fog */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 from-30% via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/60 dark:to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <RevealGroup className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Reveal key={t.name} className="h-full" variant="fade-up">
              <figure className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                
                {/* Decorative large background quote */}
                <Quote
                  className="absolute right-6 top-6 size-24 text-slate-100 dark:text-slate-800 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  aria-hidden
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex gap-1 mb-6" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-5 fill-amber-400 text-amber-400 drop-shadow-sm" aria-hidden />
                    ))}
                  </div>
                  
                  <blockquote className="flex-1 text-lg leading-relaxed text-foreground/80 font-medium">
                    "{t.text}"
                  </blockquote>
                  
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <span className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} font-display text-sm font-bold text-white shadow-inner`}>
                      {t.initials}
                    </span>
                    <div>
                      <span className="block text-base font-bold text-foreground">{t.name}</span>
                      <span className="block text-sm font-medium text-muted-foreground">
                        {t.role}
                      </span>
                    </div>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-8 shadow-sm text-center sm:flex-row sm:justify-between sm:text-left transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center justify-center gap-1 sm:justify-start mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <p className="text-base font-medium text-muted-foreground">
                See what more clients are saying on Google.
              </p>
            </div>
            <Button asChild className="rounded-full px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Read Reviews
                <ArrowUpRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
