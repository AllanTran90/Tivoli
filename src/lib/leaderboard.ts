import { supabase } from "./supabase";

export async function saveScore(
  game: string,
  player: string,
  score: number
) {
  const { data, error } =
    await supabase!
      .from("leaderboard")
      .insert([
        {
          game,
          player,
          score,
        },
      ]);

  if (error) {
    console.error(error);
  }

  return data ?? [];
}

export async function getLeaderboard(
  game: string
) {
  const { data, error } =
    await supabase!
      .from("leaderboard")
      .select("*")
      .eq("game", game)
      .order("score", {
        ascending: false,
      })
      .limit(10);

  if (error) {
    console.error(error);
  }

  return data ?? [];
}