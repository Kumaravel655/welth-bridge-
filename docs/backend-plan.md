# WealthBridge — Backend Services & API Plan

Status: proposal · Last updated: 2026-07-11

The site today is a Next.js 15 App Router frontend with exactly one backend
surface: `POST /api/newsletter`, which forwards signups to the admin inbox via
SMTP (no database). This plan takes the feature list in the redesign brief and
turns it into a phased backend, staying inside Next.js route handlers (no
separate backend server) until the client portal genuinely needs one.

---

## 1. Architecture at a glance

```
Browser ──► Next.js (Vercel)
              ├── Route handlers  /api/*          (all backend logic)
              ├── Postgres        (Neon / Supabase)   — leads, bookings, subscribers, payments
              ├── Object storage  (Cloudflare R2 / Supabase Storage) — document uploads
              ├── Razorpay        — payments (orders + webhooks)
              ├── SMTP / Resend   — transactional email (already wired via nodemailer)
              ├── Google Places API — reviews (cached)
              └── WhatsApp        — wa.me deep links now; Cloud API later
```

**Key decisions**

| Concern | Choice | Why |
|---|---|---|
| Runtime | Next.js route handlers on Vercel | Zero extra infra; the team already deploys this app |
| Database | Postgres (Neon free tier) + Drizzle ORM | Serverless-friendly, typed schema, cheap to start |
| Validation | Zod on every route | One schema per endpoint, reused for client-side forms |
| File storage | Cloudflare R2 via presigned URLs | Uploads never transit the Next.js server; S3-compatible |
| Payments | Razorpay | Standard for Indian SMB payments (UPI, cards, netbanking) |
| Email | Keep nodemailer/SMTP; migrate to Resend when volume grows | Already working |
| Spam control | Honeypot field + Cloudflare Turnstile + rate limiting | Compliance-lead forms attract heavy bot traffic |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) | Works on serverless; per-IP limits on all public POSTs |
| Auth (portal, Phase 5) | Auth.js v5, email/phone OTP | No passwords to manage for non-technical clients |

**Blog stays file-based (MDX in repo) for now.** `src/lib/blog.ts` already
exists; publishing via git is fine while the team is small and it's the best
possible SEO setup (fully static). Revisit a headless CMS (Payload/Sanity)
only when non-developers must publish — the reading APIs below don't change.

---

## 2. Database schema (Phase 1–4 tables)

```
leads             id, name, email, phone, service_slug, message, source_page,
                  utm_*, status (new|contacted|qualified|converted|closed),
                  created_at

consultations     id, lead_id → leads, service_slug, preferred_date,
                  preferred_slot, mode (call|video|office), status
                  (requested|confirmed|completed|cancelled), notes, created_at

subscribers       id, email (unique), source, status (pending|confirmed|
                  unsubscribed), confirm_token, created_at, confirmed_at

uploads           id, lead_id → leads, storage_key, original_name, mime,
                  size_bytes, status (pending|scanned|rejected), created_at

payments          id, lead_id, razorpay_order_id, razorpay_payment_id,
                  service_slug, amount_paise, currency, status
                  (created|paid|failed|refunded), receipt_no, created_at

reviews_cache     id, source (google), payload jsonb, fetched_at

compliance_events id, title, description, due_date, category (gst|itr|tds|
                  roc|other), recurrence, applies_to
```

Phase 5 adds `users`, `client_documents`, `service_requests`, `invoices`.

---

## 3. API plan by phase

Conventions for every endpoint: Zod-validated body → `400` with field errors;
per-IP rate limit → `429`; honeypot silently accepted-and-dropped; JSON
responses `{ ok: true, ... }` / `{ ok: false, error }`; secrets only via env.

### Phase 1 — Lead capture (build first; this is the business)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Contact form: validate → insert `leads` → email notify admin → return WhatsApp deep link for instant follow-up |
| `/api/newsletter` | POST | Upgrade existing route: insert `subscribers` (dedupe), send double-opt-in confirmation link, keep admin notification |
| `/api/newsletter/confirm` | GET | Token click → mark subscriber confirmed |
| `/api/consultations` | POST | Booking form: service + preferred date/slot + contact → insert `leads` + `consultations` → notify admin |
| `/api/consultations/slots` | GET | `?date=` → available slots from a config of working hours minus booked slots |

Payloads (representative):

```jsonc
// POST /api/contact
{ "name": "…", "email": "…", "phone": "…", "service": "gst-registration",
  "message": "…", "sourcePage": "/services/gst-registration",
  "website": "" }   // ← honeypot, must be empty

// POST /api/consultations
{ "name": "…", "phone": "…", "email": "…", "service": "trademark-registration",
  "date": "2026-07-20", "slot": "11:00", "mode": "call" }
```

Every lead row records `source_page` + UTM params — this is what makes the
SEO landing pages measurable ("which page produced which enquiry").

