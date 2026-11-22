import { useState, useEffect } from "react";
import triggerWinConfetti from "@/lib/confetti";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { useKeyboard } from "@/hooks/useKeyboard";
import { clampBet, MAX_BET, MIN_BET } from "@/lib/games/rules";
import { saveScore } from "@/lib/leaderboard";

export function useReactionGame() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bet, setBetRaw] = useState(MIN_BET);
  const [history, setHistory] = useState<string[]>([]);

  const wallet = useWallet();
  const session = useGameSession("/reactionRush");

  // Högsta insats: det man har i Tivoli-banken (max MAX_BET). I Loopland-läge vet vi inte saldot.
  const maxBet = wallet.bank === "tivoli" && wallet.balance !== null ? Math.max(MIN_BET, Math.min(wallet.balance, MAX_BET)) : MAX_BET;
  const stake = clampBet(bet, maxBet);

  useEffect(() => {
    if (!isPlaying || startTime === null) return;
    const interval = setInterval(() => setCurrentTime((Date.now() - startTime) / 1000), 10);
    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

  function startGame(): void {
    if (!wallet.canAfford(stake)) {
      session.setBankError("Not enough hearts");
      return;
    }
    session.setBankError(null);
    setTime(null);
    setCurrentTime(0);
    setStartTime(Date.now());
    setIsPlaying(true);
  }

  async function stopGame(): Promise<void> {
    if (startTime === null) return;
    // Exakt tid vid tryckningen, inte timerns senaste uppdatering.
    const elapsed = Math.max(0.01, (Date.now() - startTime) / 1000);
    setIsPlaying(false);
    setCurrentTime(elapsed);
    setTime(elapsed);

    const response = await wallet.play({ game: "reaction-rush", reactionTime: elapsed, amount: stake });
    if (!response.success || !response.result) {
      session.setBankError(response.error ?? "Betalning misslyckades");
      setHistory((prev) => [`⏱️ ${elapsed.toFixed(2)}s | ❌ ${response.error ?? "Error"}`, ...prev]);
      return;
    }

    wallet.settle(response);
    const won = response.result.moneyWon;
    const change = won > 0 ? `+${won}` : `-${stake}`;
    setHistory((prev) => [`⏱️ ${elapsed.toFixed(2)}s | ${response.result!.reward} (${change} ❤️)`, ...prev]);
    if (won > 0) triggerWinConfetti();
    await saveScore("reactionRush", session.playerName || "Anonymous", parseFloat(elapsed.toFixed(2)));
  }

  function handleGame(): void {
    if (isPlaying) void stopGame();
    else startGame();
  }

  function reset(): void {
    setTime(null);
    setCurrentTime(0);
    setStartTime(null);
    setIsPlaying(false);
  }

  useKeyboard({ Space: handleGame });

  function setBet(value: number): void {
    setBetRaw(clampBet(value, maxBet));
  }

  return { currentTime, time, isPlaying, bet: stake, maxBet, setBet, history, balance: wallet.balance, handleGame, reset, ...session };
}
