import { NextResponse } from "next/server";
import { getOrCreateGuestId, guestAccountId } from "@/lib/server/guest";
import { getBalance } from "@/lib/server/tivoliBank";
import type { WalletApiResponse } from "@/types/api";

/** Gästens saldo i Tivoli-banken. Skapar konto (och cookie) första gången. */
export async function GET(): Promise<NextResponse<WalletApiResponse>> {
  try {
    const balance = await getBalance(guestAccountId(await getOrCreateGuestId()));
    return NextResponse.json({ success: true, balance });
  } catch {
    return NextResponse.json(
      { success: false, error: "The Tivoli bank is unavailable right now" },
      { status: 503 },
    );
  }
}
