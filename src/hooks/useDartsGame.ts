import { useState } from "react";
import confetti from "canvas-confetti";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { useKeyboardAim } from "@/lib/darts/useKeyboardAim";
import { DARTS_COST, WINDS } from "@/lib/darts/constants";
import { resetDartsRound } from "@/lib/darts/resetDartsRound";
import { saveScore } from "@/lib/leaderboard";
import { playGame } from "@/lib/playGame";

export function useDartsGame() {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [history, setHistory] = useState<string[]>([]);
  const [clearBoard, setClearBoard] = useState(false);
  const [wind, setWind] = useState("Left");
  const [aimX, setAimX] = useState(300);
  const [aimY, setAimY] = useState(300);
  const [keyboardThrow, setKeyboardThrow] = useState(false);

  const { plays, setPlays } = useWallet();
  const session = useGameSession("/darts");

  function getRandomWind(): string {
    return WINDS[Math.floor(Math.random() * WINDS.length)];
  }

  function throwRandomDart(): void {
    if (throwsLeft <= 0) return;
    setKeyboardThrow(true);
    setTimeout(() => setKeyboardThrow(false), 100);
  }

  useKeyboardAim({ setAimX, setAimY, onThrow: throwRandomDart });

  async function handleScore(points: number): Promise<void> {
    if (throwsLeft <= 0) return;
    const newScore = score + points;
    const newThrowsLeft = throwsLeft - 1;
    setScore((prev) => prev + points);
    setHistory((prev) => [...prev, `Throw ${prev.length + 1} → ${points}`]);
    setThrowsLeft((prev) => prev - 1);

    if (newThrowsLeft <= 0) {
      const heartsWon = newScore >= 150 ? 10 : newScore >= 100 ? 5 : 0;
      if (session.identityToken) {
        const apiResult = await playGame({ game: "darts", score: newScore, amount: DARTS_COST, identityToken: session.identityToken });
        if (!apiResult.success) session.setBankError(apiResult.error ?? "Betalning misslyckades");
      }
      if (heartsWon > 0) setPlays(plays - DARTS_COST + heartsWon);
      await saveScore("darts", session.playerName || "Anonymous", newScore);
    }

    setWind(getRandomWind());
    if (newScore >= 150) confetti({ particleCount: 200, spread: 120 });
  }

  function resetRound(): void {
    setPlays(plays - DARTS_COST);
    resetDartsRound(setScore, setHistory, setThrowsLeft, setWind, setClearBoard, getRandomWind);
  }

  return { score, throwsLeft, history, clearBoard, wind, aimX, aimY, keyboardThrow, plays, handleScore, resetRound, throwRandomDart, ...session };
}
