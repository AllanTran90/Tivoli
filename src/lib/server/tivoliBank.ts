import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";

// Tivoli-banken: egen bank i Supabase för spelare som inte kommer via Loopland.
// All logik för saldot ligger i SQL-funktionerna i supabase/migrations/001_tivoli_bank.sql,
// så att insats och vinst alltid sker atomärt och saldot aldrig kan bli negativt.

export class InsufficientFundsError extends Error {
  constructor() {
    super("Not enough hearts");
    this.name = "InsufficientFundsError";
  }
}

export class BankUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("Bank unavailable");
    this.name = "BankUnavailableError";
    this.cause = cause;
  }
}

/**
 * Loggar varför banken misslyckades (syns i Vercel → Logs). Skickas aldrig till klienten.
 * Loggar bara felmeddelanden och felkoder, aldrig nycklar eller konto-id.
 */
export function logBankError(context: string, error: unknown): void {
  const cause = error instanceof Error ? error.cause : undefined;
  const causeInfo =
    cause && typeof cause === "object"
      ? { message: (cause as { message?: string }).message, code: (cause as { code?: string }).code }
      : undefined;
  console.error(`[tivoli-bank] ${context}:`, error instanceof Error ? error.message : error, causeInfo ?? "");
}

export async function getBalance(accountId: string): Promise<number> {
  const { data, error } = await getSupabaseAdmin().rpc("bank_get_balance", { p_user: accountId });
  if (error || typeof data !== "number") throw new BankUnavailableError(error);
  return data;
}

/**
 * Drar insatsen och betalar ut `payout` i en transaktion. Returnerar nytt saldo.
 * `payout` är det som betalas tillbaka (insats + vinst vid vinst, annars 0), samma som
 * till Loopland-Centralbanken. Använd `payoutFor()` i lib/games/rules.ts.
 */
export async function playRound(
  accountId: string,
  game: string,
  bet: number,
  payout: number,
): Promise<number> {
  const { data, error } = await getSupabaseAdmin().rpc("bank_play", {
    p_user: accountId,
    p_game: game,
    p_bet: bet,
    p_payout: payout,
  });

  if (error) {
    if (error.message?.includes("insufficient_funds")) throw new InsufficientFundsError();
    throw new BankUnavailableError(error);
  }
  if (typeof data !== "number") throw new BankUnavailableError();
  return data;
}
