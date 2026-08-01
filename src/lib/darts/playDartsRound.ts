import type { PlayApiResponse } from "@/types/api";

export async function playDartsRound(
  score: number,
  identityToken: string
): Promise<PlayApiResponse> {
  const response = await fetch("/api/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game: "darts", score, amount: 3, identityToken }),
  });

  return response.json() as Promise<PlayApiResponse>;
}
