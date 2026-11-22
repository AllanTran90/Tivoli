import { useState } from "react";
import triggerWinConfetti from "@/lib/confetti";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { useKeyboard } from "@/hooks/useKeyboard";
import { BOARD_SIZE, CENTER, WINDS, type Wind } from "@/lib/darts/constants";
import { calculateScore } from "@/lib/darts/scoring";
import { DARTS_COST } from "@/lib/games/rules";
import { saveScore } from "@/lib/leaderboard";
import type { HitPosition } from "@/types/darts";

const THROWS_PER_ROUND = 3;
const AIM_STEP = 10;

function getRandomWind(): Wind {
  return WINDS[Math.floor(Math.random() * WINDS.length)];
}

function applyWind({ x, y }: HitPosition, wind: Wind): HitPosition {
  const strength = Math.floor(Math.random() * 20) + 5;
  if (wind === "Left") return { x: x - strength, y };
  if (wind === "Right") return { x: x + strength, y };
  if (wind === "Up") return { x, y: y - strength };
  return { x, y: y + strength };
}

const clampAim = (value: number) => Math.max(0, Math.min(BOARD_SIZE, value));

export function useDartsGame() {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(THROWS_PER_ROUND);
  const [hits, setHits] = useState<HitPosition[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [wind, setWind] = useState<Wind>("Left");
  const [aimX, setAimX] = useState(CENTER);
  const [aimY, setAimY] = useState(CENTER);

  const wallet = useWallet();
  const session = useGameSession("/darts");

  // En ny omgång kräver att man har råd. Påbörjade omgångar får alltid spelas klart.
  const roundStarted = throwsLeft < THROWS_PER_ROUND;
  const canThrow = throwsLeft > 0 && (roundStarted || wallet.canAfford(DARTS_COST));

  async function finishRound(finalScore: number): Promise<void> {
    const response = await wallet.play({ game: "darts", score: finalScore });
    if (!response.success || !response.result) {
      session.setBankError(response.error ?? "Betalning misslyckades");
      return;
    }
    wallet.settle(response);
    const won = response.result.moneyWon;
    setHistory((prev) => [...prev, won > 0 ? `🎉 ${finalScore} points → +${won} ❤️` : `${finalScore} points → -${DARTS_COST} ❤️`]);
    if (won > 0) triggerWinConfetti();
    await saveScore("darts", session.playerName || "Anonymous", finalScore);
  }

  function throwDart(target: HitPosition): void {
    if (!canThrow) return;
    session.setBankError(null);

    const hit = applyWind(target, wind);
    const points = calculateScore(hit);
    const newScore = score + points;
    const newThrowsLeft = throwsLeft - 1;

    setHits((prev) => [...prev, hit]);
    setScore(newScore);
    setThrowsLeft(newThrowsLeft);
    setHistory((prev) => [...prev, `Throw ${THROWS_PER_ROUND - newThrowsLeft} → ${points}`]);
    setWind(getRandomWind());

    if (newThrowsLeft === 0) void finishRound(newScore);
  }

  function throwAtAim(): void {
    throwDart({ x: aimX, y: aimY });
  }

  useKeyboard({
    ArrowUp: () => setAimY((y) => clampAim(y - AIM_STEP)),
    ArrowDown: () => setAimY((y) => clampAim(y + AIM_STEP)),
    ArrowLeft: () => setAimX((x) => clampAim(x - AIM_STEP)),
    ArrowRight: () => setAimX((x) => clampAim(x + AIM_STEP)),
    Space: throwAtAim,
  });

  function resetRound(): void {
    session.setBankError(null);
    setScore(0);
    setHits([]);
    setHistory([]);
    setThrowsLeft(THROWS_PER_ROUND);
    setWind(getRandomWind());
  }

  return { score, throwsLeft, hits, history, wind, aimX, aimY, canThrow, throwDart, throwAtAim, resetRound, ...session };
}
