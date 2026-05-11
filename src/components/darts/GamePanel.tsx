type Props = {
  score: number;
};

export default function GamePanel({
  score,
}: Props) {

  return (
    <div>
      <h2>Score</h2>

      <p>{score}</p>
    </div>
  );
}