export const CENTRALBANK_API =
  process.env.CENTRALBANK_API_URL;

export const CENTRALBANK_API_KEY =
  process.env.CENTRALBANK_API_KEY;

export const REACTION_RUSH_API =
  process.env.REACTION_RUSH_API_KEY;

export async function createTransaction(
  identityToken: string,
  amount: number
) {
  const response = await fetch(
    `${CENTRALBANK_API}/transactions`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        identity_token: identityToken,
        amount,
        api_key: CENTRALBANK_API_KEY,
      }),
    }
  );

  return response.json();
}