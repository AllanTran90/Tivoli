"use client";

import styles from "./leaderboard.module.css";
import { getLeaderboard, LeaderboardEntry } from "@/lib/leaderboard";
import GameSelector from "@/app/leaderboard/GameSelector";
import { useState, useEffect } from "react";

const RANK_STYLES = ["gold", "silver", "bronze"] as const;
const GAME_EMOJI: Record<string, string> = {
  darts: "🎯",
  chocolateWheel: "🎡",
  reactionRush: "⏱️",
};

function formatScore(game: string, score: number): string {
  if (game === "reactionRush") {
    const diff = Math.abs(score - 10).toFixed(2);
    return `${score.toFixed(2)}s  (Δ ${diff}s)`;
  }
  return String(score);
}

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState("darts");
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const data = await getLeaderboard(selectedGame);
      setPlayers(data || []);
    }
    loadLeaderboard();
  }, [selectedGame]);

  const emoji = GAME_EMOJI[selectedGame] ?? "🏆";

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🏆 Leaderboard</h1>

      <GameSelector selectedGame={selectedGame} setSelectedGame={setSelectedGame} />

      {selectedGame === "reactionRush" && (
        <p style={{ textAlign: "center", opacity: 0.7, fontSize: "0.85rem" }}>
          Closest to 10.00s wins — exact time and distance shown
        </p>
      )}

      <div className={styles.list}>
        {players.length === 0 && <p>No scores yet {emoji}</p>}

        {players.map((player, index) => {
          const rankStyle = styles[RANK_STYLES[index] ?? "default"] ?? styles.default;
          return (
            <div key={player.id} className={`${styles.player} ${rankStyle}`}>
              <span>{index + 1}. {player.player}</span>
              <span>{emoji} {formatScore(selectedGame, player.score)}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
