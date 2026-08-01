import type { GameResult } from "@/types/api";

export function handleChocolateWheel(
  selectedNumber: number,
  resultNumber: number,
  multiplier: number
): GameResult {
  if (selectedNumber === resultNumber) {
    return { reward: `x${multiplier}`, moneyWon: 2 };
  }

  return { reward: "No reward", moneyWon: 0 };
}
