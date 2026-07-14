/**
 * Indian individual income tax — FY 2025-26 (AY 2026-27), post Budget 2025.
 * Simplified for planning purposes: models the standard deduction, a single
 * combined "other deductions" figure (old regime only), Section 87A rebate,
 * surcharge and 4% health & education cess. Does not model marginal relief
 * right at the 87A threshold, or income-specific surcharge marginal relief —
 * for a precise figure near those boundaries, use our income tax filing service.
 */

export type AgeBand = "below-60" | "60-to-80" | "above-80";

type Slab = { upTo: number; rate: number };

const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

const OLD_REGIME_SLABS: Record<AgeBand, Slab[]> = {
  "below-60": [
    { upTo: 250_000, rate: 0 },
    { upTo: 500_000, rate: 0.05 },
    { upTo: 1_000_000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ],
  "60-to-80": [
    { upTo: 300_000, rate: 0 },
    { upTo: 500_000, rate: 0.05 },
    { upTo: 1_000_000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ],
  "above-80": [
    { upTo: 500_000, rate: 0 },
    { upTo: 1_000_000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ],
};

export const NEW_REGIME_STANDARD_DEDUCTION = 75_000;
export const OLD_REGIME_STANDARD_DEDUCTION = 50_000;

function taxFromSlabs(taxableIncome: number, slabs: Slab[]): number {
  let tax = 0;
  let lastCap = 0;
  for (const slab of slabs) {
    if (taxableIncome <= lastCap) break;
    const slabAmount = Math.min(taxableIncome, slab.upTo) - lastCap;
    tax += Math.max(slabAmount, 0) * slab.rate;
    lastCap = slab.upTo;
  }
  return tax;
}

function surchargeRate(taxableIncome: number, regime: "old" | "new"): number {
  if (taxableIncome > 50_000_000) return regime === "old" ? 0.37 : 0.25;
  if (taxableIncome > 20_000_000) return 0.25;
  if (taxableIncome > 10_000_000) return 0.15;
  if (taxableIncome > 5_000_000) return 0.1;
  return 0;
}

export type RegimeResult = {
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  takeHome: number;
};

export function computeNewRegime(grossIncome: number): RegimeResult {
  const taxableIncome = Math.max(grossIncome - NEW_REGIME_STANDARD_DEDUCTION, 0);
  const taxBeforeRebate = taxFromSlabs(taxableIncome, NEW_REGIME_SLABS);
  const rebate = taxableIncome <= 1_200_000 ? taxBeforeRebate : 0;
  const taxAfterRebate = taxBeforeRebate - rebate;
  const surcharge = taxAfterRebate * surchargeRate(taxableIncome, "new");
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = taxAfterRebate + surcharge + cess;

  return {
    taxableIncome,
    taxBeforeRebate,
    rebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    takeHome: grossIncome - totalTax,
  };
}

export function computeOldRegime(
  grossIncome: number,
  ageBand: AgeBand,
  otherDeductions: number
): RegimeResult {
  const taxableIncome = Math.max(
    grossIncome - OLD_REGIME_STANDARD_DEDUCTION - Math.max(otherDeductions, 0),
    0
  );
  const taxBeforeRebate = taxFromSlabs(taxableIncome, OLD_REGIME_SLABS[ageBand]);
  const rebate = taxableIncome <= 500_000 ? Math.min(taxBeforeRebate, 12_500) : 0;
  const taxAfterRebate = taxBeforeRebate - rebate;
  const surcharge = taxAfterRebate * surchargeRate(taxableIncome, "old");
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = taxAfterRebate + surcharge + cess;

  return {
    taxableIncome,
    taxBeforeRebate,
    rebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    takeHome: grossIncome - totalTax,
  };
}
