import { useState } from "react";
import triggerWinConfetti from "@/lib/confetti";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { playGame } from "@/lib/playGame";

export function useChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const { plays, setPlays } = useWallet();
  const session = useGameSession("/chocolateWheel");

  async function spin(): Promise<void> {
    if (plays <= 0 || selectedNumber === null) return;
    session.setBankError(null);

    const values = [1, 2, 3, 4, 5, 6];
    const random = values[Math.floor(Math.random() * values.length)];
    const sliceSize = 360 / 6;
    const sliceCenter = (random - 1) * sliceSize + sliceSize / 2;
    const targetAngle = 300 - sliceCenter;
    const current = rotation % 360;
    let delta = targetAngle - current;
    if (delta < 0) delta += 360;
    setRotation(rotation + delta + 3 * 360);

    setTimeout(async () => {
      setResult(random);
      const updatedLives = plays - 1;

      if (session.identityToken) {
        const apiResult = await playGame({ game: "chocolate-wheel", amount: 1, identityToken: session.identityToken, selectedNumber: selectedNumber!, resultNumber: random, multiplier: 3 });
        if (!apiResult.success) session.setBankError(apiResult.error ?? "Betalning misslyckades");
      }

      if (random === selectedNumber) {
        triggerWinConfetti();
        await setPlays(updatedLives + 2);
        setHistory((prev) => [`WIN 🎉 | Number: ${random} | +2 ❤️`, ...prev]);
      } else {
        await setPlays(updatedLives);
        setHistory((prev) => [`LOSS 😢 | Number: ${random} | -1 ❤️`, ...prev]);
      }
    }, 1200);
  }

  return { result, rotation, selectedNumber, setSelectedNumber, history, spin, plays, ...session };
}
