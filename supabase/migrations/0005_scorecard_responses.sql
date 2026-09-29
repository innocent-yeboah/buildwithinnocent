-- AI Readiness Scorecard submissions.
-- Run this in the Supabase SQL editor (or via supabase db push) after 0004.
--
-- Inserts happen only from the server route, using the service role key,
-- which bypasses RLS. There is no public read or insert policy.

create table if not exists public.scorecard_responses (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  business_name text not null,
  phone text,
  q1 smallint not null check (q1 between 0 and 2),
  q2 smallint not null check (q2 between 0 and 2),
  q3 smallint not null check (q3 between 0 and 2),
  q4 smallint not null check (q4 between 0 and 2),
  q5 smallint not null check (q5 between 0 and 2),
  q6 smallint not null check (q6 between 0 and 2),
  q7 smallint not null check (q7 between 0 and 2),
  q8 smallint not null check (q8 between 0 and 2),
  q9 smallint not null check (q9 between 0 and 2),
  q10 smallint not null check (q10 between 0 and 2),
  sales_score smallint not null check (sales_score between 0 and 6),
  ai_score smallint not null check (ai_score between 0 and 6),
  revenue_score smallint not null check (revenue_score between 0 and 8),
  total_score smallint not null check (total_score between 0 and 20),
  tier text not null check (tier in (
    'AI-curious, lots of opportunity',
    'Building momentum, ready to scale',
    'AI-forward, time to optimize'
  )),
  start_section text not null check (start_section in (
    'Sales process',
    'AI adoption',
    'Revenue goals'
  )),
  utm jsonb,
  referrer text,
  created_at timestamptz not null default now(),
  constraint scorecard_sales_matches_answers check (sales_score = q1 + q2 + q3),
  constraint scorecard_ai_matches_answers check (ai_score = q4 + q5 + q6),
  constraint scorecard_revenue_matches_answers check (revenue_score = q7 + q8 + q9 + q10),
  constraint scorecard_total_matches_sections check (total_score = sales_score + ai_score + revenue_score)
);

create index if not exists scorecard_responses_created_at_idx
  on public.scorecard_responses (created_at desc);

create index if not exists scorecard_responses_email_idx
  on public.scorecard_responses (email);

alter table public.scorecard_responses enable row level security;

-- No policies. anon and authenticated cannot read or write this table.
revoke all on table public.scorecard_responses from anon, authenticated;
