"use client";

import DartBoard from "@/components/darts/DartBoard";
import { useState, useEffect } from "react";
import GameButton from "@/components/GameButton";
import History from "@/components/History";
import confetti from "canvas-confetti";
import { useWallet } from "@/context/WalletContext";
import { playDartsRound } from "@/lib/darts/playDartsRound";
import { DARTS_COST, WINDS } from "@/lib/darts/constants";
import { resetDartsRound } from "@/lib/darts/resetDartsRound";
import ThrowButton from "@/components/darts/throwButton";
import { useKeyboardAim } from "@/lib/darts/useKeyboardAim";
import styles from "./darts.module.css";
import InfoBar from "@/components/darts/Infobar";
import HowToPlay from "@/components/HowToPlay";
import { saveScore } from "@/lib/leaderboard";
import BackToLoopland from "@/components/BackToLoopland";
import PlayerNameInput from "../leaderboard/PlayerNameInput";

export default function DartsPage() {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [history, setHistory] = useState<string[]>([]);
  const [clearBoard, setClearBoard] = useState(false);
  const [wind, setWind] = useState("Left");
  const [aimX, setAimX] = useState(300);
  const [aimY, setAimY] = useState(300);

  const { plays, setPlays } = useWallet();

  const [keyboardThrow, setKeyboardThrow] =
    useState(false);

  const [identityToken, setIdentityToken] =
    useState<string | null>(null);

  const [playerName, setPlayerName] =
    useState("");

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("identity_token");

    console.log(
      "TOKEN FROM URL:",
      token
    );

    if (token) {
      setIdentityToken(token);

      window.history.replaceState(
        {},
        "",
        "/darts"
      );
    } else {
      console.log(
        "No identity token found"
      );
    }
  }, []);

  useKeyboardAim({
    setAimX,
    setAimY,
    onThrow: throwRandomDart,
  });

  function getRandomWind() {
    return WINDS[
      Math.floor(
        Math.random() *
          WINDS.length
      )
    ];
  }

  function throwRandomDart() {
    if (throwsLeft <= 0) return;

    setKeyboardThrow(true);

    setTimeout(
      () =>
        setKeyboardThrow(false),
      100
    );
  }

  async function handleScore(
    points: number
  ) {
    if (throwsLeft <= 0) return;

    setScore(
      (prev) => prev + points
    );

    setHistory((prev) => [
      ...prev,
      `Throw ${
        prev.length + 1
      } → ${points}`,
    ]);

    setThrowsLeft(
      (prev) => prev - 1
    );

    const newThrowsLeft =
      throwsLeft - 1;

    const finalScore =
      score + points;

    if (
      newThrowsLeft <= 0 &&
      identityToken
    ) {
      try {
        await playDartsRound(
          finalScore,
          identityToken
        );

        await saveScore(
          "darts",
          playerName ||
            "Anonymous",
          finalScore,
          
        );
      } catch (error) {
        console.error(error);
      }
    }

    setWind(getRandomWind());

    if (
      score + points >= 150
    ) {
      confetti({
        particleCount: 200,
        spread: 120,
      });
    }
  }

  function resetRound() {
    setPlays(
      plays - DARTS_COST
    );

    resetDartsRound(
      setScore,
      setHistory,
      setThrowsLeft,
      setWind,
      setClearBoard,
      getRandomWind
    );
  }

  return (
    <main className={styles.main}>
      <BackToLoopland />

      <InfoBar
        score={score}
        throwsLeft={throwsLeft}
        wind={wind}
      />

      <PlayerNameInput
        playerName={playerName}
        setPlayerName={
          setPlayerName
        }
      />

      <DartBoard
        onScore={handleScore}
        throwsLeft={throwsLeft}
        wind={wind}
        clearBoard={clearBoard}
        aimX={aimX}
        aimY={aimY}
        keyboardThrow={
          keyboardThrow
        }
      />

      <ThrowButton
        onThrow={throwRandomDart}
      />

      <HowToPlay
        title="How To Play"
        steps={[
          "Each round costs 1 ❤️",
          "You get 3 darts",
          "Use arrow keys to aim",
          "Press SPACE or Throw button",
          "Reach 150 points to win ❤️",
          "180 points gives bonus ❤️",
          "Write your alias for a chance to enter the leaderboard 🏆"
        ]}
      />

      <History
        title="Throw History"
        items={history}
      />

      {throwsLeft <= 0 && (
        <GameButton
          text="Play Again"
          onClick={resetRound}
        />
      )}
    </main>
  );
}