### Phase 2 — Document upload

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/uploads/presign` | POST | `{ filename, mime, size, leadId? }` → validate (pdf/jpg/png/xlsx, ≤ 10 MB) → presigned R2 PUT URL + `uploads` row |
| `/api/uploads/complete` | POST | Client confirms upload → mark row, notify admin with download link |

Files go browser → R2 directly; the server only signs. Storage keys are
random UUIDs (never user filenames). Admin download links are short-lived
signed GET URLs — the bucket is fully private.

### Phase 3 — Payments (Razorpay)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/payments/order` | POST | `{ serviceSlug, name, email, phone }` → price looked up **server-side** from the service catalogue → create Razorpay order → return `order_id` + key for checkout.js |
| `/api/payments/webhook` | POST | Razorpay webhook: verify `X-Razorpay-Signature` (HMAC), idempotent update of `payments`, send receipt email |
| `/api/payments/[orderId]/status` | GET | Polling target for the "payment success" page |

Rules: amounts are never taken from the client; webhook is the source of
truth (not the browser redirect); webhook handler must be idempotent because
Razorpay retries.

### Phase 4 — Content, search & trust signals

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/search` | GET | `?q=` → search services + blog + tools from a FlexSearch index built at deploy time from `src/lib/{services,blog,tools}.ts` — no DB needed |
| `/api/reviews` | GET | Google Places reviews via `reviews_cache`, refreshed at most daily (cron or stale-while-revalidate) — never call Google per page view |
| `/api/compliance-calendar` | GET | `?month=2026-08` → events from `compliance_events` (seeded from a versioned JSON of GST/ITR/TDS/ROC due dates) |
| `/api/compliance-calendar/subscribe` | POST | Email + categories → reuses `subscribers` with tags; a weekly Vercel Cron job emails upcoming deadlines |

The deadline-reminder email is a genuine retention/lead hook for a compliance
firm — cheap to build once the calendar data exists.

### Phase 5 — Client portal (future-ready; design now, build later)

Auth.js v5 with email/phone OTP. Portal endpoints under `/api/portal/*`,
gated by session middleware:

```
GET  /api/portal/me                    profile + engaged services
GET  /api/portal/requests              service requests + status timeline
POST /api/portal/requests              raise a new service request
GET  /api/portal/documents             docs shared both directions
POST /api/portal/documents/presign     client uploads (same R2 flow as Phase 2)
GET  /api/portal/invoices              invoices + payment status (joins payments)
```

"Future-ready" concretely means Phase 1–3 already do the hard part: `leads`
keyed by email/phone (becomes `users`), uploads linked to leads (become
client documents), payments linked to leads (become invoices). The portal is
mostly UI + auth on top of existing tables.

### Cross-cutting

- **Admin access:** start with the Neon/Supabase table UI + email
  notifications — do not build an admin panel in Phase 1. Add a minimal
  protected `/admin` (basic-auth or allowlisted Google login) in Phase 2–3
  for lead status updates.
- **Security:** all secrets in env (extend `.env.example`); security headers
  via `next.config` (`X-Frame-Options`, `Referrer-Policy`, CSP);
  no CORS needed (same-origin only); log request IDs, never log PII bodies.
- **Data hygiene:** delete rejected uploads after 30 days; honour
  unsubscribe links in every email (DPDP Act consent basics).
- **Testing:** each route gets a Zod-schema unit test + one happy-path and
  one abuse-path (rate limit / bad signature) integration test.

---

## 4. New environment variables

```
DATABASE_URL=                 # Neon Postgres
UPSTASH_REDIS_REST_URL=       # rate limiting
UPSTASH_REDIS_REST_TOKEN=
TURNSTILE_SECRET_KEY=         # spam protection (public sitekey goes in NEXT_PUBLIC_)
R2_ACCOUNT_ID=                # Phase 2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=wealthbridge-uploads
RAZORPAY_KEY_ID=              # Phase 3
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
GOOGLE_PLACES_API_KEY=        # Phase 4
GOOGLE_PLACE_ID=
AUTH_SECRET=                  # Phase 5
```

---

## 5. Build order & rough effort

| Phase | Scope | Effort |
|---|---|---|
| 0 | DB + Drizzle + rate-limit/Turnstile plumbing, extend `.env.example` | 1–2 days |
| 1 | Contact, newsletter upgrade, consultation booking + slots | 3–4 days |
| 2 | R2 presigned uploads + admin notification | 2 days |
| 3 | Razorpay order + webhook + receipts | 3 days |
| 4 | Search index, reviews cache, compliance calendar + reminder cron | 3–4 days |
| 5 | Client portal (auth, requests, documents, invoices) | 2–3 weeks, when prioritised |

Phases 1–4 total roughly **2–3 weeks** of focused work and cover every
feature in the brief except the portal, which is explicitly "future ready".
