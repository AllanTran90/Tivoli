export function handleDarts(
  score: number
) {
  if (score >= 150) {
    return {
      reward: "x3",
      moneyWon: 10,
    };
  }

  if (score >= 100) {
    return {
      reward: "x2",
      moneyWon: 5,
    };
  }

  return {
    reward: "none",
    moneyWon: 0,
  };
}