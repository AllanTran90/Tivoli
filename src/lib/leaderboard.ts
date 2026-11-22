import { supabase } from "./supabase";

export interface LeaderboardEntry {
  id: number;
  game: string;
  player: string;
  score: number;
  created_at?: string;
}

/** Samma gräns som RLS-policyn leaderboard_insert i supabase/migrations. */
export const MAX_PLAYER_NAME_LENGTH = 20;

/** Trimmar namnet. Returnerar null om det är tomt (då får man inte spela). */
export function cleanPlayerName(name: string): string | null {
  const trimmed = name.trim().replace(/\s+/g, " ").slice(0, MAX_PLAYER_NAME_LENGTH);
  return trimmed === "" ? null : trimmed;
}

export async function saveScore(game: string, playerName: string, score: number): Promise<void> {
  const player = cleanPlayerName(playerName);
  if (!supabase || !player) return;
  const { error } = await supabase.from("leaderboard").insert([{ game, player, score }]);
  if (error) console.error(error);
}

export async function getLeaderboard(game: string): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];

  if (game === "reactionRush") {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("game", game)
      .limit(500);

    if (error) console.error(error);

    return ((data as LeaderboardEntry[]) ?? [])
      .sort((a, b) => Math.abs(a.score - 10) - Math.abs(b.score - 10))
      .slice(0, 10);
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("game", game)
    .order("score", { ascending: false })
    .limit(10);

  if (error) console.error(error);
  return (data as LeaderboardEntry[]) ?? [];
}
