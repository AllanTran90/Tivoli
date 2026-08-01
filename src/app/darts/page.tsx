"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import DartBoard from "@/components/darts/DartBoard";
import GameButton from "@/components/GameButton";
import History from "@/components/History";
import InfoBar from "@/components/darts/Infobar";
import ThrowButton from "@/components/darts/throwButton";
import HowToPlay from "@/components/HowToPlay";
import BackToLoopland from "@/components/BackToLoopland";
import GameSessionBar from "@/components/GameSessionBar";
import { useWallet } from "@/context/WalletContext";
import { useGameSession } from "@/hooks/useGameSession";
import { useKeyboardAim } from "@/lib/darts/useKeyboardAim";
import { DARTS_COST, WINDS } from "@/lib/darts/constants";
import { resetDartsRound } from "@/lib/darts/resetDartsRound";
import { saveScore } from "@/lib/leaderboard";
import { playGame } from "@/lib/playGame";

export default function DartsPage() {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [history, setHistory] = useState<string[]>([]);
  const [clearBoard, setClearBoard] = useState(false);
  const [wind, setWind] = useState("Left");
  const [aimX, setAimX] = useState(300);
  const [aimY, setAimY] = useState(300);
  const [keyboardThrow, setKeyboardThrow] = useState(false);

  const { plays, setPlays } = useWallet();
  const { identityToken, userName, playerName, setPlayerName, bankError, setBankError } =
    useGameSession("/darts");

  useKeyboardAim({ setAimX, setAimY, onThrow: throwRandomDart });

  function getRandomWind(): string {
    return WINDS[Math.floor(Math.random() * WINDS.length)];
  }

  function throwRandomDart(): void {
    if (throwsLeft <= 0) return;
    setKeyboardThrow(true);
    setTimeout(() => setKeyboardThrow(false), 100);
  }

  async function handleScore(points: number): Promise<void> {
    if (throwsLeft <= 0) return;

    const newScore = score + points;
    const newThrowsLeft = throwsLeft - 1;

    setScore((prev) => prev + points);
    setHistory((prev) => [...prev, `Throw ${prev.length + 1} → ${points}`]);
    setThrowsLeft((prev) => prev - 1);

    if (newThrowsLeft <= 0) {
      const heartsWon = newScore >= 150 ? 10 : newScore >= 100 ? 5 : 0;

      if (identityToken) {
        const apiResult = await playGame({
          game: "darts",
          score: newScore,
          amount: DARTS_COST,
          identityToken,
        });

        if (!apiResult.success) {
          setBankError(apiResult.error ?? "Betalning misslyckades");
        }
      }

      if (heartsWon > 0) {
        setPlays(plays - DARTS_COST + heartsWon);
      }

      await saveScore("darts", playerName || "Anonymous", newScore);
    }

    setWind(getRandomWind());

    if (newScore >= 150) {
      confetti({ particleCount: 200, spread: 120 });
    }
  }

  function resetRound(): void {
    setPlays(plays - DARTS_COST);
    resetDartsRound(setScore, setHistory, setThrowsLeft, setWind, setClearBoard, getRandomWind);
  }

  return (
    <main className="darts-main">
      <BackToLoopland />

      <GameSessionBar
        userName={userName}
        bankError={bankError}
        playerName={playerName}
        setPlayerName={setPlayerName}
      />

      <InfoBar score={score} throwsLeft={throwsLeft} wind={wind} />

      <DartBoard
        onScore={handleScore}
        throwsLeft={throwsLeft}
        wind={wind}
        clearBoard={clearBoard}
        aimX={aimX}
        aimY={aimY}
        keyboardThrow={keyboardThrow}
      />

      <ThrowButton onThrow={throwRandomDart} />

      <HowToPlay
        title="How To Play"
        steps={[
          "Each round costs 3 ❤️",
          "You get 3 darts",
          "Use arrow keys to aim",
          "Press SPACE or Throw button",
          "Reach 150 points for +10 ❤️",
          "Reach 100 points for +5 ❤️",
          "Write your alias for a chance to enter the leaderboard 🏆",
        ]}
      />

      <History title="Throw History" items={history} />

      {throwsLeft <= 0 && <GameButton text="Play Again" onClick={resetRound} />}
    </main>
  );
}
