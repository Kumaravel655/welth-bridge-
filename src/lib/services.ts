import { formatINR } from "@/lib/utils";

export type CategorySlug =
  | "start-a-business"
  | "tax-compliance"
  | "trademark-ip"
  | "funding"
  | "ngo";

export type ProcessStep = { title: string; detail: string };

export type Service = {
  slug: string;
  name: string;
  category: CategorySlug;
  group: string;
  short: string;
  description: string;
  price?: number;
  timeline: string;
  highlights: string[];
  process: ProcessStep[];
  includes: string[];
  documents: string[];
};

export type Category = {
  slug: CategorySlug;
  title: string;
  navLabel: string;
  tagline: string;
};


export const categories: Category[] = [
  {
    slug: "start-a-business",
    title: "Start a Business",
    navLabel: "Start a Business",
    tagline: "Registrations, licences and accounting to get you off the ground.",
  },
  {
    slug: "tax-compliance",
    title: "Tax Filing & Compliance",
    navLabel: "Tax & Compliance",
    tagline: "GST, income tax and ROC filings — on time, every time.",
  },
  {
    slug: "trademark-ip",
    title: "Trademark & IP",
    navLabel: "Trademark & IP",
    tagline: "Protect your name, work and inventions.",
  },
  {
    slug: "funding",
    title: "Funding & Legal",
    navLabel: "Funding & Legal",
    tagline: "Raise capital, secure loans and paper every agreement.",
  },
  {
    slug: "ngo",
    title: "NGO Registration",
    navLabel: "NGO",
    tagline: "Trusts, societies and Section 8 companies for a cause.",
  },
];

/* ------------------------------------------------------------------ */
/* Shared step libraries — real filing flows, reused across services   */
/* ------------------------------------------------------------------ */

const P = {
  consult: {
    title: "Free consultation",
    detail: "An expert reviews your goals and confirms the right structure and filings.",
  },
  docs: {
    title: "Documents & verification",
    detail: "We collect your documents through a simple checklist and verify each one.",
  },
  filing: (authority: string): ProcessStep => ({
    title: "Filing & follow-up",
    detail: `We prepare and file the application with ${authority}, then track it until approval.`,
  }),
  certificate: (what: string): ProcessStep => ({
    title: "Approved & delivered",
    detail: `You receive your ${what} along with guidance on what comes next.`,
  }),
};

const registrationProcess = (authority: string, what: string): ProcessStep[] => [
  P.consult,
  P.docs,
  P.filing(authority),
  P.certificate(what),
];

const companyIncludes = [
  "Verification of all documents",
  "DSC and DIN for directors",
  "Name reservation and incorporation filing",
  "PAN, TAN and certificate of incorporation",
  "Follow-up until the certificate is allotted",
];

const companyDocuments = [
  "PAN card and Aadhaar of all directors",
  "Residence proof of directors",
  "Passport-size photographs",
  "Rental agreement or ownership proof of registered office",
  "Latest utility bill or bank statement",
];

const licenceIncludes = [
  "Eligibility check and application preparation",
  "Filing with the licensing authority",
  "Liaison with the department until approval",
  "Licence certificate delivered digitally",
];

const licenceDocuments = [
  "PAN and Aadhaar of the proprietor or directors",
  "Business address proof",
  "Passport-size photographs",
  "Business constitution proof",
];

const taxIncludes = [
  "Dedicated compliance expert",
  "Preparation and review of the filing",
  "Submission before the due date",
  "Acknowledgement and records shared with you",
];

const taxDocuments = [
  "PAN of the business or individual",
  "Sales and purchase records for the period",
  "Bank statements",
  "Previous filings, if any",
];

const legalIncludes = [
  "Drafted by corporate lawyers",
  "Two rounds of revisions included",
  "Clause-by-clause walkthrough on a call",
  "Execution-ready final copy",
];

const legalDocuments = [
  "Identity proof of all parties",
  "Basic terms agreed between parties",
  "Company or firm details, if applicable",
];

const legalProcess: ProcessStep[] = [
  P.consult,
  {
    title: "Terms captured",
    detail: "We record what both sides have agreed and flag anything missing.",
  },
  {
    title: "Draft & revise",
    detail: "A lawyer drafts the agreement; you review and we revise until it is right.",
  },
  {
    title: "Ready to sign",
    detail: "You receive the final agreement with signing and stamp-duty guidance.",
  },
];

/* ------------------------------------------------------------------ */
/* Service definitions                                                 */
/* ------------------------------------------------------------------ */

type Def = Omit<Service, "process" | "includes" | "documents"> &
  Partial<Pick<Service, "process" | "includes" | "documents">>;

const defaults: Record<
  CategorySlug,
  Pick<Service, "process" | "includes" | "documents">
