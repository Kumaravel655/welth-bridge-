import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CTA() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            Ready when you are
          </p>
          <h2 className="mt-4 font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl">
            Your company is <em className="text-[var(--accent)]">one call</em>{" "}
            away.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Tell us what you're building. We'll tell you exactly which
            registrations you need, what they cost, and how long they take —
            free, on the first call.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                Book a free consultation
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-ink">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                <Phone aria-hidden />
                Call {site.phone}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
