"use client";

import * as Label from "@radix-ui/react-label";
import * as React from "react";

import { Counter } from "@/components/motion/counter";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { ResultCard } from "@/components/tools/result-card";
import { Input } from "@/components/ui/input";
import { calculateEMI } from "@/lib/calculators/emi";
import { formatINR } from "@/lib/utils";

function sliderFill(value: number, min: number, max: number) {
  const percent = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, var(--accent) ${percent}%, var(--border) ${percent}%)`,
  };
}

export function EmiCalculator() {
  const [principal, setPrincipal] = React.useState(1_000_000);
  const [rate, setRate] = React.useState(10.5);
  const [tenureYears, setTenureYears] = React.useState(5);

  const { emi, totalInterest, totalPayment } = calculateEMI({
    principal,
    annualRatePercent: rate,
    tenureMonths: tenureYears * 12,
  });

  const principalShare = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;

  return (
    <CalculatorShell
      eyebrow="Calculator"
      title="EMI Calculator"
      description="Work out your monthly instalment, total interest and total payment on any loan."
      disclaimer="This is an indicative estimate for planning purposes. Your lender's actual EMI may vary slightly based on processing fees, disbursement date and compounding method."
      inputs={
        <div className="space-y-7">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label.Root htmlFor="principal" className="text-sm font-medium">
                Loan amount
              </Label.Root>
              <span className="font-mono text-sm text-accent-strong">
                {formatINR(principal)}
              </span>
            </div>
            <input
              id="principal"
              type="range"
              min={50_000}
              max={20_000_000}
              step={10_000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="accent-range w-full"
              style={sliderFill(principal, 50_000, 20_000_000)}
            />
            <Input
              type="number"
              aria-label="Loan amount"
              value={principal}
              min={1}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label.Root htmlFor="rate" className="text-sm font-medium">
                Interest rate (% per annum)
              </Label.Root>
              <span className="font-mono text-sm text-accent-strong">{rate}%</span>
            </div>
            <input
              id="rate"
              type="range"
              min={1}
              max={24}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="accent-range w-full"
              style={sliderFill(rate, 1, 24)}
            />
            <Input
              type="number"
              aria-label="Interest rate percent per annum"
              step="0.1"
              value={rate}
              min={0}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label.Root htmlFor="tenure" className="text-sm font-medium">
                Loan tenure (years)
              </Label.Root>
              <span className="font-mono text-sm text-accent-strong">{tenureYears} yrs</span>
            </div>
            <input
              id="tenure"
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="accent-range w-full"
              style={sliderFill(tenureYears, 1, 30)}
            />
            <Input
              type="number"
              aria-label="Loan tenure in years"
              value={tenureYears}
              min={1}
              max={30}
              onChange={(e) =>
                setTenureYears(Math.min(30, Math.max(1, Number(e.target.value))))
              }
            />
          </div>
        </div>
      }
      results={
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            Your monthly EMI
          </p>
          <p className="mt-1 font-display text-4xl tabular-nums text-accent-strong">
            ₹<Counter to={Math.round(emi)} />
          </p>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${principalShare}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {principalShare.toFixed(0)}% principal · {(100 - principalShare).toFixed(0)}%
            interest
          </p>

          <div className="mt-5 space-y-0">
            <ResultCard label="Principal amount" value={principal} prefix="₹" />
            <ResultCard label="Total interest" value={totalInterest} prefix="₹" />
            <ResultCard label="Total payment" value={totalPayment} prefix="₹" emphasis />
          </div>
        </div>
      }
    />
  );
}
