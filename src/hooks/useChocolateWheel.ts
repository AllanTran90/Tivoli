import { useState } from "react";
import triggerWinConfetti from "@/lib/confetti";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { CHOCOLATE_WHEEL_COST } from "@/lib/games/rules";

const SPIN_MS = 1200;
const SLICE = 360 / 6;

/** Ny rotation så att hjulet stannar på `number` efter minst 3 varv. */
function rotationFor(number: number, currentRotation: number): number {
  const targetAngle = 300 - ((number - 1) * SLICE + SLICE / 2);
  let delta = targetAngle - (currentRotation % 360);
  if (delta < 0) delta += 360;
  return currentRotation + delta + 3 * 360;
}

export function useChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);

  const wallet = useWallet();
  const session = useGameSession("/chocolateWheel");
  const canSpin = selectedNumber !== null && !spinning && wallet.canAfford(CHOCOLATE_WHEEL_COST);

  async function spin(): Promise<void> {
    if (!canSpin || selectedNumber === null) return;
    session.setBankError(null);
    setSpinning(true);

    const response = await wallet.play({ game: "chocolate-wheel", selectedNumber });
    const { result: gameResult, resultNumber } = response;

    if (!response.success || !gameResult || resultNumber === undefined) {
      session.setBankError(response.error ?? "Betalning misslyckades");
      setSpinning(false);
      return;
    }

    setRotation((current) => rotationFor(resultNumber, current));

    setTimeout(() => {
      const won = gameResult.moneyWon > 0;
      setResult(resultNumber);
      wallet.settle(response);
      if (won) triggerWinConfetti();
      setHistory((prev) => [
        won
          ? `WIN 🎉 | Number: ${resultNumber} | +${gameResult.moneyWon} ❤️`
          : `LOSS 😢 | Number: ${resultNumber} | -${CHOCOLATE_WHEEL_COST} ❤️`,
        ...prev,
      ]);
      setSpinning(false);
    }, SPIN_MS);
  }

  return { result, rotation, selectedNumber, setSelectedNumber, history, spin, canSpin, ...session };
}
