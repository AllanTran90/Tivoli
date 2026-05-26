"use client";

import { useWallet } from "@/context/WalletContext";

export default function WalletPage() {
  const { plays } = useWallet();

  return (
    <main>
      <h1>❤️ Wallet</h1>

      <p>
        Lives Remaining:
      </p>

      <p>
        {"❤️".repeat(plays)}
      </p>
    </main>
  );
}