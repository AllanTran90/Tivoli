import Link from "next/link";
import ChocolateWheel from "../chocolateWheel/page";

export default function GamePage() {
  return (
    <main>
      <h1>Games</h1>

      <Link href="/chocolateWheel">Chocolate Wheel</Link>
      <Link href="/reactionRush">Reaction Rush</Link>
      <Link href="/darts">Darts</Link>
    </main>
  );
}
