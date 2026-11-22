"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import shell from "@/components/PageShell.module.css";
import ui from "@/components/ui.module.css";
import styles from "./wallet.module.css";

const MAX_HEARTS_SHOWN = 50;

export default function WalletPage() {
  const { balance, bank } = useWallet();

  return (
    <main className={`${shell.page} ${shell.narrow}`}>
      <header className={shell.header}>
        <h1 className={shell.title}>❤️ Wallet</h1>
        <p className={shell.lead}>Your hearts are your coins. Every game costs some, every win gives you more.</p>
      </header>

      <section className={`${ui.panel} ${styles.card}`}>
        {bank === "loopland" ? (
          <>
            <p className={styles.label}>Playing with</p>
            <p className={styles.balance}>Loopland account</p>
            <p className={styles.note}>Your balance is shown in Loopland. Wins and losses go straight to your Loopland hearts.</p>
          </>
        ) : balance === null ? (
          <p className={styles.note}>Loading your wallet…</p>
        ) : (
          <>
            <p className={styles.label}>Lives remaining</p>
            <p className={styles.balance}>{balance}</p>
            <p className={styles.hearts} aria-hidden="true">
              {"❤️".repeat(Math.max(0, Math.min(balance, MAX_HEARTS_SHOWN)))}
              {balance > MAX_HEARTS_SHOWN && " …"}
            </p>
          </>
        )}
        <Link href="/games" className={ui.button}>
          Play a game
        </Link>
      </section>
    </main>
  );
}
