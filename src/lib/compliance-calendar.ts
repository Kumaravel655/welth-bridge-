export type ComplianceCategorySlug = "gst" | "income-tax" | "roc-mca";

export type ComplianceCategory = {
  slug: ComplianceCategorySlug;
  title: string;
  tagline: string;
};

export const complianceCategories: ComplianceCategory[] = [
  {
    slug: "gst",
    title: "GST",
    tagline: "Monthly, quarterly and annual GST return due dates.",
  },
  {
    slug: "income-tax",
    title: "Income Tax",
    tagline: "Advance tax instalments, ITR and TDS return deadlines.",
  },
  {
    slug: "roc-mca",
    title: "ROC / MCA",
    tagline: "Annual company and LLP filings with the Registrar of Companies.",
  },
];

export type ComplianceFrequency = "Monthly" | "Quarterly" | "Annual" | "Event-based";

export type ComplianceDeadline = {
  slug: string;
  title: string;
  category: ComplianceCategorySlug;
  frequency: ComplianceFrequency;
  dueDate: string;
  description: string;
  appliesTo: string;
  relatedServiceSlugs: string[];
};

export const complianceDeadlines: ComplianceDeadline[] = [
  /* ---------------- GST ---------------- */
  {
    slug: "gstr-1-monthly",
    title: "GSTR-1 (Monthly)",
    category: "gst",
    frequency: "Monthly",
    dueDate: "11th of the following month",
    description: "Statement of outward supplies (sales) for the tax period.",
    appliesTo: "Regular taxpayers not on the QRMP scheme",
    relatedServiceSlugs: ["gst-filing", "gst-advisory"],
  },
  {
    slug: "gstr-1-quarterly-qrmp",
    title: "GSTR-1 (Quarterly, QRMP)",
    category: "gst",
    frequency: "Quarterly",
    dueDate: "13th of the month following the quarter",
    description: "Quarterly outward-supplies statement for taxpayers on the QRMP scheme.",
    appliesTo: "Taxpayers with turnover up to ₹5 crore who opted for QRMP",
    relatedServiceSlugs: ["gst-filing"],
  },
  {
    slug: "gstr-3b-monthly",
    title: "GSTR-3B (Monthly)",
    category: "gst",
    frequency: "Monthly",
    dueDate: "20th of the following month",
    description: "Summary return declaring tax liability and paying tax due for the period.",
    appliesTo: "All regular GST-registered taxpayers",
    relatedServiceSlugs: ["gst-filing", "gst-advisory"],
  },
  {
    slug: "gstr-9-annual",
    title: "GSTR-9 (Annual Return)",
    category: "gst",
    frequency: "Annual",
    dueDate: "31 December, following the financial year",
    description: "Consolidated annual return summarising all monthly/quarterly filings for the year.",
    appliesTo: "Taxpayers with turnover above ₹2 crore (optional below that)",
    relatedServiceSlugs: ["gst-filing"],
  },
  {
    slug: "gstr-9c-reconciliation",
    title: "GSTR-9C (Reconciliation Statement)",
    category: "gst",
    frequency: "Annual",
    dueDate: "31 December, following the financial year",
    description: "Self-certified reconciliation between audited financials and annual GST returns.",
    appliesTo: "Taxpayers with turnover above ₹5 crore",
    relatedServiceSlugs: ["gst-advisory"],
  },

  /* ---------------- Income Tax ---------------- */
  {
    slug: "advance-tax-instalment-1",
    title: "Advance Tax — 1st Instalment",
    category: "income-tax",
    frequency: "Quarterly",
    dueDate: "15 June",
    description: "15% of estimated annual tax liability payable by this date.",
    appliesTo: "Taxpayers with estimated tax liability above ₹10,000",
    relatedServiceSlugs: ["income-tax-filing"],
  },
  {
    slug: "advance-tax-instalment-2",
    title: "Advance Tax — 2nd Instalment",
    category: "income-tax",
    frequency: "Quarterly",
    dueDate: "15 September",
    description: "Cumulative 45% of estimated annual tax liability payable by this date.",
    appliesTo: "Taxpayers with estimated tax liability above ₹10,000",
    relatedServiceSlugs: ["income-tax-filing"],
  },
  {
    slug: "advance-tax-instalment-3",
    title: "Advance Tax — 3rd Instalment",
    category: "income-tax",
    frequency: "Quarterly",
    dueDate: "15 December",
    description: "Cumulative 75% of estimated annual tax liability payable by this date.",
    appliesTo: "Taxpayers with estimated tax liability above ₹10,000",
    relatedServiceSlugs: ["income-tax-filing"],
  },
  {
    slug: "advance-tax-instalment-4",
    title: "Advance Tax — 4th Instalment",
    category: "income-tax",
    frequency: "Quarterly",
    dueDate: "15 March",
    description: "Cumulative 100% of estimated annual tax liability payable by this date.",
    appliesTo: "Taxpayers with estimated tax liability above ₹10,000",
    relatedServiceSlugs: ["income-tax-filing"],
  },
  {
    slug: "itr-filing-non-audit",
    title: "ITR Filing (Non-audit cases)",
    category: "income-tax",
    frequency: "Annual",
    dueDate: "31 July",
    description: "Income tax return filing deadline for individuals and entities not requiring an audit.",
    appliesTo: "Salaried individuals and businesses below the audit turnover threshold",
    relatedServiceSlugs: ["income-tax-filing"],
  },
  {
    slug: "itr-filing-audit-cases",
    title: "ITR Filing (Audit cases)",
    category: "income-tax",
    frequency: "Annual",
    dueDate: "31 October",
    description: "Income tax return filing deadline where a tax audit applies.",
    appliesTo: "Businesses and professionals above the audit turnover threshold",
    relatedServiceSlugs: ["income-tax-filing", "income-tax-assessment"],
  },
  {
    slug: "tds-return-quarterly",
    title: "TDS Return (24Q / 26Q / 27Q)",
    category: "income-tax",
    frequency: "Quarterly",
    dueDate: "31st of the month following the quarter (31 May for Q4)",
    description: "Quarterly TDS return covering tax deducted at source during the period.",
    appliesTo: "Any deductor required to deduct TDS",
    relatedServiceSlugs: ["tds-return-filing"],
  },

  /* ---------------- ROC / MCA ---------------- */
  {
    slug: "dir-3-kyc",
    title: "DIR-3 KYC",
    category: "roc-mca",
    frequency: "Annual",
    dueDate: "30 September",
    description: "Annual KYC filing for every individual holding a Director Identification Number (DIN).",
    appliesTo: "Every director with a DIN",
    relatedServiceSlugs: ["roc-annual-filing"],
  },
  {
    slug: "adt-1",
    title: "Form ADT-1",
    category: "roc-mca",
    frequency: "Event-based",
    dueDate: "Within 15 days of the AGM",
    description: "Intimation of appointment or ratification of the statutory auditor.",
    appliesTo: "All companies",
    relatedServiceSlugs: ["roc-annual-filing"],
  },
  {
    slug: "agm",
    title: "Annual General Meeting (AGM)",
    category: "roc-mca",
    frequency: "Annual",
    dueDate: "By 30 September",
    description: "Shareholders formally adopt the company's financial statements for the year.",
    appliesTo: "All companies except OPCs",
    relatedServiceSlugs: ["roc-annual-filing"],
  },
  {
    slug: "aoc-4",
    title: "Form AOC-4",
    category: "roc-mca",
    frequency: "Event-based",
    dueDate: "Within 30 days of the AGM",
    description: "Filing of the company's financial statements with the Registrar of Companies.",
    appliesTo: "All companies",
    relatedServiceSlugs: ["roc-annual-filing"],
  },
  {
    slug: "mgt-7",
    title: "Form MGT-7 / MGT-7A",
    category: "roc-mca",
    frequency: "Event-based",
    dueDate: "Within 60 days of the AGM",
    description: "Annual return covering shareholding, directors and other company particulars.",
    appliesTo: "All companies (MGT-7A for small companies and OPCs)",
    relatedServiceSlugs: ["roc-annual-filing"],
  },
  {
    slug: "company-itr",
    title: "Company Income Tax Return",
    category: "roc-mca",
    frequency: "Annual",
    dueDate: "31 October (where a tax audit applies)",
    description: "The company's own annual income tax filing, separate from its ROC filings.",
    appliesTo: "All registered companies",
    relatedServiceSlugs: ["roc-annual-filing", "income-tax-filing"],
  },
];

export const getComplianceCategory = (slug: ComplianceCategorySlug) =>
  complianceCategories.find((c) => c.slug === slug);

export const complianceByCategory = (slug: ComplianceCategorySlug) =>
  complianceDeadlines.filter((d) => d.category === slug);
