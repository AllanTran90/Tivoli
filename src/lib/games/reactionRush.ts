async function goToReactionRush() {
  const res = await fetch("https://api.loopland.se/identity-tokens", {
    method: "POST",
    headers: {
      "X-Access-Key": "6feeb453-e4a5-4f64-8160-30bd57f31c22"
    },
  });

  const data = await res.json();
  const token = data.identity_token;

  // Redirecta med token i URL
  window.location.href = `/reactionRush?identity_token=${token}`;
}

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