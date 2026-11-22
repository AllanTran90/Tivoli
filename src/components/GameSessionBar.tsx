import PlayerNameInput from "@/app/leaderboard/PlayerNameInput";
import ui from "./ui.module.css";

type Props = {
  userName: string | null;
  bankError: string | null;
  playerName: string;
  setPlayerName: (name: string) => void;
  /** Visa fältet för namn på topplistan. Av för spel utan topplista. */
  showNameInput?: boolean;
};

export default function GameSessionBar({ userName, bankError, playerName, setPlayerName, showNameInput = true }: Props) {
  if (!userName && !bankError && !showNameInput) return null;

  return (
    <section className={ui.panel} aria-label="Player">
      {userName && <p className={ui.panelTitle}>Welcome, {userName}! 👋</p>}
      {showNameInput && <PlayerNameInput playerName={playerName} setPlayerName={setPlayerName} />}
      {bankError && (
        <p className={ui.alert} role="alert" style={{ marginTop: showNameInput || userName ? 12 : 0 }}>
          {bankError}
        </p>
      )}
    </section>
  );
}
