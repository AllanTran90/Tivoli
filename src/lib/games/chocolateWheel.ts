export function handleChocolateWheel(
  selectedNumber: number,
  resultNumber: number,
  multiplier: number
) {
  if (
    selectedNumber === resultNumber
  ) {
    return {
      reward: `x${multiplier}`,
      moneyWon: multiplier * 2,
    };
  }

  return {
    reward: "No reward",
    moneyWon: 0,
  };
}