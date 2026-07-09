import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { ServiceCard } from "@/components/service/service-card";
import { Button } from "@/components/ui/button";
import { featuredServices, services } from "@/lib/services";

import { SectionHeading } from "./section-heading";

export function ServicesShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Every filing between you and{" "}
              <em className="text-accent-strong">running a company.</em>
            </>
          }
          lede={`${services.length}+ services across registration, tax, IP, funding and legal — each handled start to finish by the right professional.`}
        />
        <Reveal delay={0.1}>
          <Button asChild variant="outline">
            <Link href="/services">
              All services
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredServices.map((s) => (
          <Reveal key={s.slug} className="h-full">
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
