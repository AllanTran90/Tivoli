"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/wallet", label: "Wallet" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  const { balance, bank } = useWallet();
  const pathname = usePathname();
  const label = bank === "loopland" ? "❤️ Loopland account" : `❤️ ${balance ?? "…"} Lives`;

  return (
    <nav className={styles.nav} aria-label="Main">
      <Link href="/" className={styles.brand}>
        🎡 Tivoli Arcade
      </Link>

      <ul className={styles.links}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className={styles.lives} aria-live="polite">
        {label}
      </p>
    </nav>
  );
}
