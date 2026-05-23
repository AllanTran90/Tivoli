const CENTRALBANK_API =
  process.env.CENTRALBANK_API_URL;

const CENTRALBANK_API_KEY =
  process.env.CENTRALBANK_API_KEY;

export const REACTION_RUSH_API =
  process.env.REACTION_RUSH_API_KEY;

export async function createTransaction(
  identityToken: string,
  amount: number
) {
  if (!CENTRALBANK_API) {
    throw new Error("CENTRALBANK_API_URL missing");
  }

  if (!CENTRALBANK_API_KEY) {
    throw new Error("CENTRALBANK_API_KEY missing");
  }

  const response = await fetch(
    `${CENTRALBANK_API}/transactions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        identity_token: identityToken,
        amount,
        api_key: CENTRALBANK_API_KEY,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Transaction failed"
    );
  }

  return data;
}

export async function payoutTransaction(
  transactionId: string,
  amount: number
) {
  if (!CENTRALBANK_API) {
    throw new Error("CENTRALBANK_API_URL missing");
  }

  if (!CENTRALBANK_API_KEY) {
    throw new Error("CENTRALBANK_API_KEY missing");
  }

  const response = await fetch(
    `${CENTRALBANK_API}/transactions/${transactionId}/payout`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        amount,
        api_key: CENTRALBANK_API_KEY,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Payout failed"
    );
  }

  return data;
}