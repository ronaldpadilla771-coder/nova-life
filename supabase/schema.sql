-- =========================================================
-- NOVA LIFE — ESQUEMA DE BASE DE DATOS SUPABASE
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- =========================================================

-- ---------- EXTENSIONES ----------
create extension if not exists "uuid-ossp";

-- ---------- PERFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- OBJETIVOS ----------
create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  term text not null default 'mensual' check (term in ('anual', 'mensual', 'semanal')),
  target_value numeric not null default 100,
  current_value numeric not null default 0,
  color text not null default '#3B82F6',
  due_date date,
  status text not null default 'activo' check (status in ('activo', 'completado', 'pausado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- HÁBITOS ----------
create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text default '✨',
  color text not null default '#22C55E',
  frequency text not null default 'diario' check (frequency in ('diario', 'semanal')),
  target_days_per_week int not null default 7,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

-- ---------- DIARIO ----------
create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  mood text not null check (mood in ('genial', 'bien', 'normal', 'mal', 'terrible')),
  content text,
  learnings text,
  gratitude text,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

-- ---------- TAREAS ----------
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  due_date date,
  due_time time,
  completed boolean not null default false,
  reminder boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- FINANZAS ----------
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('ingreso', 'gasto', 'ahorro')),
  category text not null,
  amount numeric not null check (amount >= 0),
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric not null,
  current_amount numeric not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.tasks enable row level security;
alter table public.transactions enable row level security;
alter table public.financial_goals enable row level security;

-- PROFILES
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- GOALS
create policy "goals_all_own" on public.goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- HABITS
create policy "habits_all_own" on public.habits for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- HABIT LOGS
create policy "habit_logs_all_own" on public.habit_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- JOURNAL
create policy "journal_all_own" on public.journal_entries for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TASKS
create policy "tasks_all_own" on public.tasks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TRANSACTIONS
create policy "transactions_all_own" on public.transactions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- FINANCIAL GOALS
create policy "financial_goals_all_own" on public.financial_goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- TRIGGER: crear perfil automáticamente al registrarse
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- ÍNDICES
-- =========================================================
create index if not exists idx_goals_user on public.goals(user_id);
create index if not exists idx_habits_user on public.habits(user_id);
create index if not exists idx_habit_logs_habit on public.habit_logs(habit_id);
create index if not exists idx_habit_logs_user_date on public.habit_logs(user_id, completed_on);
create index if not exists idx_journal_user_date on public.journal_entries(user_id, entry_date);
create index if not exists idx_tasks_user on public.tasks(user_id);
create index if not exists idx_transactions_user_date on public.transactions(user_id, occurred_on);
