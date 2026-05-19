"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type WalletContextType = {
  balance: number;
  setBalance: ( value:number) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode; }) {
  const [balance, setBalanceState] = useState(150);

  
  useEffect (() => {
      if (!supabase) return;

      const client = supabase;

  async function fetchWallet() {
  const { data, error } = await client
    .from("wallet")
    .select("*")
    .eq("id", 1)
    .single();

  if (data) {
    setBalanceState(data.balance);
  }

  if (error) {
    console.log(error.message);
  }
}

    fetchWallet();
  }, []);

async function setBalance(value: number) {
    if (!supabase) return;
    setBalanceState(value);

  const { error } = await supabase
    .from("wallet")
    .update({ balance: value })
    .eq("id", 1);

  if (error) {
    console.log(error.message);
  }
}

  return (
    <WalletContext.Provider 
    value={{ balance, setBalance }}>
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
