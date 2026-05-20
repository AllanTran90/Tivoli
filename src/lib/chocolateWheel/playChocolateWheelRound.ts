export async function playChocolateWheelRound(
  selectedNumber: number,
  resultNumber: number,
  multiplier: number
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

        amount: -2,

        identityToken:
          "user",
      }),
    }
  );

  return response.json();
}