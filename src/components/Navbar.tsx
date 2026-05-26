"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  const { plays } = useWallet();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
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

      <p>❤️ {plays} Lives</p>
    </nav>
  );
}
