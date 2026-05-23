"use client";

import DartBoard from "@/components/darts/DartBoard";
import GamePanel from "@/components/darts/GamePanel";
import { useState, useEffect } from "react";
import GameButton from "@/components/Gamebutton";
import HowToPlay from "@/components/HowToPlay";
import History from "@/components/History";
import RewardSystem from "@/components/RewardSystem";
import confetti from "canvas-confetti";
import { useWallet } from "@/context/WalletContext";
import { playDartsRound } from "@/lib/darts/playDartsRound";
import { DARTS_COST, WINDS } from "@/lib/darts/constants";
import { resetDartsRound } from "@/lib/darts/resetDartsRound";
import ThrowButton from "@/components/darts/throwButton";
import { useKeyboardAim } from "@/lib/darts/useKeyboardAim";
import styles from ".@/components/darts/Darts.module.css";

export default function DartsPage() {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [history, setHistory] = useState<string[]>([]);
  const [clearBoard, setClearBoard] = useState(false);
  const [wind, setWind] = useState("Left");
  const [aimX, setAimX] = useState(300);
  const [aimY, setAimY] = useState(300);
  const { balance, setBalance } = useWallet();
  const [keyboardThrow, setKeyboardThrow] = useState(false);

  useKeyboardAim({
    setAimX,
    setAimY,
    onThrow: throwRandomDart,
  });

  function getRandomWind() {
    const random = Math.floor(Math.random() * WINDS.length);

    return WINDS[random];
  }

  // keyboard throwing
  function throwRandomDart() {
    if (throwsLeft <= 0) return;

    setKeyboardThrow(true);

    setTimeout(() => {
      setKeyboardThrow(false);
    }, 100);
  }

  async function handleScore(points: number) {
    // the throwings
    if (throwsLeft <= 0) return;

    // updates score
    setScore((prev) => prev + points);

    // updates history
    setHistory((prev) => [...prev, `Throw ${prev.length + 1} → ${points}`]);

    // substracts throws
    setThrowsLeft((prev) => prev - 1);

    const newThrowsLeft = throwsLeft - 1;

    const finalScore = score + points;

    if (newThrowsLeft <= 0) {
      try {
        const data = await playDartsRound(finalScore);

        console.log(data);

        if (data.gameResult.moneyWon) {
          setBalance(balance + data.gameResult.moneyWon);

          setHistory((prev) => [...prev, `Won €${data.gameResult.moneyWon}`]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // new wind
    setWind(getRandomWind());

    if (score + points >= 150) {
      confetti({
        particleCount: 200,
        spread: 120,
      });
    }
  }

  // RESET ROUND
  function resetRound() {
    setBalance(balance - DARTS_COST);

    resetDartsRound(
      setScore,
      setHistory,
      setThrowsLeft,
      setWind,
      setClearBoard,
      getRandomWind,
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#5232a3ff",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        padding: "40px",
      }}
    >
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <HowToPlay
          title="How To Play"
          steps={[
            "Each game costs €3 to play",
            "You'll get 3 throws",
            "Bulleyes gives bonus points",
            "Try to get as many points as possible",
            "The outer ring gives 2x points",
            "The inner ring gives 3x points",
            "You can use the arrow keys to aim and space to throw",
          ]}
        />

        <div>
          <h2>Wallet</h2>
          <p>€ {balance}</p>
        </div>

        <GamePanel score={score} throwsLeft={throwsLeft} wind={wind} />

        <History title="Throw History" items={history} />

        <RewardSystem
          value={score}
          rules={[
            {
              condition: (v) => v >= 150,
              reward: "x3 Money",
            },
            {
              condition: (v) => v >= 100,
              reward: "x2 Money",
            },
          ]}
        />

        {throwsLeft <= 0 && (
          <GameButton text="Play Again" onClick={resetRound} />
        )}
      </div>
    </main>
  );
}
