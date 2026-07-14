export const GST_RATES = [0.25, 3, 5, 12, 18, 28] as const;

export type GstMode = "add" | "remove";
export type GstSupplyType = "intra-state" | "inter-state";

export type GstResult = {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
};

export function calculateGST({
  amount,
  ratePercent,
  mode,
  supplyType,
}: {
  amount: number;
  ratePercent: number;
  mode: GstMode;
  supplyType: GstSupplyType;
}): GstResult {
  if (amount <= 0) {
    return { baseAmount: 0, gstAmount: 0, totalAmount: 0, cgst: 0, sgst: 0, igst: 0 };
  }

  let baseAmount: number;
  let totalAmount: number;

  if (mode === "add") {
    baseAmount = amount;
    totalAmount = amount * (1 + ratePercent / 100);
  } else {
    totalAmount = amount;
    baseAmount = amount / (1 + ratePercent / 100);
  }

  const gstAmount = totalAmount - baseAmount;

  const isIntraState = supplyType === "intra-state";
  const cgst = isIntraState ? gstAmount / 2 : 0;
  const sgst = isIntraState ? gstAmount / 2 : 0;
  const igst = isIntraState ? 0 : gstAmount;

  return { baseAmount, gstAmount, totalAmount, cgst, sgst, igst };
}
