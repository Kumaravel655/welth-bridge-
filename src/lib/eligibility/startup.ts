import type { EligibilityResult, QuizQuestion } from "./types";

/**
 * Modelled on the current DPIIT Startup Recognition criteria: an eligible
 * private limited company, LLP or registered partnership firm, incorporated
 * fewer than 10 years ago, with turnover that has never crossed ₹100 crore in
 * any financial year, not formed by splitting/reconstructing an existing
 * business, and working towards innovation or a scalable, high-potential
 * business model. Verify current thresholds on the Startup India portal
 * before relying on this for a filing decision.
 */

export type StartupAnswers = {
  entityType: "private-limited" | "llp" | "partnership" | "proprietorship" | "other";
  age: "under-5" | "5-to-10" | "over-10";
  turnoverExceeded: "yes" | "no";
  splitFormed: "yes" | "no";
  innovative: "yes" | "no";
};

export const startupInitialAnswers: StartupAnswers = {
  entityType: "private-limited",
  age: "under-5",
  turnoverExceeded: "no",
  splitFormed: "no",
  innovative: "yes",
};

export const startupQuestions: QuizQuestion[] = [
  {
    id: "entityType",
    question: "What type of entity is your business?",
    options: [
      { value: "private-limited", label: "Private Limited Company" },
      { value: "llp", label: "LLP" },
      { value: "partnership", label: "Registered Partnership" },
      { value: "proprietorship", label: "Proprietorship" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "age",
    question: "How long ago was it incorporated or registered?",
    options: [
      { value: "under-5", label: "Under 5 years" },
      { value: "5-to-10", label: "5–10 years" },
      { value: "over-10", label: "Over 10 years" },
    ],
  },
  {
    id: "turnoverExceeded",
    question: "Has annual turnover crossed ₹100 crore in any year since incorporation?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    id: "splitFormed",
    question: "Was it formed by splitting up or reconstructing an existing business?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    id: "innovative",
    question:
      "Are you working on innovation, or do you have a scalable business model with high potential for jobs/wealth creation?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

export function evaluateStartupEligibility(answers: StartupAnswers): EligibilityResult {
  const validEntity = ["private-limited", "llp", "partnership"].includes(answers.entityType);

  const checks = [
    {
      label: "Eligible entity type",
      pass: validEntity,
      detail: validEntity
        ? undefined
        : "Only private limited companies, LLPs and registered partnerships qualify — proprietorships don't.",
    },
    {
      label: "Incorporated within the last 10 years",
      pass: answers.age !== "over-10",
    },
    {
      label: "Turnover has never crossed ₹100 crore",
      pass: answers.turnoverExceeded === "no",
    },
    {
      label: "Not formed by splitting/reconstructing a business",
      pass: answers.splitFormed === "no",
    },
    {
      label: "Working on innovation or a scalable, high-potential model",
      pass: answers.innovative === "yes",
    },
  ];

  const eligible = checks.every((c) => c.pass);

  return {
    eligible,
    headline: eligible
      ? "You're likely eligible for DPIIT Startup Recognition"
      : "You may not qualify for DPIIT recognition yet",
    checks,
    recommendation: eligible
      ? "Get incorporated (or convert your entity) the right way and we'll help you apply for DPIIT recognition, tax holiday and other startup benefits."
      : validEntity
        ? "The entity type is right — the other criteria are what's holding you back for now. Talk to us about MSME/Udyam registration in the meantime, which has its own set of benefits."
        : "Start by incorporating as a Private Limited Company or LLP — that's the first step towards DPIIT eligibility.",
  };
}
