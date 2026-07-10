import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { ServiceCard } from "@/components/service/service-card";
import { Button } from "@/components/ui/button";
import { featuredServices, services } from "@/lib/services";

import { SectionHeading } from "./section-heading";

export function ServicesShowcase() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      {/* Subtle dot grid pattern background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Every filing between you and{" "}
              <em className="text-gradient">running a company.</em>
            </>
          }
          lede={`${services.length}+ services across registration, tax, IP, funding and legal — each handled start to finish by the right professional.`}
        />
        <Reveal delay={0.1} variant="fade-right">
          <Button asChild variant="outline">
            <Link href="/services">
              All services
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>

      <RevealGroup className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredServices.map((s, i) => (
          <Reveal
            key={s.slug}
            className="h-full"
            variant={i % 3 === 0 ? "fade-left" : i % 3 === 1 ? "fade-up" : "fade-right"}
          >
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
