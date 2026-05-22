"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

import HowToPlay from "@/components/HowToPlay";
import { useWallet } from "@/context/WalletContext";

import BetInput from "../chocolateWheel/components/BetInput";
import GameButton from "@/components/Gamebutton";
import History from "@/components/History";

import { playGame } from "@/lib/playGame";

export default function ReactionRushPage() {
  const [startTime, setStartTime] =
    useState<number | null>(null);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [time, setTime] =
    useState<number | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const { balance, setBalance } =
    useWallet();

  const [bet, setBet] = useState(2);

  const [history, setHistory] =
    useState<string[]>([]);

  const [identityToken, setIdentityToken] =
    useState<string | null>(null);

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("identity_token");

    setIdentityToken(token);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && startTime) {
      interval = setInterval(() => {
        const now = Date.now();

        setCurrentTime(
          (now - startTime) / 1000
        );
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

    const roundedTime =
      currentTime.toFixed(2);

    setTime(currentTime);

    setIsPlaying(false);

    const difference =
      Math.abs(
        10 - currentTime
      ).toFixed(2);

    setHistory((prev) => [
      `⏱️ ${roundedTime}s | Diff: ${difference}s`,
      ...prev,
    ]);

    try {
      const data = await playGame({
        game: "reaction-rush",
        reactionTime: currentTime,
        amount: -bet,
        identityToken:
          identityToken || "",
      });

      console.log(data);

      if (data.result.moneyWon) {
        await setBalance(
          balance +
            data.result.moneyWon
        );

        confetti({
          particleCount: 150,
          spread: 120,
        });

        setHistory((prev) => [
          `WON €${data.result.moneyWon}`,
          ...prev,
        ]);
      } else {
        await setBalance(
          balance - bet
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <div className="center-panel">
        <h1>⏱️ Reaction Rush</h1>

        <br />

        <HowToPlay
          title="How To Play"
          steps={[
            "Press start to start the game",
            "Wait carefully",
            "Press Stop at exactly 10.00",
            "Closest time wins",
          ]}
        />

        <br />

        <h2>
          {currentTime.toFixed(2)}
        </h2>

        <BetInput
          bet={bet}
          balance={balance}
          onChange={setBet}
        />

        <GameButton
          text="Play"
          onClick={startGame}
        />

        <GameButton
          text="Stop"
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
            <p>
              Your Time:
              {time.toFixed(2)}
            </p>

            <p>
              Difference:
              {Math.abs(
                10 - time
              ).toFixed(2)}
            </p>

            <History items={history} />
          </div>
        )}
      </div>
    </main>
  );
}