export type EmiInput = {
  principal: number;
  annualRatePercent: number;
  tenureMonths: number;
};

export type EmiResult = {
  emi: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculateEMI({ principal, annualRatePercent, tenureMonths }: EmiInput): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 };
  }

  const monthlyRate = annualRatePercent / 12 / 100;

  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    return { emi, totalPayment: principal, totalInterest: 0 };
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return { emi, totalPayment, totalInterest };
}

export type AmortizationRow = {
  month: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

export function buildAmortizationSchedule(input: EmiInput): AmortizationRow[] {
  const { principal, annualRatePercent, tenureMonths } = input;
  const { emi } = calculateEMI(input);
  const monthlyRate = annualRatePercent / 12 / 100;

  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = balance * monthlyRate;
    const principalPaid = Math.min(emi - interestPaid, balance);
    balance = Math.max(balance - principalPaid, 0);
    rows.push({ month, emi, principalPaid, interestPaid, balance });
  }

  return rows;
}
