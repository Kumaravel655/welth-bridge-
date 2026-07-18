"use client";

import { CheckCircle2, Handshake, Repeat, Sparkles } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

const promises = [
  "Transparent, fixed professional fees",
  "One dedicated point of contact",
  "Secure client portal for every document",
];

const cards = [
  {
    icon: Handshake,
    title: "Trust",
    body: "We do what we say, every time. Your filings go out when we said they would, and you hear from us before you have to ask.",
    colorTheme: "text-blue-600",
    bgTheme: "bg-blue-100",
    borderTheme: "group-hover:border-blue-200",
  },
  {
    icon: Repeat,
    title: "Consistency",
    body: "Nothing erodes trust faster than inconsistency. The same standard applies to your first filing and your fiftieth.",
    colorTheme: "text-purple-600",
    bgTheme: "bg-purple-100",
    borderTheme: "group-hover:border-purple-200",
  },
  {
    icon: Sparkles,
    title: "Convenience",
    body: "One checklist, one point of contact, zero government-office queues. Compliance should be the easiest part of your week.",
    colorTheme: "text-emerald-600",
    bgTheme: "bg-emerald-100",
    borderTheme: "group-hover:border-emerald-200",
  },
];

export function Values() {
  return (
    <section 
      className="relative overflow-hidden py-24 sm:py-32 bg-indigo-950"
      style={{
        backgroundImage: 'url(/images/backgrounds/values-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Gradient overlay fades from solid to transparent to keep the image bright and crisp without fog */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 from-30% via-indigo-950/60 to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header Section */}
        <Reveal variant="fade-up">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-indigo-300 mb-4">
              How we work
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              What makes a consultant worth keeping.
            </h2>
            <p className="text-xl leading-relaxed text-indigo-100/80">
              Eighteen years in, most of our work comes from clients who stayed — and the people they sent our way.
            </p>
          </div>
        </Reveal>

        {/* 3-Column SaaS Cards */}
        <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} variant="fade-up" delay={i * 0.15}>
                <div 
                  className={`group h-full flex flex-col rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-10 border border-transparent shadow-sm hover:shadow-xl transition-all duration-300 ${card.borderTheme}`}
                >
                  <div className={`mb-8 flex size-16 items-center justify-center rounded-2xl ${card.bgTheme} transition-transform duration-300 group-hover:-translate-y-1`}>
                    <Icon className={`size-8 ${card.colorTheme}`} aria-hidden />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                    {card.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </RevealGroup>

        {/* Bottom Promises Banner */}
        <Reveal variant="fade-up" delay={0.3}>
          <div className="mx-auto max-w-5xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <ul className="flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-12">
              {promises.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle2 className="size-5 text-accent-strong" aria-hidden />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-foreground/90">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
