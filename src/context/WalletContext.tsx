"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type WalletContextType = {
  plays: number;
  setPlays: (
    value: number
  ) => Promise<void>;
};

const WalletContext =
  createContext<WalletContextType | null>(
    null
  );

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plays, setPlaysState] =
    useState(5);

  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) return;

    async function fetchWallet() {
      const { data, error } =
        await supabase!
          .from("wallet")
          .select("plays")
          .eq("id", 1)
          .maybeSingle();

      if (data) {
        setPlaysState(data.plays);
      }

      if (error) {
        console.log(error.message);
      }
    }

    fetchWallet();
  }, []);

  useEffect(() => {
    const gamePages = [
      "/darts",
      "/chocolateWheel",
      "/reactionRush",
    ];

    if (
      plays <= 0 &&
      gamePages.includes(pathname)
    ) {
      window.location.href =
        "https://loopland.se";
    }
  }, [plays, pathname]);

  async function setPlays(
    value: number
  ) {
    if (!supabase) return;

    setPlaysState(value);

    const { error } =
      await supabase
        .from("wallet")
        .update({ plays: value })
        .eq("id", 1);

    if (error) {
      console.log(error.message);
    }
  }

  return (
    <WalletContext.Provider
      value={{
        plays,
        setPlays,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context =
    useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWallet must be used inside WalletProvider"
    );
  }

  return context;
}