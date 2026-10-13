-- Execute in Supabase SQL editor before seeding. No secrets belong in this file.
create table public.administrators (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.administrators enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.administrators where user_id = auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create table public.flashcards (
 id uuid primary key default gen_random_uuid(),
 category text not null check(category in ('Assertiveness','Empathy','Executive Presence','Conflict Management','Managing Your Boss','Managing Your Team','Peer Management','Cross-Functional Management','Self-Advocacy','Power','Influence')),
 front text not null check(length(front) between 5 and 500),
 back text not null check(length(back) between 5 and 600),
 explanation text not null default '' check(length(explanation)<=1000),
 difficulty text not null check(difficulty in ('beginner','intermediate','advanced')),
 display_order integer not null default 0 check(display_order between 0 and 10000),
 published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.flashcards enable row level security;
create policy published_read on public.flashcards for select to anon, authenticated using(published or public.is_admin());
create policy admin_write on public.flashcards for all to authenticated using(public.is_admin()) with check(public.is_admin());
create index cards_category_order on public.flashcards(category,display_order) where published;
create table public.subscribers (
 id uuid primary key default gen_random_uuid(),
 email text not null unique check(length(email)<=254 and email=lower(email)),
 name text not null default '' check(length(name)<=100),
 status text not null default 'pending' check(status in ('pending','confirmed','unsubscribed')),
 consent_at timestamptz not null,
 confirmed_at timestamptz,
 unsubscribed_at timestamptz,
 confirm_hash text unique,
 confirm_expires_at timestamptz,
 unsubscribe_hash text unique,
 last_requested_at timestamptz not null default now()
);
alter table public.subscribers enable row level security;
create policy admin_subscribers_read on public.subscribers for select to authenticated using(public.is_admin());
-- Explicit privilege restrictions complement RLS.
revoke all on public.administrators,public.subscribers from anon,authenticated;
grant select on public.subscribers to authenticated;
grant select on public.flashcards to anon,authenticated;
grant insert,update,delete on public.flashcards to authenticated;
create table public.subscription_rate_limits(key text primary key,hits integer not null,expires_at timestamptz not null);
alter table public.subscription_rate_limits enable row level security;
revoke all on public.subscription_rate_limits from anon,authenticated;
create or replace function public.take_subscription_limit(p_key text,p_limit integer,p_seconds integer)
returns boolean language plpgsql security definer set search_path='' as $$
declare count_now integer;
begin
 insert into public.subscription_rate_limits(key,hits,expires_at) values(p_key,1,now()+make_interval(secs=>p_seconds))
 on conflict(key) do update set hits=case when public.subscription_rate_limits.expires_at<=now() then 1 else public.subscription_rate_limits.hits+1 end,
 expires_at=case when public.subscription_rate_limits.expires_at<=now() then now()+make_interval(secs=>p_seconds) else public.subscription_rate_limits.expires_at end
 returning hits into count_now;
 delete from public.subscription_rate_limits where expires_at<now()-interval '1 day';
 return count_now<=p_limit;
end; $$;
create or replace function public.request_subscription(p_email text,p_name text,p_confirm_hash text,p_unsubscribe_hash text)
returns boolean language plpgsql security definer set search_path='' as $$
declare saved uuid;
begin
 insert into public.subscribers(email,name,status,consent_at,confirm_hash,confirm_expires_at,unsubscribe_hash,last_requested_at)
 values(p_email,p_name,'pending',now(),p_confirm_hash,now()+interval '24 hours',p_unsubscribe_hash,now())
 on conflict(email) do update set name=excluded.name,status='pending',consent_at=now(),confirm_hash=p_confirm_hash,confirm_expires_at=now()+interval '24 hours',unsubscribe_hash=p_unsubscribe_hash,last_requested_at=now()
 where public.subscribers.status<>'confirmed' and public.subscribers.last_requested_at<now()-interval '60 seconds'
 returning id into saved;
 return saved is not null;
end; $$;
create or replace function public.confirm_subscription(p_hash text) returns boolean language plpgsql security definer set search_path='' as $$
declare saved uuid;
begin
 update public.subscribers set status='confirmed',confirmed_at=now(),unsubscribed_at=null,confirm_hash=null,confirm_expires_at=null
 where confirm_hash=p_hash and confirm_expires_at>now() and status='pending' returning id into saved;
 return saved is not null;
end; $$;
create or replace function public.unsubscribe_subscription(p_hash text) returns boolean language plpgsql security definer set search_path='' as $$
declare saved uuid;
begin
 update public.subscribers set status='unsubscribed',unsubscribed_at=coalesce(unsubscribed_at,now()),confirm_hash=null,confirm_expires_at=null
 where unsubscribe_hash=p_hash returning id into saved;
 return saved is not null;
end; $$;
revoke all on function public.take_subscription_limit(text,integer,integer),public.request_subscription(text,text,text,text),public.confirm_subscription(text),public.unsubscribe_subscription(text) from public,anon,authenticated;
grant execute on function public.take_subscription_limit(text,integer,integer),public.request_subscription(text,text,text,text),public.confirm_subscription(text),public.unsubscribe_subscription(text) to service_role;
grant all on public.administrators,public.flashcards,public.subscribers,public.subscription_rate_limits to service_role;
