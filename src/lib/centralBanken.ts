import type {
  ApiError,
  TransactionResponse,
  PayoutResponse,
} from "@/types/api";

const CENTRALBANK_API = process.env.CENTRALBANK_API_URL;
const CENTRALBANK_API_KEY = process.env.CENTRALBANK_API_KEY;

export async function createTransaction(
  identityToken: string,
  amount: number,
): Promise<TransactionResponse> {
  if (!CENTRALBANK_API) throw new Error("CENTRALBANK_API_URL missing");
  if (!CENTRALBANK_API_KEY) throw new Error("CENTRALBANK_API_KEY missing");

  const response = await fetch(`${CENTRALBANK_API}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identity_token: identityToken,
      amount,
      api_key: CENTRALBANK_API_KEY,
    }),
  });

  const data = (await response.json()) as TransactionResponse | ApiError;

  if (!response.ok) {
    const err = data as ApiError;
    throw new Error(err.message ?? "Transaction failed");
  }

  return data as TransactionResponse;
}

export async function payoutTransaction(
  transactionId: number,
  amount: number,
): Promise<PayoutResponse> {
  if (!CENTRALBANK_API) throw new Error("CENTRALBANK_API_URL missing");
  if (!CENTRALBANK_API_KEY) throw new Error("CENTRALBANK_API_KEY missing");

  const response = await fetch(
    `${CENTRALBANK_API}/transactions/${transactionId}/payout`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, api_key: CENTRALBANK_API_KEY }),
    },
  );

  const data = (await response.json()) as PayoutResponse | ApiError;

  console.log("Payout status:", response.status);
  console.log("Payout svar:", data);

  if (!response.ok) {
    const err = data as ApiError;
    throw new Error(err.message ?? "Payout failed");
  }

  return data as PayoutResponse;
}
