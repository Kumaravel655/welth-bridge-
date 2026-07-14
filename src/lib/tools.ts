export type ToolCategory = "calculator" | "eligibility-checker";

export type Tool = {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: ToolCategory;
  relatedServiceSlugs: string[];
};

export const toolCategories: { slug: ToolCategory; title: string }[] = [
  { slug: "calculator", title: "Calculators" },
  { slug: "eligibility-checker", title: "Eligibility Checkers" },
];

export const tools: Tool[] = [
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    short: "Work out your monthly loan instalment in seconds.",
    description:
      "Estimate the EMI, total interest and total payment for a business, home, term or property-backed loan — and see the full month-by-month breakdown.",
    category: "calculator",
    relatedServiceSlugs: [
      "business-loans",
      "home-loans",
      "term-loans",
      "loan-against-property",
      "cibil-score",
    ],
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    short: "Add or remove GST and split it into CGST, SGST or IGST.",
    description:
      "Calculate GST-inclusive or GST-exclusive amounts at any slab rate, and see exactly how it splits between CGST/SGST (intra-state) or IGST (inter-state).",
    category: "calculator",
    relatedServiceSlugs: ["gst-registration", "gst-filing", "gst-advisory"],
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    short: "Compare the old and new tax regimes for FY 2025-26.",
    description:
      "Enter your income and deductions to see your tax liability under both the old and new regimes, side by side, with our recommendation on which to pick.",
    category: "calculator",
    relatedServiceSlugs: [
      "income-tax-filing",
      "tds-return-filing",
      "income-tax-notice",
      "income-tax-assessment",
    ],
  },
  {
    slug: "startup-eligibility-checker",
    name: "Startup Eligibility Checker",
    short: "See if your business qualifies for DPIIT startup recognition.",
    description:
      "Answer a few quick questions about your entity, age and turnover to check whether you're eligible to apply for DPIIT startup recognition and its tax benefits.",
    category: "eligibility-checker",
    relatedServiceSlugs: [
      "private-limited-company",
      "one-person-company",
      "llp-registration",
      "msme-udyam-registration",
    ],
  },
  {
    slug: "funding-eligibility-checker",
    name: "Funding Eligibility Checker",
    short: "Find out which funding route fits your stage.",
    description:
      "A short questionnaire about your stage, revenue and needs that points you to the funding routes worth pursuing — bank loans, angel/VC funding or government schemes.",
    category: "eligibility-checker",
    relatedServiceSlugs: [
      "fundraising",
      "pitch-deck",
      "financial-report",
      "cma-report",
      "business-loans",
    ],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);

export const toolsByCategory = (category: ToolCategory) =>
  tools.filter((t) => t.category === category);

export const featuredTools = tools;
