import { NextResponse } from "next/server";

import { handleDarts } from "@/lib/games/darts";
import { handleChocolateWheel } from "@/lib/games/chocolateWheel";
import { handleReactionRush } from "@/lib/games/reactionRush";

import {
  createTransaction,
  payoutTransaction,
} from "@/lib/centralBanken";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const { game } = body;

    let result;

    // DARTS
    if (game === "darts") {
      result = handleDarts(
        body.score
      );
    }

    // CHOCOLATE WHEEL
    else if (
      game ===
      "chocolate-wheel"
    ) {
      result =
        handleChocolateWheel(
          body.selectedNumber,
          body.resultNumber,
          body.multiplier
        );
    }

    // REACTION RUSH
    else if (
      game ===
      "reaction-rush"
    ) {
      result =
        handleReactionRush(
          body.reactionTime
        );
    }

    // UNKNOWN GAME
    else {
      return NextResponse.json(
        {
          error:
            "Unknown game",
        },
        {
          status: 400,
        }
      );
    }

    // LOGS
    console.log("BODY:", body);

    console.log(
      "IDENTITY TOKEN:",
      body.identityToken
    );

    console.log(
      "GAME RESULT:",
      result
    );

    // CREATE TRANSACTION
    const transaction =
      await createTransaction(
        body.identityToken,
        body.amount
      );

    console.log(
      "TRANSACTION:",
      transaction
    );

    // PAYOUT
    let payout = null;

    if (
      result.moneyWon > 0
    ) {
      payout =
        await payoutTransaction(
          transaction.transaction_id,
          result.moneyWon
        );

      console.log(
        "PAYOUT:",
        payout
      );
    }

    return NextResponse.json({
      success: true,
      result,
      transaction,
      payout,
    });
  } catch (error) {
    console.error(
      "API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}