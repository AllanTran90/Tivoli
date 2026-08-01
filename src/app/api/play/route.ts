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
      resultNumber?: number;
      multiplier?: number;
    };

    const { game } = body;
    let result: GameResult;

    if (game === "darts") {
      result = handleDarts(body.score ?? 0);
    } else if (game === "chocolate-wheel") {
      result = handleChocolateWheel(
        body.selectedNumber ?? 0,
        body.resultNumber ?? 0,
        body.multiplier ?? 1
      );
    } else if (game === "reaction-rush") {
      result = handleReactionRush(body.reactionTime ?? 0);
    } else {
      return NextResponse.json({ error: "Unknown game" }, { status: 400 });
    }

    // CREATE TRANSACTION (deducts bet from user)
    const transaction = await createTransaction(body.identityToken, body.amount);

    // PAYOUT (bet + net reward so user gets back stake + winnings)
    let payout = null;

    if (result.moneyWon > 0) {
      payout = await payoutTransaction(
        transaction.transaction_id,
        body.amount + result.moneyWon
      );
    }

    return NextResponse.json({ success: true, result, transaction, payout });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
