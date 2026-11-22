import type { PlayApiResponse, WalletApiResponse } from "@/types/api";

/** Det klienten skickar: bara vad spelaren gjorde. Insats och vinst räknas ut på servern. */
export type PlayRequestBody =
  | { game: "darts"; score: number }
  | { game: "chocolate-wheel"; selectedNumber: number }
  | { game: "reaction-rush"; reactionTime: number; amount: number };

async function requestJson<T extends { success: boolean; error?: string }>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, init);
    return (await response.json()) as T;
  } catch {
    return { success: false, error: "Kunde inte nå servern" } as T;
  }
}

export function playGame(body: PlayRequestBody & { identityToken?: string }): Promise<PlayApiResponse> {
  return requestJson<PlayApiResponse>("/api/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function fetchWallet(): Promise<WalletApiResponse> {
  return requestJson<WalletApiResponse>("/api/wallet", { cache: "no-store" });
}
