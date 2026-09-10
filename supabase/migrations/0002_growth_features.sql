-- Build With Innocent: growth features schema.
-- Assessment funnel, newsletter, referrals, and the client portal.

-- ============ LEADS: referral attribution ============
alter table public.leads
  add column if not exists referral_code text;

create index if not exists leads_referral_code_idx
  on public.leads (referral_code)
  where referral_code is not null;

-- ============ ASSESSMENTS ============
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text not null,
  email text not null,
  score integer not null check (score between 0 and 100),
  band text not null,
  layer_scores jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists assessments_created_at_idx
  on public.assessments (created_at desc);

alter table public.assessments enable row level security;

-- ============ NEWSLETTER SUBSCRIBERS ============
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  source text not null default 'newsletter_page',
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- ============ REFERRALS ============
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  referrer_name text not null,
  referrer_email text not null,
  referrer_phone text,
  clicks integer not null default 0,
  converted_leads integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists referrals_code_idx on public.referrals (code);

alter table public.referrals enable row level security;

-- Atomically count a click on a referral link (called via service role).
create or replace function public.increment_referral_clicks(ref_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.referrals set clicks = clicks + 1 where code = ref_code;
$$;

-- ============ CLIENT PORTAL ============
-- One row per client project. Clients sign in with Supabase magic links;
-- RLS lets them read only projects registered to their email.
create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_email text not null,
  client_name text not null,
  business_name text not null,
  project_name text not null,
  status text not null default 'discovery'
    check (status in ('discovery', 'design_build', 'review', 'launched', 'support')),
  progress integer not null default 0 check (progress between 0 and 100),
  website_url text,
  next_milestone text,
  next_milestone_date date,
  milestones jsonb not null default '[]'::jsonb,
  support_expires_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_projects_email_idx
  on public.client_projects (client_email);

alter table public.client_projects enable row level security;

create policy "Clients can read their own projects"
  on public.client_projects
  for select
  to authenticated
  using (client_email = lower(auth.jwt() ->> 'email'));
