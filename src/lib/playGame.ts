type PlayGameProps = {
  game: string;
  amount: number;
  identityToken: string;
  score?: number;
  reactionTime?: number;
  selectedNumber?: number;
  resultNumber?: number;
  multiplier?: number;
};

export async function playGame(
  gameData: PlayGameProps
) {
  const response = await fetch(
    "/api/play",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        gameData
      ),
    }
  );
  return response.json();
}