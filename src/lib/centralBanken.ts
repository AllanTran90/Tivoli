export const CENTRALBANK_API =
  process.env.CENTRALBANK_API_URL;

export const CENTRALBANK_API_KEY =
  process.env.CENTRALBANK_API_KEY;

export async function createTransaction(
  identityToken: string,
  amount: number
) {

  try {

    const response = await fetch(
      `${CENTRALBANK_API}/transactions`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          identity_token:
            identityToken,
          amount,
          api_key:
            CENTRALBANK_API_KEY,
        }),
      }
    );

    // controll if response is not ok
    if (!response.ok) {

      return {
        error:
          "Centralbank API failed",
      };
    }

    return await response.json();

  } catch (error) {

    console.error(error);

    return {
      error:
        "Server error",
    };
  }
}