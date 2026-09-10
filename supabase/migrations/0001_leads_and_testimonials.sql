-- Build With Innocent: lead capture and testimonials schema.
-- Run this in the Supabase SQL editor (or via supabase db push).

-- ============ LEADS ============
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text not null,
  email text not null,
  phone text not null,
  industry text not null,
  project_details text not null,
  source text not null default 'website',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'proposal_sent', 'won', 'lost')),
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Row Level Security: no anonymous access. The website writes through the
-- service role key (server-side only), which bypasses RLS by design.
alter table public.leads enable row level security;

-- ============ TESTIMONIALS ============
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business text not null,
  quote text not null,
  result text not null,
  initials text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_published_idx
  on public.testimonials (published, created_at desc);

alter table public.testimonials enable row level security;

-- Published testimonials are public content.
create policy "Published testimonials are readable by everyone"
  on public.testimonials
  for select
  using (published = true);
