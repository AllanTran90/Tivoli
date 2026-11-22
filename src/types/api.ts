// ── Centralbank API types ──────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
}

export type StampAnimal = "lion" | "dolphin" | "toucan" | "beetlebug" | "snake";
export type StampMetal = "silver" | "gold" | "platinum";

export interface Stamp {
  id: number;
  transaction_id: number | null;
  animal: StampAnimal;
  metal: StampMetal | null;
  image_url: string;
  created_at: string;
}

export interface TransactionResponse {
  transaction_id: number;
  amount: number;
  stamp: Stamp | null;
}

export interface PayoutResponse {
  transaction_id: number;
  amount: number;
}

// ── Internal game types ────────────────────────────────────────────────

export interface GameResult {
  reward: string;
  moneyWon: number;
}

export type BankKind = "loopland" | "tivoli";

export interface PlayApiResponse {
  success: boolean;
  bank?: BankKind;
  result?: GameResult;
  resultNumber?: number;
  /** Nytt saldo, bara i Tivoli-banken (Loopland har sitt eget saldo). */
  balance?: number;
  transaction?: TransactionResponse;
  payout?: PayoutResponse | null;
  error?: string;
}

export interface WalletApiResponse {
  success: boolean;
  balance?: number;
  error?: string;
}

// ── Loopland identity token ────────────────────────────────────────────

export interface IdentityTokenUser {
  id: number;
  name: string;
}

export interface IdentityTokenResponse {
  user: IdentityTokenUser;
  expires_at: string;
}
