import { NextResponse } from "next/server";
import { handleDarts } from "@/lib/games/darts";
import { handleChocolateWheel } from "@/lib/games/chocolateWheel";
import { handleReactionRush } from "@/lib/games/reactionRush";
import { createTransaction } from "@/lib/centralBanken";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const { game } = body;

    //  Payment to centralbanken
    const transaction =
      await createTransaction(
        body.identityToken,
        body.amount
      );

    // controll if transaction was successful
    if (transaction.error) {
      return NextResponse.json(
        {
          error:
            "Transaction failed",
          details:
            transaction.error,
        },
        {
          status: 400,
        }
      );
    }

    let gameResult;

    //  run right game logic based on game type
    if (game === "darts") {
      gameResult =
        handleDarts(body.score);
    }

    else if (
      game === "chocolate-wheel"
    ) {
      gameResult =
        handleChocolateWheel(
          body.selectedNumber,
          body.resultNumber,
          body.multiplier
        );
    }

    else if (
      game === "reaction-rush"
    ) {
      gameResult =
        handleReactionRush(
          body.reactionTime
        );
    }

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

    // 3. return BOTH
    return NextResponse.json({
      success: true,
      transaction,
      gameResult,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}