-- Build With Innocent: stop anonymous callers from running internal counters.
--
-- increment_referral_clicks and increment_referral_leads are security definer.
-- Postgres grants EXECUTE to PUBLIC by default, and Supabase also grants it to
-- anon and authenticated, so anyone with the anon key could bump the counters.
-- The site calls them only with the service role.
--
-- Do not edit 0002 or 0003. This migration is the fix.

revoke execute on function public.increment_referral_clicks(text) from public;
revoke execute on function public.increment_referral_clicks(text) from anon;
revoke execute on function public.increment_referral_clicks(text) from authenticated;

revoke execute on function public.increment_referral_leads(text) from public;
revoke execute on function public.increment_referral_leads(text) from anon;
revoke execute on function public.increment_referral_leads(text) from authenticated;

grant execute on function public.increment_referral_clicks(text) to service_role;
grant execute on function public.increment_referral_leads(text) to service_role;

-- Defined in 0003 and never attached to a trigger.
-- client_projects already refreshes updated_at inside lowercase_client_email.
drop function if exists public.touch_updated_at();
