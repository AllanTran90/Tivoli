"use client";

import styles from "./leaderboard.module.css";
import { getLeaderboard } from "@/lib/leaderboard";
import GameSelector from "@/app/leaderboard/GameSelector";
import { useState, useEffect } from "react";

type Player = { id: number; player: string; score: number };

const RANK_STYLES = ["gold", "silver", "bronze"] as const;
const GAME_EMOJI: Record<string, string> = {
  darts: "🎯",
  chocolateWheel: "🎡",
  reactionRush: "⏱️",
};

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState("darts");
  const [players, setPlayers] = useState<Player[]>([]);

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

      <div className={styles.list}>
        {players.length === 0 && <p>No scores yet {emoji}</p>}

        {players.map((player, index) => {
          const rankStyle = styles[RANK_STYLES[index] ?? "default"] ?? styles.default;
          return (
            <div key={player.id} className={`${styles.player} ${rankStyle}`}>
              <span>{index + 1}. {player.player}</span>
              <span>{emoji} {Number(player.score).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
