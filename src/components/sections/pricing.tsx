"use client";

import { ArrowRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Counter } from "@/components/motion/counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

const plans = [
  {
    name: "GST Registration",
    href: "/services/gst-registration",
    price: 1499,
    fromPrice: false,
    note: "5–7 working days",
    features: [
      "Application filed by GST experts",
      "Instant ARN on submission",
      "Follow-up until GSTIN is granted",
      "Input tax credit guidance",
    ],
    featured: false,
  },
  {
    name: "Company Registration",
    href: "/services/private-limited-company",
    price: 6999,
    fromPrice: true,
    note: "OPC, LLP & more",
    features: [
      "Name reservation included",
      "DSC and DIN for directors",
      "Certificate of incorporation",
      "PAN, TAN and bank-account support",
    ],
    featured: true,
  },
  {
    name: "Private Limited Company",
    href: "/services/private-limited-company",
    price: 12999,
    fromPrice: false,
    note: "10–15 working days",
    features: [
      "Complete incorporation package",
      "DSC for 2 directors",
      "MOA and AOA drafted",
      "Startup India recognition guidance",
    ],
    featured: false,
  },
];

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        align="center"
        eyebrow="Transparent pricing"
        title={
          <>
            The price you see is the price{" "}
            <em className="text-gradient">you pay.</em>
          </>
        }
        lede="Professional fees stated upfront. Government fees and taxes are billed at actuals — no surprises at the end."
      />

      <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <Reveal key={p.name} className="relative h-full" variant="blur-in">
            {p.featured && (
              <motion.div
                className="absolute -top-3 left-6 z-10"
                initial={reduce ? {} : { scale: 0.5, opacity: 0, y: -10 }}
                whileInView={reduce ? {} : { scale: 1, opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              >
                <Badge
                  variant="accent"
                  className="bg-background"
                >
                  Most popular
                </Badge>
              </motion.div>
            )}
            <div
              className={
                p.featured
                  ? "shimmer-overlay relative flex h-full flex-col rounded-2xl border-2 border-accent bg-card p-7 shadow-lg shadow-accent/10"
                  : "relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:border-accent/40 hover:shadow-md"
              }
            >
              <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
              <p className="mt-4 flex items-baseline gap-1.5">
                {p.fromPrice && (
                  <span className="text-sm text-muted-foreground">from</span>
                )}
                <span className="font-display text-4xl tracking-tight">
                  {formatINR(p.price)}
                </span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {p.note}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-accent-strong"
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "default" : "outline"}
                className={`mt-7 w-full ${p.featured ? "glow" : ""}`}
              >
                <Link href={p.href}>
                  Get started
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
