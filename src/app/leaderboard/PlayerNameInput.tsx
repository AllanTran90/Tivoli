type Props = {
  playerName: string;
  setPlayerName: (
    name: string
  ) => void;
};

export default function PlayerNameInput({
  playerName,
  setPlayerName,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Your name"
      maxLength={20}
      value={playerName}
      onChange={(e) =>
        setPlayerName(
          e.target.value
        )
      }
    />
  );
}