import styles from "./leaderboard.module.css";
import { getLeaderboard } from "@/lib/leaderboard";

export default async function LeaderboardPage() {
  const players =
    await getLeaderboard("darts");

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        🏆 Darts Leaderboard
      </h1>

      <div className={styles.list}>
        {players?.map((player, index) => {
          let rankStyle = styles.default;

          if (index === 0)
            rankStyle = styles.gold;

          if (index === 1)
            rankStyle = styles.silver;

          if (index === 2)
            rankStyle = styles.bronze;

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
                🎯 {player.score}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}