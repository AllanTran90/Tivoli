export async function playDartsRound(score: number, identityToken: string) {

    console.log(
    "IDENTITY TOKEN:",
    identityToken
  );

    const response = await fetch("/api/play", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        game: "darts",
        score,
        amount: 3,
        identityToken,
      }),

  });
return response.json();
}