export type DownloadCategorySlug =
  | "registration-checklists"
  | "tax-forms"
  | "compliance-templates"
  | "startup-resources";

export type DownloadCategory = {
  slug: DownloadCategorySlug;
  title: string;
  tagline: string;
};

export const downloadCategories: DownloadCategory[] = [
  {
    slug: "registration-checklists",
    title: "Registration Checklists",
    tagline: "Everything you need on hand before you start incorporating.",
  },
  {
    slug: "tax-forms",
    title: "Tax Filing Checklists",
    tagline: "Get your documents ready before filing season.",
  },
  {
    slug: "compliance-templates",
    title: "Compliance Templates",
    tagline: "Calendars and clause checklists to keep you audit-ready.",
  },
  {
    slug: "startup-resources",
    title: "Startup Resources",
    tagline: "For founders preparing to raise or apply for recognition.",
  },
];

export type Download = {
  slug: string;
  title: string;
  category: DownloadCategorySlug;
  description: string;
  fileUrl: string;
  fileSizeLabel: string;
  updatedAt: string;
  relatedServiceSlugs: string[];
};

export const downloads: Download[] = [
  {
    slug: "private-limited-company-registration-checklist",
    title: "Private Limited Company Registration Checklist",
    category: "registration-checklists",
    description:
      "Every document and detail you need before we can file your incorporation — directors' KYC, registered office proof and name approval basics.",
    fileUrl: "/downloads/private-limited-company-registration-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-01",
    relatedServiceSlugs: ["private-limited-company", "company-name-search"],
  },
  {
    slug: "gst-registration-document-checklist",
    title: "GST Registration Document Checklist",
    category: "registration-checklists",
    description:
      "PAN, address proof, bank details and photographs — the exact document set GSTN asks for, organised so nothing holds up your ARN.",
    fileUrl: "/downloads/gst-registration-document-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-01",
    relatedServiceSlugs: ["gst-registration"],
  },
  {
    slug: "msme-udyam-registration-checklist",
    title: "MSME / Udyam Registration Checklist",
    category: "registration-checklists",
    description:
      "What you need to register on the Udyam portal and the benefits you unlock once you do — collateral-free loans, delayed-payment protection and more.",
    fileUrl: "/downloads/msme-udyam-registration-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-01",
    relatedServiceSlugs: ["msme-udyam-registration"],
  },
  {
    slug: "income-tax-filing-checklist",
    title: "Income Tax Filing Checklist (Individuals)",
    category: "tax-forms",
    description:
      "Form 16, bank interest certificates, capital gains statements and deduction proofs — gathered in one list before your CA sits down to file.",
    fileUrl: "/downloads/income-tax-filing-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-05",
    relatedServiceSlugs: ["income-tax-filing", "tds-return-filing"],
  },
  {
    slug: "gst-monthly-filing-checklist",
    title: "GST Monthly Filing Checklist",
    category: "tax-forms",
    description:
      "Sales register, purchase register, e-way bills and ITC reconciliation — what to keep current every month so GSTR-1 and GSTR-3B go out on time.",
    fileUrl: "/downloads/gst-monthly-filing-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-05",
    relatedServiceSlugs: ["gst-filing", "gst-advisory"],
  },
  {
    slug: "roc-annual-compliance-calendar",
    title: "ROC Annual Compliance Calendar",
    category: "compliance-templates",
    description:
      "Every ROC due date your private limited company or LLP needs to track through the year — AOC-4, MGT-7, DIR-3 KYC and more, in one calendar.",
    fileUrl: "/downloads/roc-annual-compliance-calendar.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-10",
    relatedServiceSlugs: ["roc-annual-filing"],
  },
  {
    slug: "founders-agreement-clause-checklist",
    title: "Founders Agreement Clause Checklist",
    category: "compliance-templates",
    description:
      "The clauses every founders' agreement should cover — equity split, vesting, roles, exit and dispute resolution — before you paper your co-founder relationship.",
    fileUrl: "/downloads/founders-agreement-clause-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-10",
    relatedServiceSlugs: ["founders-agreement", "shareholders-agreement"],
  },
  {
    slug: "dpiit-startup-recognition-checklist",
    title: "DPIIT Startup Recognition Application Checklist",
    category: "startup-resources",
    description:
      "The eligibility criteria and documents Startup India asks for — entity proof, a short pitch on innovation, and your incorporation certificate.",
    fileUrl: "/downloads/dpiit-startup-recognition-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-12",
    relatedServiceSlugs: ["private-limited-company", "llp-registration"],
  },
  {
    slug: "startup-funding-readiness-checklist",
    title: "Startup Funding Readiness Checklist",
    category: "startup-resources",
    description:
      "What investors and lenders ask for before writing a cheque — pitch deck, financials, cap table and CMA report — so you walk in prepared.",
    fileUrl: "/downloads/startup-funding-readiness-checklist.pdf",
    fileSizeLabel: "3 KB",
    updatedAt: "2026-06-12",
    relatedServiceSlugs: ["fundraising", "pitch-deck", "cma-report"],
  },
];

export const getDownload = (slug: string) => downloads.find((d) => d.slug === slug);

export const getDownloadCategory = (slug: DownloadCategorySlug) =>
  downloadCategories.find((c) => c.slug === slug);

export const downloadsByCategory = (slug: DownloadCategorySlug) =>
  downloads.filter((d) => d.category === slug);

export const featuredDownloads = downloads.slice(0, 3);
