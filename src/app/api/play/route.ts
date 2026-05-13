import { NextResponse } from "next/server";
import { handleDarts } from "@/lib/games/darts";
import { handleChocolateWheel } from "@/lib/games/chocolateWheel";
import { handleReactionRush } from "@/lib/games/reactionRush";

export async function POST(
  request: Request
) {
  const body = await request.json();

  const { game } = body;

  // DARTS
  if (game === "darts") {
    return NextResponse.json(
      handleDarts(body.score)
    );
  }

  // CHOCOLATE WHEEL
  if (game === "chocolate-wheel") {
    return NextResponse.json(
      handleChocolateWheel(
        body.selectedNumber,
        body.resultNumber,
        body.multiplier
      )
    );
  }

  // REACTION RUSH
  if (game === "reaction-rush") {
    return NextResponse.json(
      handleReactionRush(
        body.reactionTime
      )
    );
  }

  return NextResponse.json(
    {
      error: "Unknown game",
    },
    {
      status: 400,
    }
  );
}