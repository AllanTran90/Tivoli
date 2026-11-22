"use client";

import BetInput from "@/components/BetInput";
import GameButton from "@/components/GameButton";
import GameLayout from "@/components/GameLayout";
import History from "@/components/History";
import HowToPlay from "@/components/HowToPlay";
import { useReactionGame } from "@/hooks/useReactionGame";
import { REACTION_RUSH } from "@/lib/games/catalog";
import styles from "./reactionRush.module.css";

const HOW_TO_STEPS = [
  "Write your name, it goes on the leaderboard 🏆",
  "Choose your bet",
  "Press SPACE or Play to start the clock",
  "Press SPACE or Stop at exactly 10.00",
  "Exactly 10.00 gives +3 ❤️",
  "Within 0.10 seconds gives +1 ❤️",
  "Otherwise you lose your bet",
];

function resultFor(time: number): { label: string; tone: string } {
  const diff = Math.abs(10 - time);
  if (time.toFixed(2) === "10.00") return { label: "🎯 Perfect!", tone: styles.perfect };
  if (diff <= 0.1) return { label: "🔥 So close!", tone: styles.close };
  return { label: `${diff.toFixed(2)}s off`, tone: styles.miss };
}

export default function ReactionRushPage() {
  const { currentTime, time, isPlaying, bet, maxBet, setBet, history, handleGame, reset, ...session } = useReactionGame();
  const result = !isPlaying && time !== null ? resultFor(time) : null;

  return (
    <GameLayout
      icon={REACTION_RUSH.icon}
      title={REACTION_RUSH.name}
      tagline={REACTION_RUSH.tagline}
      accent={REACTION_RUSH.accent}
      {...session}
      sidebar={
        <>
          <HowToPlay steps={HOW_TO_STEPS} />
          <History items={history} />
        </>
      }
    >
      <div className={styles.display} data-playing={isPlaying || undefined}>
        <p className={styles.target}>Target 10.00</p>
        <p className={styles.timer} aria-live="off">
          {currentTime.toFixed(2)}
        </p>
        <p className={`${styles.result} ${result?.tone ?? ""}`} aria-live="polite">
          {isPlaying
            ? "Press SPACE to stop"
            : !session.hasPlayerName
              ? "✍️ Write your name to start"
              : (result?.label ?? "Press SPACE to start")}
        </p>
      </div>

      <div className={styles.controls}>
        <BetInput bet={bet} max={maxBet} disabled={isPlaying} onChange={setBet} />
        <div className={styles.buttons}>
          <GameButton text={isPlaying ? "⏹ Stop" : "▶ Play"} onClick={handleGame} disabled={!isPlaying && !session.hasPlayerName} />
          <GameButton text="Reset" variant="secondary" onClick={reset} disabled={isPlaying} />
        </div>
      </div>
    </GameLayout>
  );
}
