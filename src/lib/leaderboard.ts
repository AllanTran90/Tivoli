import { supabase } from "./supabase";

export interface LeaderboardEntry {
  id: number;
  game: string;
  player: string;
  score: number;
  created_at?: string;
}

export async function saveScore(game: string, player: string, score: number): Promise<void> {
  if (!supabase) return;
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
