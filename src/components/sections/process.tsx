"use client";

import { CheckCircle2, FileEdit, MessageCircle, UploadCloud } from "lucide-react";
import Image from "next/image";

import { Reveal, RevealGroup } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

const steps = [
  {
    title: "Consult",
    icon: MessageCircle,
    body: "Book a free slot online — phone, video or in-office — and an expert confirms exactly which registrations your business needs, what the fees are, and which you can skip.",
  },
  {
    title: "Documents",
    icon: UploadCloud,
    body: "You get one simple checklist. Send everything over WhatsApp or email; we verify each document before anything is filed.",
  },
  {
    title: "Filing",
    icon: FileEdit,
    body: "We prepare and submit the application, then chase the department so you never have to visit a government office.",
  },
  {
    title: "Registered",
    icon: CheckCircle2,
    body: "Certificate in hand, with clear guidance on the compliance calendar that starts the day your business does.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-muted text-foreground">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/hero/skyline-chart.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        align="center"
        eyebrow="Crossing the bridge"
        title={
          <>
            Four steps. <em className="text-accent-strong font-semibold not-italic">One crossing.</em>
          </>
        }
        lede="The same path, whether it's a GST number or a private limited company — you stay on your business, we handle the paperwork."
      />

      <RevealGroup className="relative mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Connecting line (desktop) */}
        <div aria-hidden className="absolute left-0 top-12 hidden w-full border-t-2 border-dashed border-accent/25 lg:block" />

        {steps.map((s, i) => (
          <Reveal key={s.title} className="relative text-center" variant="fade-up" delay={i * 0.1}>
            <div className="group relative z-10 mx-auto flex size-24 items-center justify-center rounded-full border-2 border-accent bg-background transition-colors duration-300 hover:bg-accent">
              <s.icon
                className="size-9 text-accent-strong transition-colors duration-300 group-hover:text-accent-foreground"
                aria-hidden
              />
            </div>

            <h3 className="mt-5 font-display text-lg tracking-tight">
              {i + 1}. {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
      </div>
    </section>
  );
}
