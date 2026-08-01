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
  const [spinning, setSpinning] = useState(false);

  const { plays, setPlays } = useWallet();
  const session = useGameSession("/chocolateWheel");

  function animateToNumber(random: number, currentRotation: number): void {
    const sliceSize = 360 / 6;
    const sliceCenter = (random - 1) * sliceSize + sliceSize / 2;
    const targetAngle = 300 - sliceCenter;
    const current = currentRotation % 360;
    let delta = targetAngle - current;
    if (delta < 0) delta += 360;
    setRotation(currentRotation + delta + 3 * 360);
  }

  async function spin(): Promise<void> {
    if (plays <= 0 || selectedNumber === null || spinning) return;
    session.setBankError(null);
    setSpinning(true);

    if (!session.identityToken) {
      // No bank — generate random locally
      const random = Math.ceil(Math.random() * 6);
      animateToNumber(random, rotation);
      setTimeout(async () => {
        setResult(random);
        if (random === selectedNumber) {
          triggerWinConfetti();
          await setPlays(plays + 1);
          setHistory((prev) => [`WIN 🎉 | Number: ${random} | +2 ❤️`, ...prev]);
        } else {
          await setPlays(plays - 1);
          setHistory((prev) => [`LOSS 😢 | Number: ${random} | -1 ❤️`, ...prev]);
        }
        setSpinning(false);
      }, 1200);
      return;
    }

    const apiResult = await playGame({
      game: "chocolate-wheel",
      amount: 1,
      identityToken: session.identityToken,
      selectedNumber,
      multiplier: 3,
    });

    if (!apiResult.success || apiResult.resultNumber === undefined) {
      session.setBankError(apiResult.error ?? "Betalning misslyckades");
      setSpinning(false);
      return;
    }

    const random = apiResult.resultNumber;
    const currentRotation = rotation;

    // Sync local plays with bank: credited - deducted
    const deducted = apiResult.transaction?.amount ?? 1;
    const credited = apiResult.payout?.amount ?? 0;
    const delta = credited - deducted;

    animateToNumber(random, currentRotation);

    setTimeout(async () => {
      setResult(random);
      await setPlays(plays + delta);
      if (random === selectedNumber) {
        triggerWinConfetti();
        setHistory((prev) => [`WIN 🎉 | Number: ${random} | +2 ❤️`, ...prev]);
      } else {
        setHistory((prev) => [`LOSS 😢 | Number: ${random} | -1 ❤️`, ...prev]);
      }
      setSpinning(false);
    }, 1200);
  }

  return { result, rotation, selectedNumber, setSelectedNumber, history, spin, spinning, plays, ...session };
}
