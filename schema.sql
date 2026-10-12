-- Supabase > SQL Editor'e yapıştırıp Run'a bas

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text default 'Kullanıcı',
  monthly_budget numeric default 20000
);

create table public.quick_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null, price numeric not null default 0, icon text default '🛒'
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null, price numeric not null, icon text default '💸',
  created_at timestamptz not null default now()
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null, monthly_amount numeric not null,
  total_installments int not null, paid_installments int not null default 0,
  pay_day int not null default 1
);

create table public.loan_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  loan_id uuid not null references public.loans(id) on delete cascade,
  amount numeric not null, paid_at timestamptz not null default now()
);

-- RLS: herkes yalnızca kendi verisini görür
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

do $$ declare t text; begin
  foreach t in array array['quick_items','expenses','loans','loan_payments'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

-- Yeni kullanıcı için profil + hazır butonlar
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id) values (new.id);
  insert into quick_items(user_id,name,price,icon) values
    (new.id,'Sigara',100,'🚬'),(new.id,'Su',15,'💧'),(new.id,'Kahve',80,'☕'),(new.id,'Ekmek',12,'🍞');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Kredi taksiti öde: sayacı artırır, ödeme kaydı ve harcama ekler
create or replace function public.pay_loan(p_loan_id uuid) returns void
language plpgsql as $$
declare l loans;
begin
  select * into l from loans where id = p_loan_id and user_id = auth.uid();
  if l.id is null or l.paid_installments >= l.total_installments then return; end if;
  update loans set paid_installments = paid_installments + 1 where id = l.id;
  insert into loan_payments(loan_id, amount) values (l.id, l.monthly_amount);
  insert into expenses(name, price, icon) values ('Kredi: ' || l.name, l.monthly_amount, '🏦');
end $$;
