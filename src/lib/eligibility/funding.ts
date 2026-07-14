import type { EligibilityResult, QuizQuestion } from "./types";

/**
 * A directional funding-route matcher, not a lending decision — it points
 * founders toward the routes most worth pursuing given their stage, revenue,
 * collateral and appetite for dilution, so the conversation with our
 * fundraising/loans team starts from the right options.
 */

export type FundingAnswers = {
  stage: "idea" | "early-revenue" | "growing" | "established";
  revenue: "none" | "under-50l" | "50l-5cr" | "above-5cr";
  needType: "working-capital" | "growth-capital" | "both";
  hasCollateral: "yes" | "no";
  openToEquity: "yes" | "no";
};

export const fundingInitialAnswers: FundingAnswers = {
  stage: "early-revenue",
  revenue: "under-50l",
  needType: "working-capital",
  hasCollateral: "no",
  openToEquity: "no",
};

export const fundingQuestions: QuizQuestion[] = [
  {
    id: "stage",
    question: "What stage is your business at?",
    options: [
      { value: "idea", label: "Idea stage, pre-revenue" },
      { value: "early-revenue", label: "Early revenue" },
      { value: "growing", label: "Growing revenue" },
      { value: "established", label: "Established, steady profits" },
    ],
  },
  {
    id: "revenue",
    question: "What's your approximate annual revenue?",
    options: [
      { value: "none", label: "None yet" },
      { value: "under-50l", label: "Under ₹50 lakh" },
      { value: "50l-5cr", label: "₹50L – ₹5 crore" },
      { value: "above-5cr", label: "Above ₹5 crore" },
    ],
  },
  {
    id: "needType",
    question: "What do you mainly need funds for?",
    options: [
      { value: "working-capital", label: "Working capital" },
      { value: "growth-capital", label: "Growth / expansion" },
      { value: "both", label: "Both" },
    ],
  },
  {
    id: "hasCollateral",
    question: "Do you have collateral or assets to offer as security?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "openToEquity",
    question: "Are you open to giving up equity in exchange for funding?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

export function matchFundingSchemes(answers: FundingAnswers): EligibilityResult {
  const { stage, revenue, needType, hasCollateral, openToEquity } = answers;
  const needsGrowth = needType === "growth-capital" || needType === "both";
  const needsWorking = needType === "working-capital" || needType === "both";

  const checks = [
    {
      label: "Government schemes (Startup India Seed Fund, MUDRA, Stand-Up India)",
      pass: stage === "idea" || stage === "early-revenue",
      detail: "Built for very early-stage and small businesses — many need no collateral.",
    },
    {
      label: "Collateral-free MSME/Udyam-linked loan (CGTMSE-backed)",
      pass: revenue !== "none" && hasCollateral === "no" && needsWorking,
      detail: "Covers working capital without pledging assets, once you have some revenue history.",
    },
    {
      label: "Bank or NBFC business loan",
      pass: revenue !== "none" && (stage === "growing" || stage === "established"),
      detail: "Best once you have a revenue track record lenders can underwrite against.",
    },
    {
      label: "Loan against property or other collateral",
      pass: hasCollateral === "yes" && needsGrowth,
      detail: "Larger ticket sizes and lower rates when you can offer security.",
    },
    {
      label: "Angel investors",
      pass: (stage === "idea" || stage === "early-revenue") && openToEquity === "yes",
      detail: "Early-stage capital in exchange for equity — useful before you qualify for institutional VC.",
    },
    {
      label: "Venture capital / Series A",
      pass: stage === "growing" && openToEquity === "yes" && needsGrowth,
      detail: "Fits growth-stage businesses with traction that are open to diluting for scale.",
    },
  ];

  const recommended = checks.filter((c) => c.pass);
  const eligible = recommended.length > 0;

  const topLabels = recommended.slice(0, 2).map((c) => c.label);

  return {
    eligible,
    headline: eligible
      ? `Your best-fit route${recommended.length > 1 ? "s" : ""}: ${topLabels.join(" and ")}`
      : "Let's talk through your options directly",
    checks,
    recommendation: eligible
      ? "We'll help you prepare the financials, CMA report or pitch deck each route needs, and make the introductions where relevant."
      : `Based on your revenue of ${revenue === "above-5cr" ? "above ₹5 crore" : revenue} and stage, a quick call will help us map out the right funding path for you.`,
  };
}
