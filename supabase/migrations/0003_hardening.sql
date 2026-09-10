-- Build With Innocent: production hardening for growth features.

-- Atomic referral lead attribution (replaces race-prone read-then-update).
create or replace function public.increment_referral_leads(ref_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.referrals
  set converted_leads = converted_leads + 1
  where code = ref_code;
$$;

-- Newsletter: one-click unsubscribe tokens.
alter table public.subscribers
  add column if not exists unsubscribe_token uuid default gen_random_uuid();

update public.subscribers
set unsubscribe_token = gen_random_uuid()
where unsubscribe_token is null;

alter table public.subscribers
  alter column unsubscribe_token set not null;

create unique index if not exists subscribers_unsubscribe_token_idx
  on public.subscribers (unsubscribe_token);

-- Ensure client portal emails are always stored lowercase (matches RLS).
create or replace function public.lowercase_client_email()
returns trigger
language plpgsql
as $$
begin
  new.client_email := lower(new.client_email);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists client_projects_lowercase_email on public.client_projects;
create trigger client_projects_lowercase_email
  before insert or update on public.client_projects
  for each row
  execute function public.lowercase_client_email();

-- Keep updated_at fresh on client project edits.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
