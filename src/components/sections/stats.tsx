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
      className="border-b border-border"
    >
      <RevealGroup className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <Reveal key={s.label} className="text-center lg:text-left">
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
