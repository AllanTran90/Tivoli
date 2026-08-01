import confetti from "canvas-confetti";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { getReactionReward } from "@/lib/reactionRush/gameLogic";
import { saveScore } from "@/lib/leaderboard";
import { playGame } from "@/lib/playGame";

export function useReactionGame() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bet, setBet] = useState(1);
  const [history, setHistory] = useState<string[]>([]);

  const { plays, setPlays } = useWallet();
  const session = useGameSession("/reactionRush");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && startTime) {
      interval = setInterval(() => setCurrentTime((Date.now() - startTime) / 1000), 10);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

  function startGame(): void {
    if (bet > plays) return;
    setTime(null);
    setCurrentTime(0);
    setStartTime(Date.now());
    setIsPlaying(true);
  }

  async function stopGame(): Promise<void> {
    if (!startTime) return;
    setTime(currentTime);
    setIsPlaying(false);
    const difference = Math.abs(10 - currentTime).toFixed(2);
    setHistory((prev) => [`⏱️ ${currentTime.toFixed(2)}s | Diff: ${difference}s`, ...prev]);
    const result = getReactionReward(currentTime, bet);
    await saveScore("reactionRush", session.playerName || "Anonymous", Math.floor(currentTime));
    if (session.identityToken) {
      const apiResult = await playGame({ game: "reaction-rush", reactionTime: currentTime, amount: bet, identityToken: session.identityToken });
      if (!apiResult.success) session.setBankError(apiResult.error ?? "Betalning misslyckades");
    }
    await setPlays(plays + result.reward);
    if (result.confetti) confetti({ particleCount: 150, spread: 120 });
    setHistory((prev) => [result.message, ...prev]);
  }

  function reset(): void {
    setTime(0);
    setCurrentTime(0);
    setStartTime(null);
    setIsPlaying(false);
  }

  const handleGame = useCallback(async () => {
    if (isPlaying) await stopGame();
    else startGame();
  }, [isPlaying, currentTime]);

  return { currentTime, time, isPlaying, bet, setBet, history, plays, handleGame, reset, ...session };
}
