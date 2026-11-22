"use client";

import { useWallet } from "@/context/WalletContext";

export default function WalletPage() {
  const { balance, bank } = useWallet();

  return (
    <main>
      <h1>❤️ Wallet</h1>

      {bank === "loopland" ? (
        <p>You are playing with your Loopland account. Your balance is shown in Loopland.</p>
      ) : balance === null ? (
        <p>Loading…</p>
      ) : (
        <>
          <p>Lives Remaining: {balance}</p>
          <p aria-hidden="true">{"❤️".repeat(Math.max(0, Math.min(balance, 100)))}</p>
        </>
      )}
    </main>
  );
}
