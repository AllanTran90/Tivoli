export async function playReactionRushRound(
  reactionTime: number,
  bet: number,
  identityToken: string
) {

  const response = await fetch("/api/play",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        game: "reaction-rush",
        reactionTime,
        amount: bet,
        identityToken,
      }),
    }
  );

  return response.json();
}