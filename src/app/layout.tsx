import Link from "next/link";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/games">Games</Link>
            <Link href="/wallet">Wallet</Link>
            <Link href="/leaderboard">Leaderboard</Link>
          </nav>

          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
