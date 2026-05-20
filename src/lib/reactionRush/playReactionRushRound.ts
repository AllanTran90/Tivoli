export async function playReactionRushRound(
  reactionTime: number
) {

  const response = await fetch(
    "/api/play",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        game: "reaction-rush",

        reactionTime,

        amount: -2,

        identityToken:
          "user",
      }),
    }
  );

  return response.json();
}