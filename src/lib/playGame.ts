import type { PlayApiResponse } from "@/types/api";

type PlayGameProps = {
  game: string;
  amount: number;
  identityToken: string;
  score?: number;
  reactionTime?: number;
  selectedNumber?: number;
  resultNumber?: number;
  multiplier?: number;
};

export async function playGame(
  gameData: PlayGameProps
): Promise<PlayApiResponse> {
  const response = await fetch("/api/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameData),
  });

  return response.json() as Promise<PlayApiResponse>;
}