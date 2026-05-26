"use client";

import confetti from "canvas-confetti";
import { useEffect, useState, useCallback } from "react";
import BackToLoopland from "@/components/BackToLoopland";
import HowToPlay from "@/components/HowToPlay";
import Module from "@/app/reactionRush/reactionRush.module.css";
import { useWallet } from "@/context/WalletContext";
import BetInput from "../chocolateWheel/components/BetInput";
import GameButton from "@/components/GameButton";
import History from "@/components/History";
import useSpaceKey from "@/hooks/useSpaceKey";
import { getReactionReward } from "@/lib/reactionRush/gameLogic";
import PlayerNameInput from "../leaderboard/PlayerNameInput";
import { saveScore } from "@/lib/leaderboard";

export default function ReactionRushPage() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { plays, setPlays } = useWallet();
  const [bet, setBet] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");

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
    if (bet > plays) return;

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

    const result = getReactionReward(currentTime, bet);

    await saveScore("reactionRush", playerName || "Anonymous", Number(Math.floor(currentTime)));

    await setPlays(plays + result.reward);

    if (result.confetti) {
      confetti({
        particleCount: 150,
        spread: 120,
      });
    }

    setHistory((prev) => [result.message, ...prev]);
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
      <BackToLoopland />

      <div className={Module.container}>
        <div className={Module["center-panel"]}>
          <h1>⏱️ Reaction Rush</h1>

          <p>Press SPACE to play</p>

          <br />

          <HowToPlay
            title="How To Play"
            steps={[
              "Press SPACE or Play to start",
              "Wait carefully",
              "Press SPACE or Stop at exactly 10.00",
              "10.00 gives +3 ❤️",
              "Within 0.1 gives +1 ❤️",
              "Write your alias for a chance to enter the leaderboard 🏆"
            ]}
          />

          <br />

          <h2>{currentTime.toFixed(2)}</h2>

          <BetInput bet={bet} balance={plays} onChange={setBet} />

          <PlayerNameInput
            playerName={playerName}
            setPlayerName={setPlayerName}
          />

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
      </div>
    </main>
  );
}