> = {
  "start-a-business": {
    process: registrationProcess("the Registrar of Companies", "registration certificate"),
    includes: companyIncludes,
    documents: companyDocuments,
  },
  "tax-compliance": {
    process: registrationProcess("the tax department", "acknowledgement"),
    includes: taxIncludes,
    documents: taxDocuments,
  },
  "trademark-ip": {
    process: registrationProcess("the IP registry", "filing receipt"),
    includes: [
      "Availability search before filing",
      "Application drafted by IP experts",
      "Filing and objection monitoring",
      "Status updates until registration",
    ],
    documents: [
      "Logo or work to be protected",
      "Applicant identity and address proof",
      "Business proof, if filing as a company",
    ],
  },
  funding: {
    process: legalProcess,
    includes: legalIncludes,
    documents: legalDocuments,
  },
  ngo: {
    process: registrationProcess("the registrar", "registration certificate"),
    includes: [
      "Drafting of trust deed or bylaws",
      "Registration filing with the authority",
      "PAN application for the entity",
      "Guidance on 12A and 80G exemptions",
    ],
    documents: [
      "ID and address proof of founders",
      "Passport-size photographs",
      "Registered address proof",
      "Objectives of the organisation",
    ],
  },
};

const def = (d: Def): Service => ({ ...defaults[d.category], ...d });

