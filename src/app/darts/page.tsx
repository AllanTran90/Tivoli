"use client";

import DartBoard from "@/components/darts/DartBoard";
import GameButton from "@/components/GameButton";
import GameLayout from "@/components/GameLayout";
import History from "@/components/History";
import HowToPlay from "@/components/HowToPlay";
import InfoBar from "@/components/darts/Infobar";
import { useDartsGame } from "@/hooks/useDartsGame";
import { DARTS } from "@/lib/games/catalog";
import { DARTS_COST } from "@/lib/games/rules";
import styles from "./darts.module.css";

const HOW_TO_STEPS = [
  `Each round costs ${DARTS_COST} ❤️ and gives you 3 darts`,
  "Aim with the arrow keys or click the board",
  "Press SPACE or Throw to throw at the green dot",
  "Watch the wind, it pushes your dart",
  "100+ points gives +5 ❤️, 150+ gives +10 ❤️",
  "Write your name first, it goes on the leaderboard 🏆",
];

export default function DartsPage() {
  const { score, throwsLeft, hits, history, wind, aimX, aimY, canThrow, throwDart, throwAtAim, resetRound, ...session } = useDartsGame();
  const needsName = !session.hasPlayerName && throwsLeft === 3;

  return (
    <GameLayout
      icon={DARTS.icon}
      title={DARTS.name}
      tagline={DARTS.tagline}
      accent={DARTS.accent}
      {...session}
      sidebar={
        <>
          <HowToPlay steps={HOW_TO_STEPS} />
          <History title="Throw history" items={history} />
        </>
      }
    >
      <InfoBar score={score} throwsLeft={throwsLeft} wind={wind} />

      <div className={styles.board}>
        <DartBoard hits={hits} aimX={aimX} aimY={aimY} disabled={!canThrow} onThrow={throwDart} />
      </div>

      {needsName && <p className={styles.needsName}>✍️ Write your name to start playing</p>}

      <div className={styles.controls}>
        {throwsLeft > 0 ? (
          <GameButton text="🎯 Throw dart" onClick={throwAtAim} disabled={!canThrow} />
        ) : (
          <GameButton text="Play again" onClick={resetRound} />
        )}
      </div>

      <p className={styles.hint}>
        <kbd>←</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>→</kbd> aim · <kbd>Space</kbd> throw
      </p>
    </GameLayout>
  );
}
