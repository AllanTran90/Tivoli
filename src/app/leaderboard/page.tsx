"use client";

import { useState, useEffect } from "react";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";
import GameSelector from "@/app/leaderboard/GameSelector";
import shell from "@/components/PageShell.module.css";
import ui from "@/components/ui.module.css";
import styles from "./leaderboard.module.css";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_STYLES = [styles.gold, styles.silver, styles.bronze];

function formatScore(game: string, score: number): { main: string; sub?: string } {
  if (game === "reactionRush") {
    return { main: `${score.toFixed(2)}s`, sub: `${Math.abs(score - 10).toFixed(2)}s off` };
  }
  return { main: `${score} pts` };
}

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState("darts");
  const [players, setPlayers] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLeaderboard(selectedGame).then((data) => {
      if (!cancelled) setPlayers(data ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedGame]);

  function selectGame(game: string): void {
    setPlayers(null);
    setSelectedGame(game);
  }

  return (
    <main className={`${shell.page} ${shell.narrow}`}>
      <header className={shell.header}>
        <h1 className={shell.title}>🏆 Leaderboard</h1>
        <p className={shell.lead}>
          {selectedGame === "reactionRush"
            ? "Closest to 10.00 seconds wins."
            : "Highest score after three darts wins."}
        </p>
      </header>

      <GameSelector selectedGame={selectedGame} setSelectedGame={selectGame} />

      <section className={ui.panel} aria-live="polite">
        {players === null ? (
          <p className={ui.empty}>Loading…</p>
        ) : players.length === 0 ? (
          <p className={ui.empty}>No scores yet. Be the first!</p>
        ) : (
          <ol className={styles.list}>
            {players.map((player, index) => {
              const score = formatScore(selectedGame, player.score);
              return (
                <li key={player.id} className={`${styles.row} ${RANK_STYLES[index] ?? ""}`}>
                  <span className={styles.rank}>{MEDALS[index] ?? index + 1}</span>
                  <span className={styles.name}>{player.player}</span>
                  <span className={styles.score}>
                    {score.main}
                    {score.sub && <small>{score.sub}</small>}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
