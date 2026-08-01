import { NextResponse } from "next/server";
import { handleDarts } from "@/lib/games/darts";
import { handleChocolateWheel } from "@/lib/games/chocolateWheel";
import { handleReactionRush } from "@/lib/games/reactionRush";
import { createTransaction, payoutTransaction } from "@/lib/centralBanken";
import type { GameResult } from "@/types/api";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as {
      game: string;
      amount: number;
      identityToken: string;
      score?: number;
      reactionTime?: number;
      selectedNumber?: number;
      multiplier?: number;
    };

    const { game } = body;
    let result: GameResult;
    let resultNumber: number | undefined;

    if (game === "darts") {
      result = handleDarts(body.score ?? 0);
    } else if (game === "chocolate-wheel") {
      resultNumber = Math.ceil(Math.random() * 6);
      result = handleChocolateWheel(body.selectedNumber ?? 0, resultNumber, body.multiplier ?? 1);
    } else if (game === "reaction-rush") {
      result = handleReactionRush(body.reactionTime ?? 0);
    } else {
      return NextResponse.json({ error: "Unknown game" }, { status: 400 });
    }

    const transaction = await createTransaction(body.identityToken, body.amount);

    let payout = null;
    if (result.moneyWon > 0) {
      payout = await payoutTransaction(transaction.transaction_id, body.amount + result.moneyWon);
    }

    return NextResponse.json({ success: true, result, transaction, payout, resultNumber });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
