import type { ReactionReward } from "@/types/api";

export function getReactionReward(
  currentTime: number,
  bet: number
): ReactionReward {
  const roundedTime = currentTime.toFixed(2);
  const diff = Math.abs(10 - currentTime);

  if (roundedTime === "10.00") {
    return { reward: 3, message: "🎯 PERFECT 10.00! +3 ❤️", confetti: true };
  }

  if (diff <= 0.1) {
    return { reward: 1, message: "🔥 SUPER CLOSE! +1 ❤️", confetti: true };
  }

  return { reward: -bet, message: `❌ LOST -${bet} ❤️`, confetti: false };
}
