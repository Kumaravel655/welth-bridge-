"use client";

import * as Label from "@radix-ui/react-label";
import * as React from "react";

import { Counter } from "@/components/motion/counter";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { ResultCard } from "@/components/tools/result-card";
import { Input } from "@/components/ui/input";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import { GST_RATES, calculateGST, type GstMode, type GstSupplyType } from "@/lib/calculators/gst";
import { cn } from "@/lib/utils";

export function GstCalculator() {
  const [amount, setAmount] = React.useState(10_000);
  const [ratePercent, setRatePercent] = React.useState<number>(18);
  const [mode, setMode] = React.useState<GstMode>("add");
  const [supplyType, setSupplyType] = React.useState<GstSupplyType>("intra-state");

  const { baseAmount, gstAmount, totalAmount, cgst, sgst, igst } = calculateGST({
    amount,
    ratePercent,
    mode,
    supplyType,
  });

  return (
    <CalculatorShell
      eyebrow="Calculator"
      title="GST Calculator"
      description="Add or remove GST from any amount and see the CGST/SGST or IGST split instantly."
      disclaimer="Uses standard GST slab rates. Some goods and services attract special rates (e.g. gold at 3%, cess on select items) — confirm the exact rate for your HSN/SAC code with our GST advisory team."
      inputs={
        <div className="space-y-7">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">I want to</Label.Root>
            <SegmentedToggle
              options={[
                { value: "add", label: "Add GST" },
                { value: "remove", label: "Remove GST" },
              ]}
              value={mode}
              onChange={setMode}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label.Root htmlFor="amount" className="text-sm font-medium">
              {mode === "add" ? "Amount (excluding GST)" : "Amount (including GST)"}
            </Label.Root>
            <Input
              id="amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">GST rate</Label.Root>
            <div className="flex flex-wrap gap-2">
              {GST_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={ratePercent === r}
                  onClick={() => setRatePercent(r)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    ratePercent === r
                      ? "border-accent bg-accent/10 text-accent-strong"
                      : "border-border text-muted-foreground hover:border-accent/50 hover:text-accent-strong"
                  )}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">Supply type</Label.Root>
            <SegmentedToggle
              options={[
                { value: "intra-state", label: "Intra-state" },
                { value: "inter-state", label: "Inter-state" },
              ]}
              value={supplyType}
              onChange={setSupplyType}
              className="w-full"
            />
          </div>
        </div>
      }
      results={
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            {mode === "add" ? "Total amount (incl. GST)" : "Base amount (excl. GST)"}
          </p>
          <p className="mt-1 font-display text-4xl tabular-nums text-accent-strong">
            ₹<Counter to={Math.round(mode === "add" ? totalAmount : baseAmount)} />
          </p>

          <div className="mt-5 space-y-0">
            <ResultCard label="Base amount" value={baseAmount} prefix="₹" />
            <ResultCard label="GST amount" value={gstAmount} prefix="₹" />
            {supplyType === "intra-state" ? (
              <>
                <ResultCard label="CGST" value={cgst} prefix="₹" />
                <ResultCard label="SGST" value={sgst} prefix="₹" />
              </>
            ) : (
              <ResultCard label="IGST" value={igst} prefix="₹" />
            )}
            <ResultCard label="Total amount" value={totalAmount} prefix="₹" emphasis />
          </div>
        </div>
      }
    />
  );
}
