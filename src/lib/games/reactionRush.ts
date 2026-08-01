export function handleReactionRush(reactionTime: number) {
  const diff = Math.abs(10 - reactionTime);

  if (reactionTime.toFixed(2) === "10.00") {
    return { reward: "Perfect! +3 ❤️", moneyWon: 3 };
  }

  if (diff <= 0.1) {
    return { reward: "Close! +1 ❤️", moneyWon: 1 };
  }

  return { reward: "Nice try!", moneyWon: 0 };
}