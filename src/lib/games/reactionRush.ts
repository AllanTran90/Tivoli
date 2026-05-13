export function handleReactionRush(
  reactionTime: number
) {
  if (reactionTime < 0.1) {
    return {
      reward: "Perfect! €10",
      moneyWon: 10,
    };
  }

  if (reactionTime < 0.2) {
    return {
      reward: "Nice! €5",
      moneyWon: 5,
    };
  }

  return {
    reward: "Nice try, try again",
    moneyWon: 0,
  };
}