-- Per-account calendar storage: one row per user per day.
create table if not exists public.emotion_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  record_date date not null,
  negative_emotion jsonb,
  positive_emotion jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, record_date)
);

alter table public.emotion_records enable row level security;

create policy "Users can view their own emotion records"
  on public.emotion_records for select
  using (auth.uid() = user_id);

create policy "Users can insert their own emotion records"
  on public.emotion_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own emotion records"
  on public.emotion_records for update
  using (auth.uid() = user_id);
