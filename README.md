# Build With Innocent — Flagship Website

Digital Business Systems for African Enterprises. This is the company's
lead-generation machine: conversion pages, free tools, a live demo, a
client portal, referral tracking, and a full lead pipeline (Supabase +
Resend + WhatsApp).

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** with the Build With Innocent brand theme
- **Supabase** (leads, assessments, subscribers, referrals, client portal)
- **Resend** (confirmation + welcome emails)
- **WhatsApp Cloud API** (new-lead and assessment notifications)
- **Vercel Analytics** + Meta / Google / LinkedIn pixels

## Core pages

| Route | Purpose |
|---|---|
| `/` | Hero, 4-layer framework, trust bar, offer preview, testimonials |
| `/what-we-build` | Full partnership offer, architecture diagram, guarantee |
| `/how-it-works` | 5-step process (Discovery → Grow) |
| `/industries` | Industry-specific systems |
| `/case-studies` | Before/after case studies with metrics |
| `/about` | Innocent's story, journey, philosophy |
| `/start` | Lead capture form → Supabase + email + WhatsApp |

## Growth features

| Route | Purpose |
|---|---|
| `/assessment` → `/questions` → `/capture` → `/score` | Digital Business Readiness Score funnel |
| `/demo`, `/demo/booking`, `/demo/dashboard` | Interactive sandbox (booking + owner dashboard) |
| `/calculator` | Module pricing estimate → prefilled `/start` |
| `/client/login`, `/client/dashboard` | Client portal (magic-link auth + RLS project tracking) |
| `/referral`, `/referral/[code]` | Referral program (GHS 300) with click + attribution |
| `/blog`, `/blog/[slug]`, `/resources` | Articles + free checklists |
| `/newsletter`, `/newsletter/thank-you` | Newsletter signup + one-click unsubscribe |
| `/admin/analytics` | Conversion dashboard (Basic Auth) |

Site-wide:

- **Chat widget** — rule-based assistant + WhatsApp handoff
- **Retargeting pixels** — Facebook, Google, LinkedIn (PageView + Lead / Subscribe / Assessment conversions)
- **Referral attribution** — code stored in localStorage, attached on lead submit

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   copy .env.example .env.local
   ```

3. Run all four migrations in the Supabase SQL editor, in order:

   - `supabase/migrations/0001_leads_and_testimonials.sql`
   - `supabase/migrations/0002_growth_features.sql`
   - `supabase/migrations/0003_hardening.sql`
   - `supabase/migrations/0004_revoke_counter_execute.sql` (revokes public execute on the referral counter functions)

4. Click-to-chat already uses the owner's WhatsApp number. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, no plus) only to override it. The old example `233201234567` is ignored. Owner notifications (WhatsApp Cloud API) are a separate set of variables: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_NUMBER`.

5. In Supabase Auth:

   - Enable the **Email (magic link)** provider
   - Add `https://your-domain.com/auth/callback` to Redirect URLs
   - For local: `http://localhost:3000/auth/callback`

6. Run the dev server:

   ```bash
   npm run dev
   ```

## Client portal onboarding

For each paying client:

1. Create (or invite) the Auth user in Supabase with their email — the
   portal uses `shouldCreateUser: false`, so strangers cannot self-register.
2. Insert a `client_projects` row with `client_email` matching that email
   (stored lowercase automatically). They will then see their project after
   magic-link sign-in.

## Lead Pipeline

`POST /api/leads` (used by `/start`):

1. Drops honeypot hits, rate-limits per IP (in-memory, best effort on serverless — see `lib/rate-limit.ts`), and checks Turnstile only when both Turnstile env vars are set.
2. Validates and normalizes the submission. Required: name, WhatsApp number, type of business.
3. Saves the lead to Supabase **first** when Supabase is configured.
4. If the save cannot happen, emails and/or WhatsApps the full enquiry to the owner and tells the visitor, with a direct fallback. The pixel conversion does not fire.
5. When the save works, credits a referral code once per contact, then sends confirmation email (if they left an email) and WhatsApp to the owner.

`GET /api/health` reports which integrations are configured (booleans only) and returns 503 when Supabase is missing, so an uptime check can catch a silent outage.

Assessment and newsletter saves follow the same idea: a failed save is not reported as success, and the owner is notified when a channel is configured.

## Tests

```bash
npm test
```

## SEO

- Per-page metadata with canonical URLs
- Organization + Service JSON-LD
- `sitemap.xml` / `robots.txt` (`/admin`, `/client`, `/api`, `/auth` disallowed)
- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Search Console

## Deployment

Built for Vercel. Add every variable from `.env.example`, then deploy.
Analytics work automatically on Vercel.
