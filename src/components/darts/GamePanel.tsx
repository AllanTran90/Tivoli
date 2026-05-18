type Props = {
  score: number;
  wind: string;
  throwsLeft: number;
};

export default function GamePanel({ 
    score, 
    wind, 
    throwsLeft }: 
    Props) {
  return (
    <div>
      <h2>Score</h2>

      <p>{score}</p>

      <h2>Throws Left</h2>

      <p>{throwsLeft}</p>

      <h2>Wind</h2>

      <p>{wind}</p>
    </div>
  );
}