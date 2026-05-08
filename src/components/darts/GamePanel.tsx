type Props = {
  score: number;
  history: string[];
  wind: string;
  throwsLeft: number;
};

export default function GamePanel({
  score,
  history,
  wind,
  throwsLeft,
}: Props) {
  return (
    <div>
      <h1>Darts</h1>

      <p>Throws Left: {throwsLeft}</p>
    
      <p>Wind: {wind}</p>

      <p>Total Score: {score}</p>

      <ul>
        {history.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}