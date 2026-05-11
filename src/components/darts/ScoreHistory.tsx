type Props = {
  history: number[];
};

export default function ScoreHistory({ history }: Props) {
  return (
    <div>
      <h2>History</h2>

      {history.map((score, index) => (
        <p key={index}>{score}</p>
      ))}
    </div>
  );
}
