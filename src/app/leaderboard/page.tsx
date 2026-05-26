"use client";

import styles from "./leaderboard.module.css";
import { getLeaderboard } from "@/lib/leaderboard";
import GameSelector from "@/app/leaderboard/GameSelector";
import { useState, useEffect } from "react";

type Player = {
  id: number;
  player: string;
  score: number;
};

export default function LeaderboardPage() {

  const [selectedGame, setSelectedGame] =
    useState("darts");

  const [players, setPlayers] =
    useState<Player[]>([]);

  useEffect(() => {

    async function loadLeaderboard() {

      const data =
        await getLeaderboard(
          selectedGame
        );

      setPlayers(data || []);
    }

    loadLeaderboard();

  }, [selectedGame]);

  return (
    <main className={styles.main}>

      <h1 className={styles.title}>
        🏆 Leaderboard
      </h1>

      <GameSelector
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
      />

      <div className={styles.list}>

        {players.length === 0 && (
          <p>No scores yet 🎯</p>
        )}

        {players.map((player, index) => {

          let rankStyle =
            styles.default;

          if (index === 0)
            rankStyle =
              styles.gold;

          if (index === 1)
            rankStyle =
              styles.silver;

          if (index === 2)
            rankStyle =
              styles.bronze;

          return (
            <div
              key={player.id}
              className={`${styles.player} ${rankStyle}`}
            >

              <span>
                {index + 1}.{" "}
                {player.player}
              </span>

              <span>
                🎯 🎯 {Number(player.score).toFixed(2)}
              </span>

            </div>
          );
        })}
      </div>
    </main>
  );
}