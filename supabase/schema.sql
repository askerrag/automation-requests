-- Заявки на автоматизацию.
-- Вставьте этот файл один раз в SQL Editor нового проекта Supabase.

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint requests_title_not_blank check (char_length(btrim(title)) > 0),
  constraint requests_description_not_blank check (char_length(btrim(description)) > 0),
  constraint requests_category_check check (category in ('bot', 'integration', 'report', 'other')),
  constraint requests_status_check check (status in ('new', 'in_progress', 'done'))
);

create index requests_user_id_created_at_idx on public.requests (user_id, created_at desc);

alter table public.requests enable row level security;

revoke all on public.requests from anon;
revoke all on public.requests from authenticated;
grant select, insert, update on public.requests to authenticated;

create policy "requests_select_own"
  on public.requests
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "requests_insert_own"
  on public.requests
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'new'
  );

create policy "requests_update_own"
  on public.requests
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Регистрация сразу открывает сервис: почта считается подтверждённой.
-- Функция лежит вне public, чтобы её нельзя было вызвать через API.
create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create or replace function private.set_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

revoke all on function private.set_email_confirmed() from public, anon, authenticated;

drop trigger if exists set_email_confirmed on auth.users;

create trigger set_email_confirmed
  before insert on auth.users
  for each row
  execute function private.set_email_confirmed();
