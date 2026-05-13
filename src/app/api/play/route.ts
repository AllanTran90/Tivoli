import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  const body = await request.json();

  const { game } = body;

  // DARTS
  if (game === "darts") {
    const { score } = body;

    if (score >= 150) {
      return NextResponse.json({
        reward: "x3",
        moneyWon: 30,
      });
    }

    if (score >= 100) {
      return NextResponse.json({
        reward: "x2",
        moneyWon: 20,
      });
    }

    return NextResponse.json({
      reward: "none",
      moneyWon: 0,
    });
  }

 // CHOCOLATE WHEEL
if (game === "chocolate-wheel") {
  const {
    selectedNumber,
    resultNumber,
    multiplier,
  } = body;

  // WIN
  if (
    selectedNumber === resultNumber
  ) {
    return NextResponse.json({
      reward: `x${multiplier}`,
      moneyWon: multiplier * 2,
    });
  }

  // LOSE
  return NextResponse.json({
    reward: "No reward",
    moneyWon: 0,
  });
}
// REACTION RUSH
if (game === "reaction-rush") {
  const { reactionTime } = body;

  // PERFECT
  if (reactionTime < 0.1) {
    return NextResponse.json({
      reward: "Perfect! €10",
      moneyWon: 10,
    });
  }

  // GOOD
  if (reactionTime <= 0.2) {
    return NextResponse.json({
      reward: "Nice! €5",
      moneyWon: 5,
    });
  }

  // LOSE
  return NextResponse.json({
    reward: "Nice try, try again",
    moneyWon: 0,
  });
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