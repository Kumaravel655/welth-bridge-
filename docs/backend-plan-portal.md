# WealthBridge — Client Portal Backend Plan (Login + Booking)

Status: proposal · Last updated: 2026-07-12
Companion to [`backend-plan.md`](./backend-plan.md), which covers the public
(unauthenticated) surfaces — contact, newsletter capture, uploads, search,
reviews, compliance calendar. **This document covers the logged-in world**:
client accounts and what a client or admin does after signing in.

> **Scope (confirmed 2026-07-12):** No OTP, no online payments. Login is plain
> **email + password**. Clients **request services and book consultations**;
> the team collects payment offline (call / in person). This removes the two
> heaviest pieces from the earlier draft — SMS OTP + TRAI DLT registration, and
> Razorpay orders/webhooks/invoices — so the build is meaningfully smaller.

---

## 1. What we're building

A member area where a client signs in once and can:

1. **Sign up / log in** — email + password, with email-based password reset.
2. **Request a service** — pick from the catalogue, describe the need, submit.
   The team follows up (and arranges payment offline).
3. **Book a consultation** — pick a date/slot with the team, after login.
4. **Message the team** — a thread per request, replacing scattered phone/
   WhatsApp follow-ups.
5. **See their stuff** — requests, bookings, and shared documents in one
   dashboard.

And an **admin** side where staff can:

6. **See all clients** — every signed-up user with **name, email, and phone
   number**, when they joined, and how many requests / consultations each has.
   Click a client to see everything they've done.
7. **See all consultations booked** — one table of every booking (which client,
   contact details, service, date/slot, mode, status) with filters.
8. **Manage the pipeline** — see incoming service requests, assign an owner,
   move status, reply in the thread.
9. **Publish a newsletter** — compose once, send to confirmed subscribers.

The existing `POST /api/contact` and `POST /api/newsletter` (email-only, no DB)
keep working for anonymous visitors. This plan adds a database and the
authenticated layer on top; nothing already shipped breaks.

---

## 2. Stack decisions (with reasoning)

