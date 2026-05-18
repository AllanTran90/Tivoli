"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type WalletContextType = {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(150);

  
  useEffect(() => {
      if (!supabase) return;

      const client = supabase;

    async function fetchWallet() {
      const { data, error } = await client
        .from("wallet")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        setBalance(data.balance);
      }

      if (error) {
        console.log(error.message);
      }
    }

    fetchWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ balance, setBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return context;
}
