import ui from "@/components/ui.module.css";

type Props = {
  playerName: string;
  setPlayerName: (name: string) => void;
};

export default function PlayerNameInput({ playerName, setPlayerName }: Props) {
  return (
    <label className={ui.field}>
      Leaderboard name
      <input
        type="text"
        placeholder="Your alias"
        maxLength={20}
        autoComplete="nickname"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
    </label>
  );
}
