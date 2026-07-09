import { Reveal, RevealGroup } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

const steps = [
  {
    title: "Consult",
    body: "A free call with an expert who confirms exactly which registrations and filings your business needs — and which it doesn't.",
  },
  {
    title: "Documents",
    body: "You get one simple checklist. Send everything over WhatsApp or email; we verify each document before anything is filed.",
  },
  {
    title: "Filing",
    body: "We prepare and submit the application, then chase the department so you never have to visit a government office.",
  },
  {
    title: "Registered",
    body: "Certificate in hand, with clear guidance on the compliance calendar that starts the day your business does.",
  },
];

export function Process() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Crossing the bridge"
        title={
          <>
            Four steps. <em className="text-accent-strong">One crossing.</em>
          </>
        }
        lede="The same path, whether it's a GST number or a private limited company — you stay on your business, we handle the paperwork."
      />

      <RevealGroup className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} className="relative">
            {/* Connector line to the next step */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-12 top-5 hidden h-px w-[calc(100%-2rem)] bg-border lg:block"
              />
            )}
            <span className="relative inline-flex size-10 items-center justify-center rounded-full border border-accent/50 bg-accent/10 font-mono text-sm font-semibold text-accent-strong">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-lg tracking-tight">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
