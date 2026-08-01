import PlayerNameInput from "@/app/leaderboard/PlayerNameInput";

type Props = {
  userName: string | null;
  bankError: string | null;
  playerName: string;
  setPlayerName: (name: string) => void;
};

export default function GameSessionBar({
  userName,
  bankError,
  playerName,
  setPlayerName,
}: Props) {
  return (
    <>
      {userName && <p>Välkommen, {userName}! 👋</p>}
      {bankError && <p style={{ color: "red" }}>{bankError}</p>}
      <PlayerNameInput playerName={playerName} setPlayerName={setPlayerName} />
    </>
  );
}
