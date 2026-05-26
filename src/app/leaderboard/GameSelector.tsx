type Props = {
  selectedGame: string;
  setSelectedGame: (
    game: string
  ) => void;
};

export default function GameSelector({
  selectedGame,
  setSelectedGame,
}: Props) {
  return (
    <select
      value={selectedGame}
      onChange={(e) =>
        setSelectedGame(
          e.target.value
        )
      }
    >
      <option value="darts">
        Darts
      </option>

      <option value="reactionRush">
        Reaction Rush
      </option>

      <option value="chocolateWheel">
        Chocolate Wheel
      </option>
    </select>
  );
}