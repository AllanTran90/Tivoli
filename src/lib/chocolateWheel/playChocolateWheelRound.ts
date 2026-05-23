export async function playChocolateWheelRound(
  selectedNumber: number,
  resultNumber: number,
  multiplier: number,
  identityToken?: string
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
        game: "chocolate-wheel",

        selectedNumber,

        resultNumber,

        multiplier,

        amount: multiplier,

        identityToken:
          identityToken ||
          "123e4567-e89b-12d3-a456-426614174000",
      }),
    }
  );

  return response.json();
}