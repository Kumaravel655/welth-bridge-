// Fetches a unique, topically-relevant photo for each service from the
// Openverse API (CC-licensed, no key) and saves it to public/images/services.
// Falls back to a deterministic picsum photo if a search yields nothing usable,
// so every service always ends up with an image. Run: node scripts/fetch-service-images.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "services");
fs.mkdirSync(OUT, { recursive: true });

// slug -> search query (tuned for professional / on-brand imagery)
const ITEMS = [
  // Company Registration
  ["private-limited-company", "corporate business meeting office"],
  ["one-person-company", "entrepreneur working laptop desk"],
  ["partnership-firm", "business partners handshake"],
  ["llp-registration", "office teamwork collaboration"],
  ["public-limited-company", "corporate skyscraper glass building"],
  ["producer-company", "farmers agriculture cooperative field"],
  ["nidhi-company", "savings coins finance money"],
  ["section-8-company", "charity nonprofit volunteers"],
  ["proprietorship-registration", "small business owner shop counter"],
  ["company-name-search", "business research laptop computer"],
  // Licensing
  ["fssai-food-license", "restaurant kitchen chef food"],
  ["trade-license", "retail store shop front"],
  ["msme-udyam-registration", "small factory manufacturing worker"],
  ["import-export-code", "shipping containers cargo port"],
  ["dot-osp-registration", "call center headset customer support"],
  ["iso-certification", "quality control inspection factory"],
  ["apeda-certification", "agriculture export fresh produce"],
  ["rera-project-registration", "construction building site crane"],
  ["rera-agent-registration", "real estate agent house sale"],
  ["digital-signature-certificate", "signing document laptop pen"],
  // Accounting & Tax
  ["accounting-and-bookkeeping", "accountant bookkeeping workplace"],
  ["payroll-maintenance", "office human resources team meeting"],
  ["tds-return-filing", "tax forms paperwork calculator"],
  ["income-tax-filing", "tax return filing paperwork"],
  // GST
  ["gst-registration", "business invoice billing tax"],
  ["gst-filing", "spreadsheet financial data screen"],
  ["gst-advisory", "financial advisor consultation meeting"],
  // Income Tax
  ["income-tax-notice", "official letter envelope document"],
  ["income-tax-assessment", "financial audit meeting"],
  // Annual Compliance
  ["roc-annual-filing", "document folders shelf archive"],
  ["company-name-change", "modern office building exterior"],
  ["registered-office-change", "moving office cardboard boxes"],
  ["add-directors", "boardroom executives meeting table"],
  ["remove-directors", "business meeting serious discussion"],
  ["increase-authorized-capital", "financial growth chart graph"],
  // Business Conversion
  ["pvt-ltd-to-llp", "business transition office professionals"],
  ["pvt-ltd-to-opc", "businessman working office"],
  ["proprietorship-to-llp", "business growth partners office"],
  ["proprietorship-to-pvt-ltd", "workplace office professionals"],
  // Trademark
  ["trademark-search", "brand logo design studio"],
  ["respond-to-tm-objection", "lawyer legal office"],
  // Copyright
  ["copyright-registration", "creative work books music studio"],
  // Patent
  ["patent", "invention laboratory research scientist"],
  ["patent-search", "technology innovation circuit board"],
  ["provisional-patent-application", "engineering blueprint design drafting"],
  ["permanent-patent", "science research laboratory microscope"],
  // Fundraising
  ["fundraising", "startup investment growth money"],
  ["pitch-deck", "business presentation pitch conference"],
  ["financial-report", "financial charts report analysis"],
  ["cma-report", "banking finance data analysis"],
  // Loans
  ["business-loans", "bank loan finance money"],
  ["home-loans", "house home keys new"],
  ["term-loans", "bank building finance columns"],
  ["loan-against-property", "property real estate house exterior"],
  ["cibil-score", "finance graph chart growth"],
  // Legal Drafting
  ["rental-agreement", "apartment building keys"],
  ["partnership-deed", "signing contract business partners"],
  ["share-purchase-agreement", "business contract signing pen"],
  ["shareholders-agreement", "corporate boardroom meeting people"],
  ["term-sheet-review", "reading paperwork office"],
  ["founders-agreement", "startup coworking workspace"],
  // NGO
  ["trust-registration", "charity helping hands donation"],
  ["society-registration", "community group people together"],
  ["section-8-ngo", "nonprofit volunteers charity work"],
];

const HEADERS = { "User-Agent": "WealthBridge/1.0 (+https://www.thewealthbridge.in)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Manifest lets re-runs skip images we already sourced from Openverse.
const MANIFEST = path.join(process.cwd(), "scripts", ".image-sources.json");
const manifest = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  : {};

async function searchOpenverse(q, used) {
  const url =
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}` +
    `&page_size=40&license_type=commercial&mature=false&extension=jpg`;
  // Retry with backoff — Openverse throttles anonymous bursts (429).
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: HEADERS });
    if (r.status === 429 || r.status >= 500) {
      await sleep(2500 * (attempt + 1));
      continue;
    }
    if (!r.ok) throw new Error(`openverse ${r.status}`);
    const j = await r.json();
    for (const res of j.results ?? []) {
      const u = res.url;
      if (u && !used.has(u) && /\.(jpe?g)(\?|$)/i.test(u)) return u;
    }
    return null;
  }
  throw new Error("openverse throttled");
}

async function download(url, dest) {
  const r = await fetch(url, { headers: HEADERS, redirect: "follow" });
  if (!r.ok) throw new Error(`download ${r.status}`);
  const type = r.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`not image: ${type}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 8000) throw new Error(`too small: ${buf.length}`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

// Seed the dedup set with URLs we already committed on prior runs.
const used = new Set(
  Object.values(manifest)
    .filter((m) => m.source === "openverse")
    .map((m) => m.url)
);
let okCount = 0;
let fbCount = 0;
let keptCount = 0;

for (const [slug, q] of ITEMS) {
  const dest = path.join(OUT, `${slug}.jpg`);

  // Keep a good topical image we already have — don't re-download.
  if (manifest[slug]?.source === "openverse" && fs.existsSync(dest)) {
    keptCount++;
    okCount++;
    continue;
  }

  let picked = null;
  try {
    picked = await searchOpenverse(q, used);
  } catch (e) {
    // ignore, fall back below
  }
  try {
    if (picked) {
      const size = await download(picked, dest);
      used.add(picked);
      manifest[slug] = { source: "openverse", url: picked };
      okCount++;
      console.log(`  ok   ${slug.padEnd(34)} ${(size / 1024) | 0}KB  (${q})`);
      await sleep(900);
      continue;
    }
    throw new Error("no result");
  } catch (e) {
    // fall through to picsum
  }
  // Fallback: deterministic, always-available photo
  try {
    const size = await download(`https://picsum.photos/seed/${slug}/1000/640`, dest);
    manifest[slug] = { source: "picsum", url: `picsum:${slug}` };
    fbCount++;
    console.log(`  FB   ${slug.padEnd(34)} ${(size / 1024) | 0}KB  (picsum fallback)`);
  } catch (e) {
    console.log(`  FAIL ${slug.padEnd(34)} ${e.message}`);
  }
  await sleep(400);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(
  `\nDone. ${ITEMS.length} services — ${okCount} topical (${keptCount} kept), ${fbCount} picsum fallback this run.`
);
