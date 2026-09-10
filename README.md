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

3. Run all three migrations in the Supabase SQL editor, in order:

   - `supabase/migrations/0001_leads_and_testimonials.sql`
   - `supabase/migrations/0002_growth_features.sql`
   - `supabase/migrations/0003_hardening.sql`

4. In Supabase Auth:

   - Enable the **Email (magic link)** provider
   - Add `https://your-domain.com/auth/callback` to Redirect URLs
   - For local: `http://localhost:3000/auth/callback`

5. Run the dev server:

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

1. Validates and normalizes the submission.
2. Saves the lead to Supabase **first**.
3. Atomically credits a referral code when present.
4. Sends confirmation email (Resend) + WhatsApp to Innocent (best-effort).

Assessment completions also notify Innocent on WhatsApp.

## SEO

- Per-page metadata with canonical URLs
- Organization + Service JSON-LD
- `sitemap.xml` / `robots.txt` (`/admin`, `/client`, `/api`, `/auth` disallowed)
- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Search Console

## Deployment

Built for Vercel. Add every variable from `.env.example`, then deploy.
Analytics work automatically on Vercel.
