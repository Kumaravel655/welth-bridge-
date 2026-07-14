"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { CalculatorShell } from "@/components/tools/calculator-shell";
import { Input } from "@/components/ui/input";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import {
  computeNewRegime,
  computeOldRegime,
  type AgeBand,
} from "@/lib/calculators/income-tax";
import { cn, formatINR } from "@/lib/utils";

export function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = React.useState(1_200_000);
  const [ageBand, setAgeBand] = React.useState<AgeBand>("below-60");
  const [otherDeductions, setOtherDeductions] = React.useState(150_000);

  const newRegime = computeNewRegime(grossIncome);
  const oldRegime = computeOldRegime(grossIncome, ageBand, otherDeductions);

  const newIsBetter = newRegime.totalTax <= oldRegime.totalTax;
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return (
    <CalculatorShell
      eyebrow="Calculator"
      title="Income Tax Calculator"
      description="Compare your tax liability under the old and new regimes for FY 2025-26 (AY 2026-27) and see which one works out cheaper."
      disclaimer="Simplified estimate: assumes a single combined deductions figure for the old regime (80C, 80D, HRA, home loan interest, etc.) and doesn't model marginal relief right at the ₹12L/87A threshold or surcharge marginal relief. For an exact figure, use our income tax filing service."
      inputs={
        <div className="space-y-7">
          <div className="space-y-2">
            <Label.Root htmlFor="gross-income" className="text-sm font-medium">
              Gross annual income
            </Label.Root>
            <Input
              id="gross-income"
              type="number"
              min={0}
              value={grossIncome}
              onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">Age</Label.Root>
            <SegmentedToggle
              options={[
                { value: "below-60", label: "Below 60" },
                { value: "60-to-80", label: "60–80" },
                { value: "above-80", label: "Above 80" },
              ]}
              value={ageBand}
              onChange={setAgeBand}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label.Root htmlFor="deductions" className="text-sm font-medium">
              Other deductions (80C, 80D, HRA, home loan interest, etc.)
            </Label.Root>
            <Input
              id="deductions"
              type="number"
              min={0}
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value)))}
            />
            <p className="text-xs text-muted-foreground">
              Only counted under the old regime — the new regime doesn&apos;t
              allow most of these deductions.
            </p>
          </div>
        </div>
      }
      results={
        <div>
          <div
            className={cn(
              "rounded-xl border p-4",
              "border-accent/40 bg-accent/10"
            )}
          >
            <p className="text-sm font-medium text-accent-strong">
              The {newIsBetter ? "new" : "old"} regime saves you{" "}
              {formatINR(Math.round(savings))} this year.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <RegimeColumn
              label="New regime"
              highlight={newIsBetter}
              taxableIncome={newRegime.taxableIncome}
              totalTax={newRegime.totalTax}
              takeHome={newRegime.takeHome}
            />
            <RegimeColumn
              label="Old regime"
              highlight={!newIsBetter}
              taxableIncome={oldRegime.taxableIncome}
              totalTax={oldRegime.totalTax}
              takeHome={oldRegime.takeHome}
            />
          </div>
        </div>
      }
      after={
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <a
            href="/services/income-tax-filing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:underline"
          >
            Get help filing under whichever regime suits you
            <ArrowRight className="size-3.5" aria-hidden />
          </a>
        </section>
      }
    />
  );
}

function RegimeColumn({
  label,
  highlight,
  taxableIncome,
  totalTax,
  takeHome,
}: {
  label: string;
  highlight: boolean;
  taxableIncome: number;
  totalTax: number;
  takeHome: number;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        highlight ? "border-accent bg-accent/5" : "border-border"
      )}
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl tabular-nums text-accent-strong">
        {formatINR(Math.round(totalTax))}
      </p>
      <p className="text-xs text-muted-foreground">tax payable</p>
      <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
        <p>Taxable income: {formatINR(Math.round(taxableIncome))}</p>
        <p>Take-home: {formatINR(Math.round(takeHome))}</p>
      </div>
    </div>
  );
}
