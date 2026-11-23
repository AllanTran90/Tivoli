import { useId } from "react";
import ui from "@/components/ui.module.css";
import { MAX_PLAYER_NAME_LENGTH } from "@/lib/leaderboard";

type Props = {
  playerName: string;
  setPlayerName: (name: string) => void;
  /** Visar en uppmaning när inget namn har skrivits. */
  missing?: boolean;
};

export default function PlayerNameInput({ playerName, setPlayerName, missing = false }: Props) {
  const hintId = useId();

  return (
    <label className={ui.field}>
      Your name (for the leaderboard) *
      <input
        type="text"
        placeholder="Enter your name"
        required
        maxLength={MAX_PLAYER_NAME_LENGTH}
        autoComplete="nickname"
        value={playerName}
        aria-invalid={missing || undefined}
        aria-describedby={missing ? hintId : undefined}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyDown={(e) => {
          // Enter lämnar fältet, så att SPACE och pilarna går till spelet igen.
          if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
        }}
      />
      {missing ? (
        <span id={hintId} className={ui.hint}>
          ✍️ Write your name to start playing
        </span>
      ) : (
        <span className={ui.subtle}>Press Enter when you are done</span>
      )}
    </label>
  );
}
