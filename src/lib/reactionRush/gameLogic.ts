export function getReactionReward(
  currentTime: number,
  bet: number
) {
  const roundedTime =
    currentTime.toFixed(2);

  const diff =
    Math.abs(10 - currentTime);

  // PERFECT
  if (roundedTime === "10.00") {
    return {
      reward: 3,
      message:
        "🎯 PERFECT 10.00! +3 ❤️",
      confetti: true,
    };
  }

  // SUPER CLOSE
  if (diff <= 0.1) {
    return {
      reward: 1,
      message:
        "🔥 SUPER CLOSE! +1 ❤️",
      confetti: true,
    };
  }

  // LOSE
  return {
    reward: -bet,
    message: `❌ LOST -${bet} ❤️`,
    confetti: false,
  };
}