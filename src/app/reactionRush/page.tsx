"use client";

import confetti from "canvas-confetti";
import { useEffect, useState, useCallback } from "react";
import HowToPlay from "@/components/HowToPlay";
import "./style.css";
import { useWallet } from "@/context/WalletContext";
import BetInput from "../chocolateWheel/components/BetInput";
import GameButton from "@/components/Gamebutton";
import History from "@/components/History";
import { playGame } from "@/lib/playGame";
import useSpaceKey from "@/hooks/useSpaceKey";

export default function ReactionRushPage() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { balance, setBalance } = useWallet();
  const [bet, setBet] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const [identityToken, setIdentityToken] = useState<string | null>(null);

  // TIMER
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

  // GET TOKEN FROM URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("identity_token");
    console.log(token);
    setIdentityToken(token);
  }, []);

  // START GAME
  function startGame() {
    if (bet > balance) return;

    setTime(null);
    setCurrentTime(0);
    setStartTime(Date.now());
    setIsPlaying(true);
  }

  // STOP GAME
  async function stopGame() {
    if (!startTime) return;

    const roundedTime = currentTime.toFixed(2);
    setTime(currentTime);
    setIsPlaying(false);

    const difference = Math.abs(10 - currentTime).toFixed(2);

    setHistory((prev) => [
      `⏱️ ${roundedTime}s | Diff: ${difference}s`,
      ...prev,
    ]);

    try {
      const data = await playGame({
        game: "reaction-rush",
        reactionTime: currentTime,
        amount: bet,
        identityToken: identityToken || "123e4567-e89b-12d3-a456-426614174000",
      });

      console.log(data);

      if (data.success && data.result?.moneyWon > 0) {
        const winnings = data.result.moneyWon;

        await setBalance(balance + winnings);

        confetti({
          particleCount: 150,
          spread: 120,
        });

        setHistory((prev) => [`💰 WON €${winnings}`, ...prev]);
      } else {
        await setBalance(balance - bet);

        setHistory((prev) => [`❌ LOST €${bet}`, ...prev]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // SPACE KEY CONTROLS
  const handleGame = useCallback(async () => {
    if (isPlaying) {
      await stopGame();
    } else {
      startGame();
    }
  }, [isPlaying, currentTime]);

  useSpaceKey({
    action: handleGame,
  });

  return (
    <main>
      <div className="center-panel">
        <h1>⏱️ Reaction Rush</h1>

        <p>Press SPACE to play</p>

        <br />

        <HowToPlay
          title="How To Play"
          steps={[
            "Press SPACE or Play to start",
            "Wait carefully",
            "Press SPACE or Stop at exactly 10.00",
            "Closest time wins",
          ]}
        />

        <br />

        <h2>{currentTime.toFixed(2)}</h2>

        <BetInput bet={bet} balance={balance} onChange={setBet} />

        <GameButton text={isPlaying ? "Stop" : "Play"} onClick={handleGame} />

        <GameButton
          text="Reset"
          onClick={() => {
            setTime(0);
            setCurrentTime(0);
            setStartTime(null);
            setIsPlaying(false);
          }}
        />

        {time !== null && (
          <div>
            <p>Your Time: {time.toFixed(2)}</p>

            <p>Difference: {Math.abs(10 - time).toFixed(2)}</p>

            <History items={history} />
          </div>
        )}
      </div>
    </main>
  );
}
