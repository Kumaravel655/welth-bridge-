import { Counter } from "@/components/motion/counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

const stats = [
  { value: 18, suffix: "+", label: "Years in practice" },
  { value: 65, suffix: "+", label: "Services under one roof" },
  { value: 3, suffix: "", label: "Offices in Tamil Nadu" },
  { value: 4, suffix: "", label: "Professions on your file" },
];

export function Stats() {
  return (
    <section
      aria-label="The Wealth Bridge at a glance"
      className="relative border-b border-border bg-gradient-to-r from-muted/60 via-background to-muted/60"
    >
      {/* Subtle dot grid overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

      <RevealGroup className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} variant={i % 2 === 0 ? "fade-up" : "scale-in"} className="group text-center lg:text-left">
            {/* Animated accent line */}
            <div className="mx-auto mb-4 h-px w-10 bg-gradient-to-r from-transparent via-accent/60 to-transparent transition-all duration-500 group-hover:w-16 lg:mx-0" aria-hidden />
            <p className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
