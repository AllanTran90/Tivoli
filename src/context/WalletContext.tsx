"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchWallet, playGame, type PlayRequestBody } from "@/lib/playGame";
import type { BankKind, PlayApiResponse } from "@/types/api";

// Saldot ägs av servern. Klienten visar bara det servern svarar och kan inte ändra det själv.
// - Gäster: Tivoli-banken (/api/wallet, /api/play utan token)
// - Spelare från Loopland: Loopland-Centralbanken (saldot visas i Loopland, inte här)

type WalletContextType = {
  /** Saldo i Tivoli-banken. null = laddar, eller okänt i Loopland-läge. */
  balance: number | null;
  bank: BankKind;
  identityToken: string | null;
  setIdentityToken: (token: string) => void;
  canAfford: (cost: number) => boolean;
  /** Spelar en omgång på servern. Saldot uppdateras först när `settle` anropas. */
  play: (body: PlayRequestBody) => Promise<PlayApiResponse>;
  /** Visar nytt saldo från ett lyckat spel. Anropas när animationen är klar. */
  settle: (response: PlayApiResponse) => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

const GAME_PAGES = ["/darts", "/chocolateWheel", "/reactionRush"];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const pathname = usePathname();
  const bank: BankKind = identityToken ? "loopland" : "tivoli";

  useEffect(() => {
    let cancelled = false;
    fetchWallet().then((res) => {
      if (cancelled) return;
      if (res.success && typeof res.balance === "number") setBalance(res.balance);
      else console.error(res.error);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (bank === "tivoli" && balance === 0 && GAME_PAGES.includes(pathname)) {
      window.location.href = "https://loopland.se";
    }
  }, [bank, balance, pathname]);

  function canAfford(cost: number): boolean {
    // I Loopland-läge vet vi inte saldot. Centralbanken säger ifrån om det inte räcker.
    if (bank === "loopland") return true;
    return balance !== null && balance >= cost;
  }

  function play(body: PlayRequestBody): Promise<PlayApiResponse> {
    return playGame(identityToken ? { ...body, identityToken } : body);
  }

  function settle(response: PlayApiResponse): void {
    if (response.success && typeof response.balance === "number") setBalance(response.balance);
  }

  return (
    <WalletContext.Provider
      value={{ balance, bank, identityToken, setIdentityToken, canAfford, play, settle }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside WalletProvider");
  return context;
}
