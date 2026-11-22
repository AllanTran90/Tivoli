import { NextResponse } from "next/server";
import { createTransaction, payoutTransaction } from "@/lib/centralBanken";
import { resolveGame, payoutFor } from "@/lib/games/rules";
import { getOrCreateGuestId, guestAccountId } from "@/lib/server/guest";
import { playRound, InsufficientFundsError, BankUnavailableError } from "@/lib/server/tivoliBank";
import type { PlayApiResponse } from "@/types/api";
import { validatePlayRequest } from "./validate";

function fail(error: string, status: number): NextResponse<PlayApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request): Promise<NextResponse<PlayApiResponse>> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }

  const validation = validatePlayRequest(rawBody);
  if (!validation.ok) return fail(validation.error, 400);

  const { identityToken, ...input } = validation.data;
  const round = resolveGame(input);
  const { bet, result, resultNumber } = round;
  const payoutAmount = payoutFor(round);

  // Spelare från Loopland: Loopland-Centralbanken hanterar pengarna.
  if (identityToken) {
    try {
      const transaction = await createTransaction(identityToken, bet);
      const payout =
        payoutAmount > 0 ? await payoutTransaction(transaction.transaction_id, payoutAmount) : null;
      return NextResponse.json({ success: true, bank: "loopland", result, resultNumber, transaction, payout });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return fail(message, 502);
    }
  }

  // Gäster: Tivoli-banken (egen bank i Supabase).
  try {
    const accountId = guestAccountId(await getOrCreateGuestId());
    const balance = await playRound(accountId, input.game, bet, payoutAmount);
    return NextResponse.json({ success: true, bank: "tivoli", result, resultNumber, balance });
  } catch (error) {
    if (error instanceof InsufficientFundsError) return fail("Not enough hearts", 402);
    if (!(error instanceof BankUnavailableError)) console.error(error);
    // Skicka aldrig interna databasfel till klienten.
    return fail("The Tivoli bank is unavailable right now", 503);
  }
}