export const services: Service[] = [
  /* ---------------- Start a Business — Company Registration -------- */
  def({
    slug: "private-limited-company",
    name: "Private Limited Company",
    category: "start-a-business",
    group: "Company Registration",
    short: "The default structure for startups that plan to raise funding.",
    description:
      "A private limited company gives your business a separate legal identity, limits your personal liability, and is the only structure venture capital and angel investors will fund.",
    price: 12999,
    timeline: "10–15 working days",
    highlights: [
      "Separate legal identity from its directors",
      "Raise funds from VCs and angel investors",
      "Limited liability for shareholders",
      "Recognised under the Startup India scheme",
    ],
    process: [
      { title: "DSC & DIN", detail: "We apply for digital signatures and director identification numbers." },
      { title: "Name approval", detail: "Your company name is reserved with the Registrar of Companies." },
      { title: "MOA, AOA & filing", detail: "We draft your charter documents and file the incorporation forms." },
      { title: "Company registered", detail: "You receive the certificate of incorporation, PAN and TAN." },
    ],
  }),
  def({
    slug: "one-person-company",
    name: "One Person Company",
    category: "start-a-business",
    group: "Company Registration",
    short: "Corporate protection for a single founder.",
    description:
      "An OPC gives a solo founder the limited liability and credibility of a company without needing a co-founder — one shareholder, one nominee, full control.",
    timeline: "10–15 working days",
    highlights: [
      "Single shareholder with full control",
      "Limited liability protection",
      "Easier compliance than a private limited",
      "Convert to Pvt Ltd as you grow",
    ],
  }),
  def({
    slug: "partnership-firm",
    name: "Partnership Firm",
    category: "start-a-business",
    group: "Company Registration",
    short: "A simple structure for two or more people in business together.",
    description:
      "A registered partnership firm formalises profit sharing, roles and dispute resolution between partners under the Indian Partnership Act.",
    timeline: "5–7 working days",
    highlights: [
      "Quick and low-cost to set up",
      "Registered partnership deed",
      "Flexible profit-sharing terms",
      "Minimal annual compliance",
    ],
  }),
  def({
    slug: "llp-registration",
    name: "LLP Registration",
    category: "start-a-business",
    group: "Company Registration",
    short: "Partnership flexibility with limited liability.",
    description:
      "A limited liability partnership combines the operational ease of a partnership with the liability protection of a company — a favourite of professional firms and services businesses.",
    timeline: "10–15 working days",
    highlights: [
      "Partners' personal assets protected",
      "No minimum capital requirement",
      "Lower compliance burden than a company",
      "Separate legal entity status",
    ],
  }),
  def({
    slug: "public-limited-company",
    name: "Public Limited Company",
    category: "start-a-business",
    group: "Company Registration",
    short: "For businesses that plan to raise capital from the public.",
    description:
      "A public limited company can list its shares and accept public deposits — the structure for businesses with large-scale capital ambitions.",
    timeline: "15–20 working days",
    highlights: [
      "Raise capital from the public",
      "Shares freely transferable",
      "Higher credibility with lenders",
      "Minimum 3 directors, 7 shareholders",
    ],
  }),
  def({
    slug: "producer-company",
    name: "Producer Company",
    category: "start-a-business",
    group: "Company Registration",
    short: "A company owned by farmers and primary producers.",
    description:
      "A producer company lets farmers and producers pool resources, access credit and market their produce collectively while keeping company-grade governance.",
    timeline: "15–20 working days",
    highlights: [
      "Owned and governed by producers",
      "Access to institutional credit",
      "Limited liability for members",
      "Tax benefits on agricultural income",
    ],
  }),
  def({
    slug: "nidhi-company",
    name: "Nidhi Company",
    category: "start-a-business",
    group: "Company Registration",
    short: "A mutual-benefit company for borrowing and lending among members.",
    description:
      "A Nidhi company cultivates savings among its members and lends only to them — regulated, member-owned finance without an RBI licence.",
    timeline: "15–20 working days",
    highlights: [
      "No RBI licence required",
      "Member-only deposits and loans",
      "Low-risk regulated structure",
      "Minimum 7 members to start",
    ],
  }),
  def({
    slug: "section-8-company",
    name: "Section 8 Company",
    category: "start-a-business",
    group: "Company Registration",
    short: "A non-profit company for charitable and social objectives.",
    description:
      "A Section 8 company channels profits entirely into its charitable objectives, with the governance and credibility of a registered company.",
    timeline: "15–20 working days",
    highlights: [
      "Highest credibility for non-profits",
      "Eligible for 12A and 80G exemptions",
      "No minimum capital requirement",
      "Profits applied only to objectives",
    ],
  }),
  def({
    slug: "proprietorship-registration",
    name: "Proprietorship Registration",
    category: "start-a-business",
    group: "Company Registration",
    short: "The fastest way for one person to start doing business.",
    description:
      "A sole proprietorship is the simplest business form — we register it with the right licences so you can open a current account and invoice customers immediately.",
    timeline: "3–5 working days",
    highlights: [
      "Fastest and cheapest to start",
      "Full control with one owner",
      "Minimal compliance requirements",
      "MSME and GST registration included",
    ],
  }),
  def({
    slug: "company-name-search",
    name: "Company Name Search",
    category: "start-a-business",
    group: "Company Registration",
    short: "Check availability before you fall in love with a name.",
    description:
      "We search MCA records and the trademark registry so the name you choose is available, compliant with naming rules and safe from objections.",
    timeline: "1–2 working days",
    highlights: [
      "MCA and trademark registry search",
      "Naming-rule compliance check",
      "Alternative suggestions if taken",
      "Reservation filing on request",
    ],
  }),

  /* ---------------- Start a Business — Licensing -------------------- */
  def({
    slug: "fssai-food-license",
    name: "Food License (FSSAI)",
    category: "start-a-business",
    group: "Licensing",
    short: "Mandatory licence for any food business in India.",
    description:
      "Every food manufacturer, restaurant, trader or transporter needs an FSSAI licence. We identify the right category — basic, state or central — and get you licensed.",
    timeline: "7–15 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("FSSAI", "food licence"),
    highlights: [
      "Basic, state and central licences",
      "Right category identified for you",
      "Mandatory for all food businesses",
      "Renewal reminders included",
    ],
  }),
  def({
    slug: "trade-license",
    name: "Trade License",
    category: "start-a-business",
    group: "Licensing",
    short: "Municipal permission to run your trade from your premises.",
    description:
      "A trade licence from the local municipal corporation certifies your premises for business — required before most shops and establishments can operate.",
    timeline: "7–10 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("the municipal corporation", "trade licence"),
    highlights: [
      "Municipal corporation filing",
      "Premises compliance check",
      "Required for shops and establishments",
      "Annual renewal support",
    ],
  }),
  def({
    slug: "msme-udyam-registration",
    name: "Udyam / MSME Registration",
    category: "start-a-business",
    group: "Licensing",
    short: "Unlock subsidies, cheaper credit and government tenders.",
    description:
      "Udyam registration certifies you as a micro, small or medium enterprise — the gateway to priority-sector loans, subsidies and protection against delayed payments.",
    timeline: "1–3 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("the Udyam portal", "Udyam certificate"),
    highlights: [
      "Priority-sector lending eligibility",
      "Interest and capital subsidies",
      "Protection against delayed payments",
      "Same-week certificate",
    ],
  }),
  def({
    slug: "import-export-code",
    name: "IE Code License",
    category: "start-a-business",
    group: "Licensing",
    short: "The 10-digit code you need to import or export anything.",
    description:
      "An Import Export Code from DGFT is mandatory for cross-border trade. One-time registration, lifetime validity — we handle the entire application.",
    timeline: "2–5 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("DGFT", "IE code"),
    highlights: [
      "Mandatory for import and export",
      "Lifetime validity, no renewals",
      "Required for customs clearance",
      "Enables export incentives",
    ],
  }),
  def({
    slug: "dot-osp-registration",
    name: "DOT OSP Registration",
    category: "start-a-business",
    group: "Licensing",
    short: "Registration for call centres and telecom-based services.",
    description:
      "BPOs, call centres and tele-services operating in India register as Other Service Providers with the Department of Telecommunications. We manage the filing end to end.",
    timeline: "15–30 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("the Department of Telecommunications", "OSP registration"),
    highlights: [
      "Required for BPOs and call centres",
      "Domestic and international OSP",
      "Complete DOT liaison",
      "Compliance guidance included",
    ],
  }),
  def({
    slug: "iso-certification",
    name: "ISO Certification",
    category: "start-a-business",
    group: "Licensing",
    short: "International quality certification that wins tenders and trust.",
    description:
      "ISO 9001 and related certifications signal audited quality processes — often a prerequisite for corporate contracts and government tenders.",
    timeline: "10–20 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("an accredited certification body", "ISO certificate"),
    highlights: [
      "ISO 9001, 14001, 22000 and more",
      "Accredited certification bodies",
      "Documentation support included",
      "Boosts tender eligibility",
    ],
  }),
  def({
    slug: "apeda-certification",
    name: "APEDA Certification",
    category: "start-a-business",
    group: "Licensing",
    short: "Registration for exporters of agricultural products.",
    description:
      "APEDA registration is mandatory for exporting scheduled agricultural products and unlocks export incentives, training and market development support.",
    timeline: "7–10 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("APEDA", "RCMC certificate"),
    highlights: [
      "Mandatory for agri-product export",
      "Access to export incentives",
      "One-time registration",
      "Financial assistance schemes",
    ],
  }),
  def({
    slug: "rera-project-registration",
    name: "RERA Project Registration",
    category: "start-a-business",
    group: "Licensing",
    short: "Mandatory registration for real-estate projects.",
    description:
      "Developers must register projects above 500 sq m with the state RERA before advertising or selling. We compile the disclosures and manage the filing.",
    timeline: "15–30 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("the state RERA authority", "project registration"),
    highlights: [
      "Required before marketing a project",
      "Complete disclosure preparation",
      "State RERA liaison",
      "Quarterly update support",
    ],
  }),
  def({
    slug: "rera-agent-registration",
    name: "RERA Agent Registration",
    category: "start-a-business",
    group: "Licensing",
    short: "Licence for real-estate agents to deal in RERA projects.",
    description:
      "Real-estate agents facilitating sales in registered projects need their own RERA registration. We get you licensed so every deal is compliant.",
    timeline: "7–15 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("the state RERA authority", "agent registration"),
    highlights: [
      "Mandatory for agents in RERA projects",
      "Individual and firm registrations",
      "Five-year validity",
      "Renewal support included",
    ],
  }),
  def({
    slug: "digital-signature-certificate",
    name: "Digital Signature Certificate",
    category: "start-a-business",
    group: "Licensing",
    short: "Sign filings electronically — required for MCA and tax portals.",
    description:
      "A Class 3 DSC is required to sign company filings, tax returns and tenders electronically. Issued against verified identity, delivered on a secure token.",
    timeline: "1–2 working days",
    includes: licenceIncludes,
    documents: licenceDocuments,
    process: registrationProcess("a licensed certifying authority", "digital signature"),
    highlights: [
      "Class 3 individual and organisation DSC",
      "Required for MCA and GST filings",
      "Secure USB token included",
      "Two-year validity",
    ],
  }),

  /* ---------------- Start a Business — Accounting & Tax ------------- */
  def({
    slug: "accounting-and-bookkeeping",
    name: "Accounting & Book-keeping",
    category: "start-a-business",
    group: "Accounting & Tax",
    short: "Monthly books maintained by qualified accountants.",
    description:
      "We maintain your ledgers, reconcile bank statements and produce monthly management reports — so your books are always audit-ready.",
    timeline: "Ongoing monthly",
    includes: taxIncludes,
    documents: taxDocuments,
    process: registrationProcess("your books", "monthly reports"),
    highlights: [
      "Dedicated accountant for your business",
      "Monthly P&L and balance sheet",
      "Bank and GST reconciliation",
      "Audit-ready books, always",
    ],
  }),
  def({
    slug: "payroll-maintenance",
    name: "Payroll Maintenance",
    category: "start-a-business",
    group: "Accounting & Tax",
    short: "Salaries, payslips and statutory deductions handled monthly.",
    description:
      "End-to-end payroll: salary processing, payslips, PF, ESI and TDS deductions with all statutory filings — accurate and on schedule.",
    timeline: "Ongoing monthly",
    includes: taxIncludes,
    documents: taxDocuments,
    process: registrationProcess("payroll systems", "monthly payroll reports"),
    highlights: [
      "Payslips and salary registers",
      "PF, ESI and TDS deductions",
      "Statutory return filings",
      "Employee onboarding support",
    ],
  }),
  def({
    slug: "tds-return-filing",
    name: "TDS Return Filing",
    category: "start-a-business",
    group: "Accounting & Tax",
    short: "Quarterly TDS returns filed accurately and on time.",
    description:
      "We prepare and file your quarterly TDS returns, issue Form 16/16A to deductees and resolve any defaults raised by TRACES.",
    timeline: "Quarterly",
    includes: taxIncludes,
    documents: taxDocuments,
    process: registrationProcess("TRACES", "filing acknowledgement"),
    highlights: [
      "All quarterly forms — 24Q, 26Q, 27Q",
      "Form 16 and 16A generation",
      "Default and notice resolution",
      "Due-date reminders",
    ],
  }),
  def({
    slug: "income-tax-filing",
    name: "Individual Income Tax Filing",
    category: "start-a-business",
    group: "Accounting & Tax",
    short: "Personal ITR filed by experts — maximum legal savings.",
    description:
      "A tax expert prepares and files your income tax return, claiming every deduction you are entitled to — salaried, business or capital gains.",
    timeline: "1–3 working days",
    includes: taxIncludes,
    documents: taxDocuments,
    process: registrationProcess("the income tax portal", "ITR acknowledgement"),
    highlights: [
      "Expert-prepared, not self-service",
      "Every eligible deduction claimed",
      "Salaried, business and capital gains",
      "E-verification assistance",
    ],
  }),

  /* ---------------- Tax & Compliance — GST -------------------------- */
  def({
    slug: "gst-registration",
    name: "GST Registration",
    category: "tax-compliance",
    group: "GST",
    short: "Get your GSTIN and start billing compliantly.",
    description:
      "GST registration is mandatory once turnover crosses ₹20 lakh (₹40 lakh for goods in most states). We file your application and follow up until your GSTIN is issued.",
    price: 1499,
    timeline: "5–7 working days",
    highlights: [
      "Instant ARN on application",
      "Expert-verified documentation",
      "Follow-up until GSTIN is granted",
      "Input tax credit unlocked",
    ],
    process: [
      { title: "Application preparation", detail: "Our experts collect your details and verify supporting documents." },
      { title: "Application filing", detail: "We submit the application online and share the ARN immediately." },
      { title: "GSTIN issued", detail: "After officer verification, you receive your GSTIN and registration certificate." },
    ],
  }),
  def({
    slug: "gst-filing",
    name: "GST Filing",
    category: "tax-compliance",
    group: "GST",
    short: "Monthly and quarterly returns filed before every due date.",
    description:
      "GSTR-1, GSTR-3B and annual returns prepared, reconciled with your books and filed on schedule — with input credit optimised each cycle.",
    timeline: "Monthly / quarterly",
    highlights: [
      "GSTR-1, 3B and annual returns",
      "Input tax credit reconciliation",
      "Due-date guarantee",
      "Notice support included",
    ],
  }),
  def({
    slug: "gst-advisory",
    name: "GST Advisory",
    category: "tax-compliance",
    group: "GST",
    short: "Expert answers on rates, credits, e-invoicing and structure.",
    description:
      "On-call GST expertise for classification disputes, input credit questions, e-invoicing applicability and transaction structuring.",
    timeline: "On demand",
    highlights: [
      "Rate and classification opinions",
      "Input credit optimisation",
      "E-invoicing and e-way bill guidance",
      "Departmental audit support",
    ],
  }),

  /* ---------------- Tax & Compliance — Income Tax ------------------- */
  def({
    slug: "income-tax-notice",
    name: "Income Tax Notice",
    category: "tax-compliance",
    group: "Income Tax",
    short: "Received a notice? We draft and file the right response.",
    description:
      "Our tax experts analyse the notice, prepare a point-by-point reply with supporting evidence and represent you before the department.",
    timeline: "3–7 working days",
    highlights: [
      "Notice analysis by tax experts",
      "Point-by-point drafted response",
      "Evidence compilation",
      "Representation before the officer",
    ],
  }),
  def({
    slug: "income-tax-assessment",
    name: "Income Tax Assessment",
    category: "tax-compliance",
    group: "Income Tax",
    short: "End-to-end representation through scrutiny and assessment.",
    description:
      "From responding to scrutiny questionnaires to appearing before assessing officers, we manage the entire assessment proceeding for you.",
    timeline: "As per proceeding",
    highlights: [
      "Scrutiny and reassessment cases",
      "Complete document preparation",
      "Officer representation",
      "Appeal guidance if needed",
    ],
  }),

  /* ---------------- Tax & Compliance — Annual Compliance ------------ */
  def({
    slug: "roc-annual-filing",
    name: "ROC Return / Annual Filing",
    category: "tax-compliance",
    group: "Annual Compliance",
    short: "AOC-4, MGT-7 and every annual form your company owes the ROC.",
    description:
      "Every registered company must file annual returns with the Registrar of Companies. We prepare the financials-linked forms and file them before penalties accrue.",
    timeline: "7–10 working days",
    highlights: [
      "AOC-4 and MGT-7 filings",
      "Director KYC included",
      "Penalty protection via timely filing",
      "Compliance calendar maintained",
    ],
  }),
  def({
    slug: "company-name-change",
    name: "Company Name Change",
    category: "tax-compliance",
    group: "Annual Compliance",
    short: "Rebrand legally — board resolution to fresh incorporation certificate.",
    description:
      "We manage the special resolution, name approval and MCA filings needed to change your company's name, ending with a fresh certificate of incorporation.",
    timeline: "10–15 working days",
    highlights: [
      "Board and special resolutions drafted",
      "New name reservation",
      "MCA approval managed",
      "Fresh certificate of incorporation",
    ],
  }),
  def({
    slug: "registered-office-change",
    name: "Change of Registered Office",
    category: "tax-compliance",
    group: "Annual Compliance",
    short: "Move your registered office — within or across states.",
    description:
      "Whether you are moving within the city or to another state, we handle the resolutions, filings and regional director approval where required.",
    timeline: "7–30 working days",
    highlights: [
      "Within-city and interstate moves",
      "All MCA forms filed",
      "Regional director approval handled",
      "Records updated everywhere",
    ],
  }),
  def({
    slug: "add-directors",
    name: "Add Directors",
    category: "tax-compliance",
    group: "Annual Compliance",
    short: "Appoint new directors with clean, compliant filings.",
    description:
      "From DIN and DSC for the incoming director to board resolutions and DIR-12 filing — a complete, compliant appointment.",
    timeline: "5–7 working days",
    highlights: [
      "DIN and DSC arranged",
      "Board resolution drafted",
      "DIR-12 filed with MCA",
      "Statutory registers updated",
    ],
  }),
  def({
    slug: "remove-directors",
    name: "Remove Directors",
    category: "tax-compliance",
    group: "Annual Compliance",
    short: "Resignations and removals executed by the book.",
    description:
      "Director exits need precise paperwork. We draft the resolutions, obtain resignations and file the forms so the change is clean on record.",
    timeline: "5–7 working days",
    highlights: [
      "Resignation documentation",
      "Board resolution drafted",
      "DIR-11 and DIR-12 filings",
      "MCA records updated",
    ],
  }),
  def({
    slug: "increase-authorized-capital",
    name: "Increase Authorized Capital",
    category: "tax-compliance",
    group: "Annual Compliance",
    short: "Raise your capital ceiling before your next funding round.",
    description:
      "Before issuing new shares you must raise your authorised capital. We draft the resolutions, amend the MOA and file SH-7 with the MCA.",
    timeline: "5–10 working days",
    highlights: [
      "EGM and resolutions drafted",
      "MOA amendment prepared",
      "SH-7 filed with MCA",
      "Ready for your next share issue",
    ],
  }),

  /* ---------------- Tax & Compliance — Business Conversion ---------- */
  def({
    slug: "pvt-ltd-to-llp",
    name: "Private Limited to LLP",
    category: "tax-compliance",
    group: "Business Conversion",
    short: "Convert to an LLP for lighter compliance.",
    description:
      "Move from company compliance burden to LLP flexibility while carrying forward your business, assets and brand.",
    timeline: "20–30 working days",
    highlights: [
      "Assets and liabilities carried forward",
      "Shareholder consent management",
      "All MCA conversion forms",
      "New LLP agreement drafted",
    ],
  }),
  def({
    slug: "pvt-ltd-to-opc",
    name: "Private Limited to OPC",
    category: "tax-compliance",
    group: "Business Conversion",
    short: "Consolidate ownership into a one-person company.",
    description:
      "When a private company's ownership consolidates to one person, converting to an OPC simplifies governance without losing corporate status.",
    timeline: "15–25 working days",
    highlights: [
      "Eligibility assessment first",
      "Special resolution drafted",
      "MCA conversion filings",
      "Fresh incorporation certificate",
    ],
  }),
  def({
    slug: "proprietorship-to-llp",
    name: "Proprietorship to LLP",
    category: "tax-compliance",
    group: "Business Conversion",
    short: "Upgrade your proprietorship to a limited liability partnership.",
    description:
      "Bring a partner aboard and shield personal assets by converting your proprietorship into an LLP, with business continuity preserved.",
    timeline: "15–20 working days",
    highlights: [
      "Business continuity preserved",
      "Liability protection gained",
      "LLP agreement drafted",
      "Licences migrated",
    ],
  }),
  def({
    slug: "proprietorship-to-pvt-ltd",
    name: "Proprietorship to Pvt Ltd",
    category: "tax-compliance",
    group: "Business Conversion",
    short: "Take your one-person business to a fundable company.",
    description:
      "Convert your proprietorship into a private limited company to raise capital, add shareholders and limit personal liability.",
    timeline: "15–25 working days",
    highlights: [
      "Takeover agreement drafted",
      "Full incorporation included",
      "Assets transferred cleanly",
      "Investor-ready structure",
    ],
  }),

  /* ---------------- Trademark & IP ---------------------------------- */
  def({
    slug: "trademark-search",
    name: "Trademark Search",
    category: "trademark-ip",
    group: "Trademark",
    short: "Know if your brand name is safe before you file.",
    description:
      "A professional search across the trademark registry and common-law uses, with an expert opinion on registrability and conflict risk.",
    timeline: "1–2 working days",
    highlights: [
      "Registry-wide conflict search",
      "Phonetic and visual similarity check",
      "Registrability opinion",
      "Class recommendation",
    ],
  }),
  def({
    slug: "respond-to-tm-objection",
    name: "Respond to TM Objection",
    category: "trademark-ip",
    group: "Trademark",
    short: "Examiner objected? We draft the legal response.",
    description:
      "Our IP attorneys analyse the examination report and draft a reasoned reply with case-law support to move your mark toward registration.",
    timeline: "3–5 working days",
    highlights: [
      "Examination report analysis",
      "Attorney-drafted response",
      "Case-law backed arguments",
      "Hearing representation available",
    ],
  }),
  def({
    slug: "copyright-registration",
    name: "Copyright Registration",
    category: "trademark-ip",
    group: "Copyright",
    short: "Protect your creative work with a registered copyright.",
    description:
      "Software, music, books, films or artwork — registration creates a public record of ownership and stronger standing in infringement disputes.",
    timeline: "30–45 working days",
    highlights: [
      "All work categories covered",
      "Application drafted by experts",
      "Discrepancy handling included",
      "Lifetime + 60 years protection",
    ],
  }),
  def({
    slug: "patent",
    name: "Patent Filing",
    category: "trademark-ip",
    group: "Patent",
    short: "Protect your invention with a filed patent application.",
    description:
      "From specification drafting to filing with the Indian Patent Office, we protect the novelty of your invention with precision drafting.",
    timeline: "As per stage",
    highlights: [
      "Specification drafted by patent agents",
      "Complete filing management",
      "Examination response support",
      "20-year protection on grant",
    ],
  }),
  def({
    slug: "patent-search",
    name: "Patent Search",
    category: "trademark-ip",
    group: "Patent",
    short: "Check novelty before investing in a patent application.",
    description:
      "A prior-art search across global patent databases with a professional opinion on whether your invention is likely patentable.",
    timeline: "3–5 working days",
    highlights: [
      "Global prior-art databases",
      "Novelty assessment report",
      "Patentability opinion",
      "Filing strategy advice",
    ],
  }),
  def({
    slug: "provisional-patent-application",
    name: "Provisional Application",
    category: "trademark-ip",
    group: "Patent",
    short: "Lock your priority date while you finish the invention.",
    description:
      "A provisional application secures your filing date for 12 months at lower cost, buying time to refine the invention or find investors.",
    timeline: "5–7 working days",
    highlights: [
      "Priority date secured immediately",
      "12 months to file complete specs",
      "Lower upfront cost",
      "'Patent pending' status",
    ],
  }),
  def({
    slug: "permanent-patent",
    name: "Permanent Patent",
    category: "trademark-ip",
    group: "Patent",
    short: "The complete specification that takes you to grant.",
    description:
      "We draft and file the complete specification with claims, prosecute examination objections and follow through to grant.",
    timeline: "As per examination",
    highlights: [
      "Complete claims drafting",
      "Examination prosecution",
      "Hearing representation",
      "Grant follow-through",
    ],
  }),

  /* ---------------- Funding — Fundraising ---------------------------- */
  def({
    slug: "fundraising",
    name: "Fundraising",
    category: "funding",
    group: "Fundraising",
    short: "Structure and close your raise with expert support.",
    description:
      "From valuation groundwork to term-sheet negotiation and compliant share allotment, we manage the mechanics of raising capital.",
    timeline: "As per round",
    highlights: [
      "Round structuring advice",
      "Investor documentation",
      "Compliant share allotment",
      "Post-raise filings included",
    ],
  }),
  def({
    slug: "pitch-deck",
    name: "Pitch Deck",
    category: "funding",
    group: "Fundraising",
    short: "An investor-grade deck that tells your story with numbers.",
    description:
      "Analysts and designers turn your business into a sharp, investor-ready narrative — problem, product, traction and ask.",
    timeline: "5–10 working days",
    highlights: [
      "Investor-standard structure",
      "Financial model summary slides",
      "Professional design",
      "Two revision rounds",
    ],
  }),
  def({
    slug: "financial-report",
    name: "Financial Report",
    category: "funding",
    group: "Fundraising",
    short: "Projections and statements that stand up to diligence.",
    description:
      "Three-to-five-year financial projections, ratio analysis and statements prepared to the standard investors and lenders expect.",
    timeline: "5–7 working days",
    highlights: [
      "3–5 year projections",
      "Ratio and sensitivity analysis",
      "Lender and investor formats",
      "Built by chartered accountants",
    ],
  }),
  def({
    slug: "cma-report",
    name: "CMA Report Preparation",
    category: "funding",
    group: "Fundraising",
    short: "The credit report banks require for working-capital loans.",
    description:
      "A Credit Monitoring Arrangement report in the exact format banks require — past performance, projections and fund-flow analysis.",
    timeline: "3–5 working days",
    highlights: [
      "Bank-mandated CMA format",
      "Fund-flow and MPBF analysis",
      "Prepared by CAs",
      "Revisions for bank queries",
    ],
  }),

  /* ---------------- Funding — Loans ---------------------------------- */
  def({
    slug: "business-loans",
    name: "Business Loans",
    category: "funding",
    group: "Loans",
    short: "Working capital and term finance from the right lender.",
    description:
      "We match your profile to the right banks and NBFCs, prepare the file that gets approved and negotiate terms on your side of the table.",
    timeline: "7–21 working days",
    highlights: [
      "Multi-lender comparison",
      "Approval-ready documentation",
      "Rate negotiation support",
      "MSME scheme guidance",
    ],
  }),
  def({
    slug: "home-loans",
    name: "Home Loans",
    category: "funding",
    group: "Loans",
    short: "The best rate for your home purchase, handled end to end.",
    description:
      "From eligibility check to disbursal, we compare lenders, compile your file and chase the approval so you can focus on the house.",
    timeline: "10–20 working days",
    highlights: [
      "Lender comparison on real rates",
      "Eligibility maximisation",
      "Documentation done for you",
      "Balance-transfer advice",
    ],
  }),
  def({
    slug: "term-loans",
    name: "Term Loans",
    category: "funding",
    group: "Loans",
    short: "Long-tenure finance for expansion and equipment.",
    description:
      "Structured term finance for capacity expansion, machinery or premises — with projections and proposals prepared to banking standards.",
    timeline: "10–21 working days",
    highlights: [
      "Project report preparation",
      "Collateral structuring advice",
      "Multiple bank submissions",
      "Subsidy scheme mapping",
    ],
  }),
  def({
    slug: "loan-against-property",
    name: "Loan Against Property",
    category: "funding",
    group: "Loans",
    short: "Unlock capital from property you already own.",
    description:
      "Leverage residential or commercial property for large, low-rate credit lines — we manage valuation, legal checks and lender negotiation.",
    timeline: "10–21 working days",
    highlights: [
      "Residential and commercial LAP",
      "Valuation coordination",
      "Legal clearance support",
      "Best-rate negotiation",
    ],
  }),
  def({
    slug: "cibil-score",
    name: "CIBIL Score",
    category: "funding",
    group: "Loans",
    short: "Understand and repair your credit score.",
    description:
      "Full credit report analysis, error dispute filing and a practical improvement plan to lift your score before your next application.",
    timeline: "30–90 days",
    highlights: [
      "Full report analysis",
      "Error disputes filed for you",
      "Score improvement roadmap",
      "Loan-readiness assessment",
    ],
  }),

  /* ---------------- Funding — Legal ----------------------------------- */
  def({
    slug: "rental-agreement",
    name: "Rental Agreement",
    category: "funding",
    group: "Legal Drafting",
    short: "Watertight rental and lease agreements.",
    description:
      "Residential or commercial, our lawyers draft agreements that protect deposits, define maintenance duties and prevent disputes.",
    timeline: "1–2 working days",
    highlights: [
      "Residential and commercial",
      "Stamp duty guidance",
      "Registration support",
      "Dispute-preventing clauses",
    ],
  }),
  def({
    slug: "partnership-deed",
    name: "Partnership Deed",
    category: "funding",
    group: "Legal Drafting",
    short: "Define roles, capital and profit shares before disputes arise.",
    description:
      "A deed that captures capital contributions, profit ratios, duties and exit terms — the document that keeps partnerships friendly.",
    timeline: "2–3 working days",
    highlights: [
      "Capital and profit terms",
      "Exit and dissolution clauses",
      "Dispute resolution mechanism",
      "Registration assistance",
    ],
  }),
  def({
    slug: "share-purchase-agreement",
    name: "Share Purchase Agreement",
    category: "funding",
    group: "Legal Drafting",
    short: "Buy or sell equity with every risk papered.",
    description:
      "Warranties, indemnities, conditions precedent and payment mechanics drafted to protect you on either side of a share transfer.",
    timeline: "3–5 working days",
    highlights: [
      "Warranties and indemnities",
      "Payment and escrow mechanics",
      "Conditions precedent",
      "Negotiation support",
    ],
  }),
  def({
    slug: "shareholders-agreement",
    name: "Shareholders' Agreement",
    category: "funding",
    group: "Legal Drafting",
    short: "The rulebook between founders and investors.",
    description:
      "Board rights, transfer restrictions, tag/drag provisions and reserved matters — the agreement that governs how owners coexist.",
    timeline: "3–5 working days",
    highlights: [
      "Board and voting rights",
      "Tag-along and drag-along",
      "Anti-dilution provisions",
      "Deadlock resolution",
    ],
  }),
  def({
    slug: "term-sheet-review",
    name: "Term Sheet Review",
    category: "funding",
    group: "Legal Drafting",
    short: "Know exactly what you're signing before you sign it.",
    description:
      "A clause-by-clause review of your investor term sheet with plain-English explanations and negotiation recommendations.",
    timeline: "1–2 working days",
    highlights: [
      "Clause-by-clause analysis",
      "Market-standard benchmarking",
      "Negotiation recommendations",
      "Call with a lawyer included",
    ],
  }),
  def({
    slug: "founders-agreement",
    name: "Founders Agreement",
    category: "funding",
    group: "Legal Drafting",
    short: "Settle equity, vesting and roles on day one.",
    description:
      "Equity splits, vesting schedules, IP assignment and exit terms agreed while everyone is still friends — the startup's most underrated document.",
    timeline: "2–4 working days",
    highlights: [
      "Equity split and vesting",
      "IP assignment to the company",
      "Roles and responsibilities",
      "Founder exit terms",
    ],
  }),

  /* ---------------- NGO ------------------------------------------------ */
  def({
    slug: "trust-registration",
    name: "Trust Registration",
    category: "ngo",
    group: "NGO",
    short: "Register a charitable trust with a watertight deed.",
    description:
      "We draft your trust deed, register it with the sub-registrar and set up the PAN and bank account so you can start operations.",
    timeline: "10–15 working days",
    highlights: [
      "Trust deed drafted by lawyers",
      "Sub-registrar filing",
      "PAN and bank account setup",
      "12A / 80G guidance",
    ],
  }),
  def({
    slug: "society-registration",
    name: "Society Registration",
    category: "ngo",
    group: "NGO",
    short: "A democratic member-run structure for social causes.",
    description:
      "For education, art, charity and community causes — we draft the memorandum and bylaws and register your society with the state registrar.",
    timeline: "15–25 working days",
    highlights: [
      "Memorandum and bylaws drafted",
      "State registrar filing",
      "Minimum 7 members",
      "Annual compliance guidance",
    ],
  }),
  def({
    slug: "section-8-ngo",
    name: "Section 8 Company (NGO)",
    category: "ngo",
    group: "NGO",
    short: "The most credible structure for serious non-profits.",
    description:
      "A Section 8 company under the Companies Act gives your non-profit corporate governance, national recognition and the strongest donor credibility.",
    timeline: "15–20 working days",
    highlights: [
      "Company-grade governance",
      "Strongest donor credibility",
      "12A and 80G eligibility",
      "No minimum capital",
    ],
  }),
];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export const getCategory = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)!;

export const servicesByCategory = (slug: CategorySlug) =>
  services.filter((s) => s.category === slug);

export const groupsInCategory = (slug: CategorySlug) => {
  const seen = new Map<string, Service[]>();
  for (const s of servicesByCategory(slug)) {
    const list = seen.get(s.group) ?? [];
    list.push(s);
    seen.set(s.group, list);
  }
  return [...seen.entries()].map(([group, items]) => ({ group, items }));
};

export const featuredServices = [
  "private-limited-company",
  "gst-registration",
  "trademark-search",
  "msme-udyam-registration",
  "business-loans",
  "income-tax-filing",
].map((slug) => getService(slug)!);

const joinList = (items: string[]) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
    : items[0];

