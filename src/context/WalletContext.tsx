"use client";

import { createContext, useContext, useState } from "react";

type WalletContextType = {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(150);

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
