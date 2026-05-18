"use client";

import DartBoard from "@/components/darts/DartBoard";
import GamePanel from "@/components/darts/GamePanel";
import { useState } from "react";
import GameButton from "@/components/Gamebutton";
import HowToPlay from "@/components/HowToPlay";
import History from "@/components/History";
import RewardSystem from "@/components/RewardSystem";
import confetti from "canvas-confetti";

export default function DartsPage() {
  const [score, setScore] = useState(0);

  const [throwsLeft, setThrowsLeft] = useState(3);

  const [history, setHistory] = useState<string[]>([]);

  const [clearBoard, setClearBoard] = useState(false);

  const winds = ["Left", "Right", "Up", "Down"];

  const [wind, setWind] = useState("");

  function getRandomWind() {
    const random = Math.floor(Math.random() * winds.length);

    return winds[random];
  }

  function handleScore(points: number) {
    // stoppa fler kast
    if (throwsLeft <= 0) return;

    // uppdatera score
    setScore((prev) => prev + points);

    // uppdatera history
    setHistory((prev) => [...prev, `Throw ${prev.length + 1} → ${points}`]);

    // minska kast
    setThrowsLeft((prev) => prev - 1);

    // ny vind
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
    setScore(0);

    setHistory([]);

    setThrowsLeft(3);

    setClearBoard(true);

    setTimeout(() => {
      setClearBoard(false);
    }, 0);
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
      />

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
            "Each game costs €5",
            "You'll get 3 throws",
            "Bulleyes gives bonus points",
            "Try to get as many points as possible",
          ]}
        />

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
