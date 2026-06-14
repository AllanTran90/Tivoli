export function handleReactionRush(reactionTime: number) {
  const diff = Math.abs(10 - reactionTime);

  if (diff < 0.5) {
    return { reward: "Perfect! €10", moneyWon: 10 };
  }

  if (diff < 1.5) {
    return { reward: "Nice! €5", moneyWon: 5 };
  }

  return { reward: "Nice try, try again", moneyWon: 0 };
}