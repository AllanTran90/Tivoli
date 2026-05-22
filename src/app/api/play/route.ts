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
    const body = await request.json();

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
      game === "chocolate-wheel"
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
      game === "reaction-rush"
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

    console.log("BODY:", body);
    console.log("RESULT:", result);

    // Create transaction
    const transaction =
      await createTransaction(
        body.identityToken,
        body.amount
      );

    // Payout if user won
    if (
      result.moneyWon > 0
    ) {
      await payoutTransaction(
        transaction.transaction_id,
        result.moneyWon
      );
    }

    console.log(
      "TRANSACTION:",
      transaction
    );

    return NextResponse.json({
      success: true,
      result,
      transaction,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}