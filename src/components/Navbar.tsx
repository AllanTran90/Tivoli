"use client"

import Link from "next/link"
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
    const { balance } = useWallet();

 return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >

        <Link href="/">Home</Link>
        <Link href="/games">Games</Link>
        <Link href="/wallet">Wallet</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      </div>

      <p>💰 {balance} Coins</p>
    </nav>
  );
}