| Concern | Choice | Why |
|---|---|---|
| Runtime | Next.js 15 route handlers + Server Actions on Vercel | No separate backend server; matches the existing app |
| Database | **Postgres** (Neon or Supabase free tier) + **Drizzle ORM** | Serverless-friendly, typed, cheap to start; same as the companion plan |
| Auth | **Better Auth** (self-hosted, in our own DB) | 2026 default for self-hosted Next.js; ships email+password, sessions, email verification, password reset, and roles natively. Auth.js v5 now steers new projects here; Lucia is deprecated |
| Login method | **Email + password** | Simple and universally understood; no OTP, no SMS vendor, no DLT |
| Password reset | Email link via existing **SMTP/nodemailer** | Reuses what already sends contact mail; no new vendor |
| Email | Existing **nodemailer/SMTP**, migrate to **Resend** when volume grows | Already wired; reused for verification, reset, notifications, newsletters |
| File storage | **Cloudflare R2** presigned URLs (from companion plan) | Private bucket; uploads go browser → R2, server only signs |
| Validation | **Zod** on every route + Server Action | One schema, reused client + server |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`) | Per-IP limits on login + public POSTs (brute-force protection) |
| Authorization | Better Auth session + a `role` column (`client` \| `admin`) | Middleware gates `/portal/*` and `/admin/*` |

**Why not Clerk / Auth0?** Both are hosted and priced per active user.
Self-hosted Better Auth keeps client PII in our own Postgres (cleaner for the
DPDP Act) and costs nothing beyond the database.

---

## 3. Data model

Better Auth manages the first four tables (its schema; we extend `user` with a
couple of columns). The rest are ours.

```
# — Auth (Better Auth managed) —
user               id, name, email (unique), email_verified,
                   phone (required),          # collected at signup so admin has it
                   role (client|admin) default client,
                   created_at, updated_at
account            id, user_id → user, password_hash, ...   (credentials)
session            id, user_id → user, token, expires_at, ip, user_agent
verification       id, identifier, value, expires_at   (email-verify + reset tokens)

# — Portal domain (ours) —
service_requests   id, user_id → user, service_slug, title, details,
                   status (submitted|in_review|in_progress|needs_docs|
                           completed|cancelled),
                   assigned_admin_id → user, created_at, updated_at

consultations      id, user_id → user, service_slug?, request_id?→service_requests,
                   preferred_date, slot, mode (call|video|office),
                   status (requested|confirmed|completed|cancelled),
                   meeting_link?, notes, created_at

messages           id, request_id → service_requests, sender_id → user,
                   sender_role (client|admin), body, attachments jsonb?,
                   read_at?, created_at

client_documents   id, user_id → user, request_id?, storage_key, original_name,
                   mime, size_bytes, direction (client_upload|admin_share),
                   created_at

# — Marketing / admin —
subscribers        id, email (unique), phone?, source, tags text[],
                   status (pending|confirmed|unsubscribed),
                   confirm_token, created_at, confirmed_at
newsletters        id, subject, body_mdx, status (draft|scheduled|sending|sent),
                   scheduled_for?, sent_at?, audience_filter jsonb,
                   created_by → user, created_at
newsletter_sends   id, newsletter_id → newsletters, subscriber_id → subscribers,
                   status (queued|sent|failed|bounced), sent_at?, error?
```

Design notes:
- **One identity, two roles.** A client and an admin are both rows in `user`,
  separated by `role`. No second user system to maintain.
- **`service_requests` is the spine.** Consultations, messages, and documents
  all optionally hang off a request, so the client dashboard and the admin
  pipeline are just different views of the same rows.
- **No `payments`/`invoices` tables** — payment is handled offline. If online
  payment is ever added later, it slots in against `service_requests` without
  reshaping anything here.
- **`subscribers` is shared** with the anonymous newsletter capture (companion
  plan) — the admin's newsletter simply sends to `status='confirmed'`.

---

## 4. Authentication design

### Login / signup (email + password)

```
Sign up:  name + email + phone + password
      → POST /api/auth/sign-up  → create user (role=client), hash password,
                                   store phone, send email-verification link
      → client clicks link → email_verified = true

Log in:   email + password
      → POST /api/auth/sign-in  → verify hash → issue httpOnly session cookie
      → redirect to /portal (or /admin if role=admin)

Forgot password:
      → POST /api/auth/forgot   → email a reset link (token in `verification`)
      → reset form → POST /api/auth/reset → set new hash, invalidate token
```

- **Passwords** are hashed by Better Auth (scrypt by default) — we never store
  or log plaintext. Minimum length + basic strength check on the form.
- **Email verification** before a request can be submitted keeps the list clean
  and confirms the address the team will reply to.
- **Sessions**: httpOnly, Secure, SameSite=Lax cookie; 30-day rolling expiry;
  server-side session rows so we can revoke. No token in localStorage.
- **Rate limiting** on `/sign-in`, `/forgot`, `/reset` (per-IP + per-email) to
  blunt brute-force and reset-spam.

### Authorization

- **Middleware** (`middleware.ts`): `/portal/*` requires a session; `/admin/*`
  requires a session **and** `role='admin'`. Unauthenticated → redirect to
  `/login?next=…`.
- **Route handlers / Server Actions** re-check the session server-side (never
  trust middleware alone for data) and scope every query by `user_id`, so a
  client can only ever read their own rows.
- **Admin bootstrap**: the first admin is set by a seed script / manual DB
  update. Admins can promote others from the admin UI later.

---

## 5. API surface

Conventions (inherited from the companion plan): Zod-validated input → `400`
with field errors; per-IP/per-user rate limits → `429`; JSON `{ ok: true }` /
`{ ok: false, error }`; secrets in env only; every authenticated query scoped
by session `user_id`. Portal mutations can be **Server Actions**; anything a
third party calls (none needed now) stays a route handler.

### Auth (`/api/auth/*` — Better Auth built-ins)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/sign-up` | POST | Create account, send verification email |
| `/api/auth/sign-in` | POST | Email + password → session |
| `/api/auth/forgot` | POST | Send password-reset link |
| `/api/auth/reset` | POST | Set new password from token |
| `/api/auth/session` | GET | Current user + role (for client-side gating) |
| `/api/auth/sign-out` | POST | Revoke session |

### Client portal (`/api/portal/*` — session required)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/portal/me` | GET | Profile + counts (open requests, upcoming consults) |
| `/api/portal/requests` | GET / POST | List own requests / create a new service request |
| `/api/portal/requests/[id]` | GET / PATCH | Detail + status timeline / edit a draft, cancel |
| `/api/portal/requests/[id]/messages` | GET / POST | Read/append to the team thread |
| `/api/portal/consultations` | GET / POST | List own bookings / **book a consultation** |
| `/api/portal/consultations/slots` | GET | `?date=` → open slots (working hours − booked) |
| `/api/portal/documents/presign` | POST | Presigned R2 PUT for a client upload |

### Admin (`/api/admin/*` — session + role=admin)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/users` | GET | **All signed-up clients** — name, email, phone, joined date, verified?, request/consultation counts. Supports `?q=` search (name/email/phone) + pagination |
| `/api/admin/users/[id]` | GET | One client's full profile + their requests, consultations, and message history |
| `/api/admin/consultations` | GET / PATCH | **All bookings** (client name + email + phone, service, date/slot, mode, status); confirm/reschedule + attach meeting link |
| `/api/admin/requests` | GET | Pipeline: filter by status / owner / service |
| `/api/admin/requests/[id]` | PATCH | Assign owner, set status |
| `/api/admin/requests/[id]/messages` | POST | Reply in the client thread |
| `/api/admin/newsletters` | GET / POST | List / create a newsletter draft |
| `/api/admin/newsletters/[id]/send` | POST | Enqueue send to confirmed subscribers (batched) |
| `/api/admin/subscribers` | GET | Subscriber list + tags + status |

**Newsletter sending** writes `newsletter_sends` rows and dispatches in batches
via a background job (Vercel Cron drains the queue). Every email carries an
unsubscribe link that flips `subscribers.status='unsubscribed'` — required for
DPDP / anti-spam compliance.

### Admin console — what staff see

The `/admin` area is a few tables backed by the endpoints above. Every row is
scoped so admins see **all** clients' data (unlike `/portal/*`, which is
scoped to the logged-in user only).

**Clients** (`/admin/users`) — the "see everyone who signed up" screen:

| Name | Email | Phone | Joined | Verified | Requests | Consults |
|---|---|---|---|---|---|---|
| Priya S. | priya@… | +91 98… | 12 Jul 2026 | ✓ | 2 | 1 |

- Search box (name / email / phone), sort by joined date, filter by verified.
- Row click → **client detail**: contact info + a timeline of their requests,
  every consultation they booked (with status), and their message threads.
- Export to CSV (optional) for offline follow-up.

**Consultations** (`/admin/consultations`) — the "see all bookings" screen:

| Client | Phone | Service | Date | Slot | Mode | Status | Action |
|---|---|---|---|---|---|---|---|
| Priya S. | +91 98… | GST Registration | 20 Jul | 11:00 | Call | Requested | Confirm ▸ |

- Filter by status (requested / confirmed / completed / cancelled) and by
  date range; default view = upcoming, requested-first.
- "Confirm" sets status and attaches a meeting link (video) or note; the
  client sees the update in their portal and gets an email.

**Requests** (`/admin/requests`) — pipeline board grouped by status, each card
showing client + service + assigned owner; open a card to change status,
assign an owner, and reply in the thread.

**Newsletters** (`/admin/newsletters`) — draft list + compose + send, with
per-send delivery counts.

A small **dashboard home** (`/admin`) shows the headline numbers: total
clients, new signups this week, upcoming consultations, and open requests —
each linking into the tables above.

---

## 6. Key end-to-end flows

**Request a service**
```
/portal → "Request a service" → pick service + describe need
  → POST /api/portal/requests            (status: submitted)
  → admin notified by email; picks it up in /admin, assigns owner, sets status
  → client sees status + can message the team; payment arranged offline
```

**Book a consultation (post-login)**
```
/portal → "Book consultation" → GET /slots?date= → pick slot
  → POST /api/portal/consultations       (status: requested)
  → admin confirms + adds meeting link (PATCH) → client sees "Confirmed"
  → reminder email before the slot
```

**Admin newsletter**
```
/admin/newsletters → compose → save draft
  → "Send" → enqueue newsletter_sends for confirmed subscribers
  → cron/batch worker sends, marks each row sent/failed
  → /admin shows delivery counts
```

---

## 7. Compliance & housekeeping

- **DPDP Act basics**: explicit consent copy on signup, purpose limitation,
  unsubscribe in every marketing email, a data-deletion path, and no PII in
  logs. Store only what the service needs.
- **No SMS / DLT** and **no payment-gateway** obligations in this scope — both
  were the heaviest external dependencies and are now out.
- **Data hygiene**: delete rejected/expired uploads after 30 days; honour
  unsubscribe immediately.

---

## 8. New environment variables

```
# Database
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=                 # e.g. https://www.thewealthbridge.in

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# File storage (Cloudflare R2) — shared with companion plan, optional until P4
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=wealthbridge-uploads

# (email verification / reset / notifications reuse existing SMTP_* vars)
```

Add these to `.env.example` (already in the repo) as empty keys. Note there are
**no** MSG91 or Razorpay secrets any more.

---

## 9. Build phases & rough effort

| Phase | Scope | Effort |
|---|---|---|
| P0 | Postgres + Drizzle + Better Auth wired; `user`/session tables; `.env.example`; email+password login + verification + reset working end-to-end | 2–3 days |
| P1 | Client portal shell: middleware gating, `/portal` dashboard, profile, **request a service** (create + list + detail + status) | 3–4 days |
| P2 | **Consultation booking** after login: slots, booking, admin confirm + meeting link, reminders | 2–3 days |
| P3 | **Team messaging** thread per request (client ↔ admin) + document sharing (R2) | 3 days |
| P4 | **Admin console**: Clients table (all signups + email/phone + detail), Consultations table (all bookings), requests pipeline board, subscribers, **newsletter compose + batched send**, dashboard home | 4–5 days |

Roughly **2–3 weeks** of focused work — noticeably less than the OTP+payments
version, since there's no SMS vendor, no DLT wait, and no Razorpay
order/webhook/invoice layer.

---

## 10. Decisions I'd like you to confirm

Reasonable defaults are chosen above; flag any you want changed:

1. **Login** — email + password (with email reset). Or would you rather a
   "magic link" login (click a link in email, no password to remember)? Both
   avoid OTP; password is more familiar, magic-link is lower-support.
2. **Consultation slots** — from a fixed weekly working-hours config (e.g.
   Mon–Sat 10:00–18:00, 30-min slots)? Give me the real hours and I'll seed them.
3. **Newsletter authoring** — MDX editor, or a simpler rich-text box?
4. **Postgres host** — Neon (leaner) vs Supabase (bundles storage too)?

Everything else follows the plan above. Say the word and I'll start P0.

---

*This plan is intentionally additive: the public site and its email-only
contact/newsletter routes keep working. The portal introduces the database and
the authenticated layer on a Postgres + Drizzle (+ optional R2) foundation —
no SMS, no payment gateway.*
