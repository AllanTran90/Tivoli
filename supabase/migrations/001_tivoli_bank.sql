-- ════════════════════════════════════════════════════════════════════════
-- Tivoli-banken + RLS
-- Kör hela filen i Supabase → SQL Editor. Den går att köra flera gånger.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Tabeller ─────────────────────────────────────────────────────────

create table if not exists public.bank_accounts (
  user_id    text primary key,
  -- Startsaldo. Måste stämma med STARTING_BALANCE i src/lib/games/rules.ts
  balance    integer not null default 10 check (balance >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.bank_transactions (
  id            bigint generated always as identity primary key,
  user_id       text not null references public.bank_accounts(user_id) on delete cascade,
  game          text not null,
  bet           integer not null check (bet > 0),
  payout        integer not null check (payout >= 0), -- insats + vinst, eller 0
  balance_after integer not null check (balance_after >= 0),
  created_at    timestamptz not null default now()
);

create index if not exists bank_transactions_user_idx
  on public.bank_transactions (user_id, created_at desc);

-- ── 2. RLS: ingen direkt åtkomst från webbläsaren ────────────────────────
-- Inga policies = anon-nyckeln kommer inte åt tabellerna alls.
-- Servern använder service role-nyckeln, som går förbi RLS.

alter table public.bank_accounts     enable row level security;
alter table public.bank_transactions enable row level security;

-- ── 3. Bankfunktioner ───────────────────────────────────────────────────

-- Hämtar saldo och skapar kontot med startsaldo om det inte finns.
create or replace function public.bank_get_balance(p_user text)
returns integer
language plpgsql
set search_path = public
as $$
declare
  v_balance integer;
begin
  insert into bank_accounts (user_id) values (p_user) on conflict do nothing;
  select balance into v_balance from bank_accounts where user_id = p_user;
  return v_balance;
end;
$$;

-- Drar insatsen och betalar ut p_payout (insats + vinst vid vinst, annars 0) i EN transaktion.
-- Samma belopp som skickas till Loopland-Centralbanken, se payoutFor() i src/lib/games/rules.ts.
-- Raden låses av UPDATE, så två samtidiga spel kan inte skriva över varandra.
create or replace function public.bank_play(p_user text, p_game text, p_bet integer, p_payout integer)
returns integer
language plpgsql
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_bet is null or p_bet <= 0 or p_payout is null or p_payout < 0 then
    raise exception 'invalid_amount';
  end if;

  insert into bank_accounts (user_id) values (p_user) on conflict do nothing;

  update bank_accounts
     set balance = balance - p_bet + p_payout
   where user_id = p_user
     and balance >= p_bet
  returning balance into v_balance;

  if v_balance is null then
    raise exception 'insufficient_funds';
  end if;

  insert into bank_transactions (user_id, game, bet, payout, balance_after)
  values (p_user, p_game, p_bet, p_payout, v_balance);

  return v_balance;
end;
$$;

-- Bara servern (service_role) får anropa bankfunktionerna.
revoke all on function public.bank_get_balance(text)                     from public, anon, authenticated;
revoke all on function public.bank_play(text, text, integer, integer)    from public, anon, authenticated;
grant execute on function public.bank_get_balance(text)                  to service_role;
grant execute on function public.bank_play(text, text, integer, integer) to service_role;

-- ── 4. Leaderboard: alla får läsa och lägga till rimliga resultat ────────

alter table public.leaderboard enable row level security;

drop policy if exists "leaderboard_select" on public.leaderboard;
create policy "leaderboard_select"
  on public.leaderboard for select
  to anon, authenticated
  using (true);

drop policy if exists "leaderboard_insert" on public.leaderboard;
create policy "leaderboard_insert"
  on public.leaderboard for insert
  to anon, authenticated
  with check (
    char_length(player) between 1 and 20
    and (
      (game = 'darts'        and score between 0 and 180) or
      (game = 'reactionRush' and score > 0 and score <= 60)
    )
  );
-- Inga policies för update/delete = ingen kan ändra eller radera resultat.

-- ── 5. Gamla wallet-tabellen ────────────────────────────────────────────
-- Koden använder den inte längre. RLS utan policies låser den för webbläsaren.
-- Vill ni ta bort den helt: drop table public.wallet;

alter table if exists public.wallet enable row level security;
