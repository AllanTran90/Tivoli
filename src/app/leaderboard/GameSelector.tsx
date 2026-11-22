import styles from "./leaderboard.module.css";

export const LEADERBOARD_GAMES = [
  { id: "darts", label: "🎯 Darts" },
  { id: "reactionRush", label: "⏱️ Reaction Rush" },
] as const;

type Props = {
  selectedGame: string;
  setSelectedGame: (game: string) => void;
};

/** Flikar för att välja spel. Chocolate Wheel saknas eftersom det inte har några poäng. */
export default function GameSelector({ selectedGame, setSelectedGame }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Choose game">
      {LEADERBOARD_GAMES.map((game) => (
        <button
          key={game.id}
          type="button"
          role="tab"
          aria-selected={selectedGame === game.id}
          className={styles.tab}
          onClick={() => setSelectedGame(game.id)}
        >
          {game.label}
        </button>
      ))}
    </div>
  );
}
