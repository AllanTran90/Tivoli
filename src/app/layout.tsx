import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: 

{
  children: React.ReactNode;
}) 

{
  return(
    <html lang="en">
      <body>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/games">Games</Link>
          <Link href="/wallet">Wallet</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>

        {children}

      </body>
    </html>
  );
}