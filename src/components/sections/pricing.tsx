"use client";

import { ArrowRight, Check } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

type Plan = {
  name: string;
  href: string;
  price: number;
  fromPrice?: boolean;
  note: string;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "GST Registration",
    href: "/services/gst-registration",
    price: 1499,
    note: "5–7 working days",
    features: [
      "Application filed by GST experts",
      "Instant ARN on submission",
      "Follow-up until GSTIN is granted",
      "Input tax credit guidance",
    ],
  },
  {
    name: "GST Return Filing",
    href: "/services/gst-return-filing",
    price: 599,
    fromPrice: true,
    note: "Per month",
    features: [
      "Monthly GSTR-1 & GSTR-3B",
      "Reconciliation with purchases",
      "Late-fee & notice protection",
      "Filed before every due date",
    ],
  },
  {
    name: "Income Tax Filing",
    href: "/services/income-tax-filing",
    price: 999,
    fromPrice: true,
    note: "1–3 working days",
    features: [
      "ITR prepared by experts",
      "Maximum legal deductions",
      "Capital-gains & multiple incomes",
      "e-Verification support",
    ],
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
    popular: true,
  },
  {
    name: "LLP Registration",
    href: "/services/llp-registration",
    price: 5999,
    fromPrice: true,
    note: "12–18 working days",
    features: [
      "LLP name approval",
      "DSC & DPIN for partners",
      "LLP agreement drafted",
      "PAN, TAN & incorporation",
    ],
  },
  {
    name: "Private Limited Company",
    href: "/services/private-limited-company",
    price: 12999,
    note: "10–15 working days",
    features: [
      "Complete incorporation package",
      "DSC for 2 directors",
      "MOA and AOA drafted",
      "Startup India recognition guidance",
    ],
  },
  {
    name: "Trademark Registration",
    href: "/services/trademark-registration",
    price: 6999,
    fromPrice: true,
    note: "Brand ownership secured",
    features: [
      "Trademark search included",
      "Class advice & filing",
      "TM application by experts",
      "Objection-reply support",
    ],
  },
];

// Card 300px + gap-5 (20px) = one step of 320px.
const CARD_WIDTH = 300;
const STEP = CARD_WIDTH + 20;
const HOLD_MS = 2200; // zoom in on a card and pause
const GLIDE_MS = 650; // slide the next card into focus
// The zoomed card sits one slot in from the left fade.
const FOCUS_OFFSET = 1;

export function Pricing() {
  const reduce = useReducedMotion();
  const n = plans.length;
  const [index, setIndex] = React.useState(0);
  const [glide, setGlide] = React.useState(true);
  const paused = React.useRef(false);

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => i + 1);
    }, HOLD_MS + GLIDE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // Seamless loop — snap back to the start once a full set has scrolled by.
  React.useEffect(() => {
    if (index < n) return;
    const t = setTimeout(() => {
      setGlide(false);
      setIndex(0);
    }, GLIDE_MS);
    return () => clearTimeout(t);
  }, [index, n]);

  React.useEffect(() => {
    if (glide) return;
    const r = requestAnimationFrame(() => setGlide(true));
    return () => cancelAnimationFrame(r);
  }, [glide]);

  const activeRendered = index + FOCUS_OFFSET;

  return (
    <section 
      className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950"
      style={{
        backgroundImage: 'url(/images/backgrounds/pricing-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Gradient overlay fades from solid to transparent to keep the image bright and crisp without fog */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-50 from-30% via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/60 dark:to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="right"
          eyebrow="Transparent pricing"
          title={
            <>
              The price you see is the price{" "}
              <em className="font-semibold not-italic text-accent-strong">
                you pay.
              </em>
            </>
          }
          lede="Professional fees stated upfront. Government fees and taxes are billed at actuals — no surprises at the end."
        />
      </div>

      <div
        className="relative mt-14"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {reduce ? (
          <div className="flex gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
            {plans.map((p) => (
              <PriceCard key={p.name} plan={p} active={!!p.popular} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div
              className="flex w-max gap-5"
              style={{
                transform: `translateX(-${index * STEP}px)`,
                transition: glide ? `transform ${GLIDE_MS}ms ease` : "none",
              }}
            >
              {[...plans, ...plans].map((p, i) => (
                <PriceCard
                  key={`${p.name}-${i}`}
                  plan={p}
                  active={i === activeRendered}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fade mask for the right side (solid color), no mask on left to let cards glide over the image */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent sm:w-28" />
      </div>
    </section>
  );
}

function PriceCard({ plan, active }: { plan: Plan; active: boolean }) {
  return (
    <Reveal className="relative w-[300px] shrink-0" variant="blur-in">
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
          <Badge variant="accent" className="bg-background">
            Most popular
          </Badge>
        </div>
      )}
      <div
        className={[
          "flex h-full flex-col rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 transition-all duration-500 ease-out",
          active
            ? "z-10 scale-[1.07] border-2 border-accent shadow-2xl shadow-accent/25"
            : "scale-100 border border-border shadow-sm",
        ].join(" ")}
      >
        <h3 className="font-display text-lg font-bold tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-3 flex items-baseline gap-1.5">
          {plan.fromPrice && (
            <span className="text-sm text-muted-foreground">from</span>
          )}
          <span className="font-display text-3xl font-extrabold tracking-tight">
            {formatINR(plan.price)}
          </span>
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {plan.note}
        </p>
        <ul className="mt-5 flex-1 space-y-2.5">
          {plan.features.map((f) => (
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
          variant={active ? "default" : "outline"}
          className={`mt-6 w-full ${active ? "glow" : ""}`}
        >
          <Link href={plan.href}>
            Get started
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </Reveal>
  );
}
