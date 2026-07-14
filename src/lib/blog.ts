export type BlogCategorySlug =
  | "company-registration"
  | "gst-tax"
  | "trademark-ip"
  | "funding-finance"
  | "compliance-tips";

export type BlogCategory = { slug: BlogCategorySlug; title: string; tagline: string };

export const blogCategories: BlogCategory[] = [
  {
    slug: "company-registration",
    title: "Company Registration",
    tagline: "Choosing and setting up the right entity.",
  },
  {
    slug: "gst-tax",
    title: "GST & Tax",
    tagline: "Registration, filing and regime choices explained.",
  },
  {
    slug: "trademark-ip",
    title: "Trademark & IP",
    tagline: "Protecting your name, work and inventions.",
  },
  {
    slug: "funding-finance",
    title: "Funding & Finance",
    tagline: "Loans, investors and getting funding-ready.",
  },
  {
    slug: "compliance-tips",
    title: "Compliance Tips",
    tagline: "Staying on the right side of deadlines.",
  },
];

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; style: "bullet" | "number"; items: string[] }
  | { type: "callout"; tone: "info" | "warning" | "tip"; title?: string; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; detail: string }[] }
  | { type: "cta"; serviceSlug: string; label?: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: BlogCategorySlug;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  relatedServiceSlugs: string[];
  content: ContentBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: "private-limited-vs-llp-2026",
    title: "Private Limited Company vs LLP: Which Should You Register in 2026?",
    category: "company-registration",
    excerpt:
      "Both let you limit your personal liability, but they suit very different kinds of businesses. Here's how to choose without regretting it later.",
    publishedAt: "2026-05-12",
    relatedServiceSlugs: ["private-limited-company", "llp-registration", "one-person-company"],
    content: [
      {
        type: "paragraph",
        text: "Almost every founder we meet asks the same question in their first call: \"Private Limited or LLP?\" Both structures give you limited liability, but that's where the similarity ends. The right choice depends on whether you're planning to raise equity funding, how you want to split profits, and how much compliance you're willing to take on.",
      },
      { type: "heading", level: 2, text: "The core difference" },
      {
        type: "paragraph",
        text: "A Private Limited Company is owned by shareholders and run by directors — it can issue shares, which is what makes it the default choice for anyone planning to raise venture or angel funding. An LLP (Limited Liability Partnership) is owned and run by its partners directly, with profits shared as per the LLP agreement — no shares, no share capital, and lighter compliance.",
      },
      {
        type: "table",
        headers: ["", "Private Limited Company", "LLP"],
        rows: [
          ["Can raise equity funding", "Yes — can issue shares to investors", "No — no concept of shares"],
          ["Compliance load", "Higher — board meetings, ROC filings, audits above threshold", "Lower — annual return and statement of accounts only"],
          ["Ownership transfer", "Easy — transfer shares", "Requires partner consent, more paperwork"],
          ["Minimum members", "2 directors, 2 shareholders (can overlap)", "2 designated partners"],
          ["Best suited for", "Startups planning to raise funding or hire aggressively", "Professional services, family businesses, low-compliance operations"],
        ],
      },
      { type: "heading", level: 2, text: "When to pick a Private Limited Company" },
      {
        type: "list",
        style: "bullet",
        items: [
          "You plan to raise funding from angels or VCs in the next 1–2 years",
          "You want to offer ESOPs to attract early employees",
          "You're building something you may eventually want to sell or list",
          "You want the credibility that comes with a registered company for enterprise clients",
        ],
      },
      { type: "heading", level: 2, text: "When to pick an LLP" },
      {
        type: "list",
        style: "bullet",
        items: [
          "You're a services business (consulting, agencies, professional practices) with no funding plans",
          "You want lower annual compliance and filing costs",
          "You and your co-founders want flexible profit-sharing without share capital formalities",
          "You're not planning to bring in outside equity investors",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "You can convert later",
        text: "Many founders start as an LLP and convert to a Private Limited Company once they're ready to raise funding — it's a well-trodden path, not a dead end, if you choose LLP now and change your mind.",
      },
      { type: "cta", serviceSlug: "private-limited-company", label: "Compare costs and start your registration" },
    ],
  },
  {
    slug: "gst-registration-step-by-step-guide",
    title: "GST Registration: A Founder's Step-by-Step Guide",
    category: "gst-tax",
    excerpt:
      "GST registration trips up more founders than any other filing — not because it's hard, but because small document mismatches cause big delays. Here's how to get it right the first time.",
    publishedAt: "2026-05-20",
    relatedServiceSlugs: ["gst-registration", "gst-filing", "gst-advisory"],
    content: [
      {
        type: "paragraph",
        text: "GST registration is mandatory once your turnover crosses the threshold (₹40 lakh for goods, ₹20 lakh for services in most states — lower in special category states), or the moment you sell across state lines or on an e-commerce marketplace, regardless of turnover. Here's the process, start to finish.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Gather your documents",
            detail: "PAN, Aadhaar, address proof for your place of business, a cancelled cheque or bank statement, and your business constitution proof (incorporation certificate, partnership deed, etc.).",
          },
          {
            title: "Apply on the GST portal",
            detail: "Part A generates a Temporary Reference Number (TRN) after OTP verification; Part B is where you upload documents and details using that TRN.",
          },
          {
            title: "Verification",
            detail: "A GST officer may raise a query or ask for clarification — most clean applications are approved without one, but respond within 7 working days if asked.",
          },
          {
            title: "ARN and GSTIN",
            detail: "Once approved, you receive your GSTIN and registration certificate (Form GST REG-06), usually within 3–7 working days of a clean application.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "The single biggest cause of delay",
        text: "Address proof that doesn't clearly match the entity name — an electricity bill in a director's personal name, for instance, without a matching NOC. Always pair address proof with a signed NOC from the property owner when you don't own the premises.",
      },
      { type: "heading", level: 2, text: "After you're registered" },
      {
        type: "paragraph",
        text: "Registration is the easy part — the recurring commitment is monthly or quarterly filing (GSTR-1 and GSTR-3B), and reconciling input tax credit against GSTR-2B every period. Missed filings attract late fees and interest even at zero tax liability, so set a recurring reminder from day one.",
      },
      { type: "cta", serviceSlug: "gst-registration", label: "Get registered without the back-and-forth" },
    ],
  },
  {
    slug: "old-vs-new-tax-regime-fy2025-26",
    title: "Old vs New Tax Regime for FY 2025-26: How to Choose",
    category: "gst-tax",
    excerpt:
      "Budget 2025 raised the new regime's tax-free limit to ₹12 lakh, and that's changed the maths for a lot of taxpayers. Here's how to actually decide.",
    publishedAt: "2026-06-02",
    relatedServiceSlugs: ["income-tax-filing", "income-tax-notice"],
    content: [
      {
        type: "paragraph",
        text: "For FY 2025-26, the new tax regime is the default — you're automatically taxed under it unless you actively opt for the old regime. Following Budget 2025, income up to ₹12 lakh (₹12.75 lakh for salaried taxpayers, after the standard deduction) is effectively tax-free under the new regime because of the Section 87A rebate. That single change has made the new regime the better fit for a much larger group of taxpayers than before.",
      },
      { type: "heading", level: 2, text: "The trade-off, in one line" },
      {
        type: "paragraph",
        text: "The new regime gives you lower rates and a bigger rebate, but takes away almost every deduction — no 80C, no HRA, no home loan interest benefit. The old regime keeps those deductions but taxes you at higher rates on a smaller tax-free slab.",
      },
      {
        type: "table",
        headers: ["", "New Regime (FY 2025-26)", "Old Regime"],
        rows: [
          ["Tax-free income", "Up to ₹12L (₹12.75L salaried) via 87A rebate", "Up to ₹5L via 87A rebate"],
          ["Standard deduction", "₹75,000", "₹50,000"],
          ["80C, 80D, HRA, home loan interest", "Not allowed", "Allowed"],
          ["Best for", "Those with few deductions to claim", "Those with significant 80C/HRA/home loan claims"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Rule of thumb",
        text: "If your total eligible deductions (80C + 80D + HRA + home loan interest, etc.) add up to less than roughly ₹4–4.5 lakh a year, the new regime usually wins. Above that, run the numbers under both — it genuinely varies by individual.",
      },
      {
        type: "paragraph",
        text: "Salaried employees can switch between regimes every year when filing. If you have business or professional income, switching back to the old regime after opting for the new one comes with restrictions — decide carefully in that case, ideally with an advisor.",
      },
      { type: "cta", serviceSlug: "income-tax-filing", label: "Get your regime compared and filed correctly" },
    ],
  },
  {
    slug: "why-register-trademark-early",
    title: "Why Every Startup Should Register Its Trademark Early",
    category: "trademark-ip",
    excerpt:
      "Waiting until you're \"big enough\" to protect your brand name is the most common IP mistake founders make — and often the most expensive to undo.",
    publishedAt: "2026-06-15",
    relatedServiceSlugs: ["trademark-search", "respond-to-tm-objection"],
    content: [
      {
        type: "paragraph",
        text: "A trademark isn't a nice-to-have once you're established — it's the only thing standing between you and someone else registering your brand name first, forcing a rebrand after you've already spent on signage, packaging and marketing.",
      },
      { type: "heading", level: 2, text: "What's actually at risk" },
      {
        type: "list",
        style: "bullet",
        items: [
          "A competitor or squatter registers your name first, and you receive a cease-and-desist instead of sending one",
          "You can't stop a copycat using a confusingly similar name in your industry",
          "Marketplaces (Amazon, Flipkart) require a registered trademark to enroll in brand protection programs",
          "Investors increasingly ask about IP protection during due diligence — an unregistered core brand is a flag",
        ],
      },
      { type: "heading", level: 2, text: "The process, briefly" },
      {
        type: "steps",
        items: [
          {
            title: "Search first",
            detail: "A proper registry and common-law search tells you if your name is even available before you fall in love with it.",
          },
          {
            title: "File in the right class",
            detail: "Trademarks are registered per class of goods/services (45 classes total) — filing in the wrong class protects nothing.",
          },
          {
            title: "Respond to examination",
            detail: "Most applications get an examiner's objection — this is routine, not a rejection, and a reasoned response usually resolves it.",
          },
          {
            title: "Registration",
            detail: "If unopposed after publication, your mark is registered — typically 12–18 months from filing, though you get \"TM\" usage rights from the filing date itself.",
          },
        ],
      },
      {
        type: "quote",
        text: "The best time to register your trademark was before you launched. The second-best time is now.",
      },
      { type: "cta", serviceSlug: "trademark-search", label: "Check if your name is safe to register" },
    ],
  },
  {
    slug: "funding-options-beyond-bank-loans",
    title: "5 Funding Options for Indian Startups Beyond Bank Loans",
    category: "funding-finance",
    excerpt:
      "A bank loan isn't always the right — or even available — first move. Here's the fuller menu, and which stage each option actually fits.",
    publishedAt: "2026-06-22",
    relatedServiceSlugs: ["fundraising", "pitch-deck", "cma-report", "business-loans"],
    content: [
      {
        type: "paragraph",
        text: "Most first-time founders default to \"apply for a business loan\" the moment they need capital — but banks want revenue history and often collateral, which pre-revenue and early-stage businesses simply don't have yet. Here's what else is actually on the table.",
      },
      { type: "heading", level: 2, text: "1. Government schemes" },
      {
        type: "paragraph",
        text: "The Startup India Seed Fund, MUDRA loans and Stand-Up India are built specifically for very early-stage and small businesses, many without requiring collateral. They're underused simply because founders don't know where to start the application.",
      },
      { type: "heading", level: 2, text: "2. Collateral-free MSME loans (CGTMSE)" },
      {
        type: "paragraph",
        text: "Once you have some revenue history and are Udyam-registered, the Credit Guarantee Fund Trust for Micro and Small Enterprises backs collateral-free working capital loans through participating banks and NBFCs.",
      },
      { type: "heading", level: 2, text: "3. Angel investors" },
      {
        type: "paragraph",
        text: "For idea-stage and early-revenue businesses open to giving up equity, angel investors move faster than institutional VCs and often bring hands-on mentorship along with the cheque.",
      },
      { type: "heading", level: 2, text: "4. Venture capital" },
      {
        type: "paragraph",
        text: "Once you have real traction and are looking for growth capital rather than working capital, VCs become a realistic option — but they expect a polished pitch deck, clean financials and a credible growth story.",
      },
      { type: "heading", level: 2, text: "5. Loan against property" },
      {
        type: "paragraph",
        text: "If you or the business have property to offer as security, this route unlocks larger ticket sizes and meaningfully lower interest rates than unsecured business loans.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Not sure which fits you?",
        text: "Our free Funding Eligibility Checker asks five questions about your stage, revenue and collateral, and points you to the routes worth pursuing.",
      },
      { type: "cta", serviceSlug: "fundraising", label: "Get funding-ready with our team" },
    ],
  },
  {
    slug: "roc-annual-compliance-calendar-explained",
    title: "Your Annual ROC Compliance Calendar: Never Miss a Deadline",
    category: "compliance-tips",
    excerpt:
      "Missing an ROC due date isn't just a late fee — it can mean director disqualification. Here's every deadline your private limited company needs to track.",
    publishedAt: "2026-06-28",
    relatedServiceSlugs: ["roc-annual-filing", "digital-signature-certificate"],
    content: [
      {
        type: "paragraph",
        text: "Every private limited company and LLP in India has a fixed set of annual filings with the Registrar of Companies — and unlike tax filings, these due dates barely change year to year. Missing them compounds: late fees accrue daily, and repeated defaults can lead to director disqualification.",
      },
      {
        type: "table",
        headers: ["Filing", "Due date", "What it covers"],
        rows: [
          ["DIR-3 KYC", "30 September", "Annual KYC for every director with a DIN"],
          ["Form ADT-1", "Within 15 days of AGM", "Appointment or ratification of the statutory auditor"],
          ["AGM", "By 30 September", "Adoption of financial statements by shareholders"],
          ["Form AOC-4", "Within 30 days of AGM", "Filing of financial statements with the ROC"],
          ["Form MGT-7 / MGT-7A", "Within 60 days of AGM", "Annual return of the company"],
          ["Income tax return", "31 October (if audit applicable)", "Company's annual income tax filing"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "What happens if you miss one",
        text: "Late filing fees for AOC-4 and MGT-7 run into ₹100 per day, per form, with no upper cap — a filing that's 90 days late can cost more in penalties than the professional fee for filing it on time would have.",
      },
      { type: "heading", level: 2, text: "Keeping it simple" },
      {
        type: "list",
        style: "bullet",
        items: [
          "Set calendar reminders 3 weeks before each due date, not on the day",
          "Keep your Digital Signature Certificate (DSC) renewed — an expired DSC is the most common last-minute filing blocker",
          "Hold your AGM on time even if the financials aren't fully finalised — you can still adopt provisional figures with auditor sign-off in most cases",
          "Assign one person (internal or your compliance firm) to own the calendar — shared ownership is how deadlines get missed",
        ],
      },
      { type: "cta", serviceSlug: "roc-annual-filing", label: "Put your annual filings on autopilot" },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const getBlogCategory = (slug: BlogCategorySlug) =>
  blogCategories.find((c) => c.slug === slug);

export const postsByCategory = (slug: BlogCategorySlug) =>
  posts.filter((p) => p.category === slug);

export const relatedPosts = (post: BlogPost, limit = 3) =>
  posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, limit);

const WORDS_PER_MINUTE = 200;

function blockWordCount(block: ContentBlock): number {
  switch (block.type) {
    case "paragraph":
    case "quote":
      return block.text.split(/\s+/).length;
    case "heading":
      return block.text.split(/\s+/).length;
    case "list":
      return block.items.join(" ").split(/\s+/).length;
    case "callout":
      return block.text.split(/\s+/).length;
    case "table":
      return block.rows.flat().join(" ").split(/\s+/).length;
    case "steps":
      return block.items.map((i) => `${i.title} ${i.detail}`).join(" ").split(/\s+/).length;
    case "cta":
    case "image":
      return 0;
  }
}

export function estimateReadingTime(content: ContentBlock[]): number {
  const words = content.reduce((sum, block) => sum + blockWordCount(block), 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export const featuredPosts = [...posts]
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  .slice(0, 3);
