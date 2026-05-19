"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import HowToPlay from "@/components/HowToPlay";
import css from "style.css";
import { useWallet } from "@/context/WalletContext";
import BetInput from "../chocolateWheel/components/BetInput";
import GameButton from "@/components/Gamebutton";
import History from "@/components/History";

export default function ReactionRushPage() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const {balance, setBalance} = useWallet();
  const [bet, setBet]= useState(5);
  const [history, setHistory] = useState<string[]>([]);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && startTime) {
      interval = setInterval(() => {
        const now = Date.now();

        setCurrentTime((now - startTime) / 1000);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

  function startGame() {
    if (bet > balance) return;

    setTime(null);
    setCurrentTime(0);
    setStartTime(Date.now());
    setIsPlaying(true);
  }

async function stopGame() {
  if (!startTime) return;

  const roundedTime = currentTime.toFixed(2);

  setTime(currentTime);
  setIsPlaying(false);
  const difference =
  Math.abs(10 - currentTime).toFixed(2);

setHistory((prev) => [
  `⏱️ ${roundedTime}s | Diff: ${difference}s`,
  ...prev,
]);

  if (roundedTime === "10.00") {
    await setBalance(balance + bet * 10);

    confetti({
      particleCount: 150,
      spread: 120,
    });
  } else {
    await setBalance(balance - bet);
  }
}
  return (
    <main>
      <div className="center-panel">
        <h1>⏱️ Reaction Rush</h1>
        <br />

        <HowToPlay
          title="How  To Play"
          steps={[
            "Press start to start the game",
            "Wait carefully",
            "Press Stop at exactly 10.00",
            "Closest time wins",
          ]}
        />
        <br />
        <h2>{currentTime.toFixed(2)}</h2>

        <BetInput
            bet={bet}
            balance={balance}
            onChange={setBet}
            />

        <GameButton 
        text= "Play"
        onClick={startGame}
        />

        <GameButton 
        text= "Stop"
        onClick={stopGame}
        />

        <GameButton
        text="Reset"
        onClick={() => {
          setTime(0);
          setCurrentTime(0);
          setStartTime(null);
          setIsPlaying(false);
        }}
        />

        {time && (
          <div>
            <p>Your Time: {time.toFixed(2)}</p>

            <p>
              Difference:
              {Math.abs(10 - time).toFixed(2)}
            </p>
            <History items={history} />
          </div>
        )}
      </div>
    </main>
  );
}
