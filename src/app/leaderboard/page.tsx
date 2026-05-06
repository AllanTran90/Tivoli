export default function LeaderboardPage() {
  const players = [
    {
      name: "Allan",
      coins: 150,
    },
    {
      name: "Alex",
      coins: 120,
    },
    {
      name: "Rune",
      coins: 80,
    },
  ];

  return (
    <main>
      <h1>🏆 Leaderboard</h1>

      {players.map((player, index) => (
        <div key={player.name}>
          <p>
            {index + 1}. {player.name} —{" "}
            {player.coins} Coins
          </p>
        </div>
      ))}
    </main>
  );
}