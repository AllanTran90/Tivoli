// Gemensamma regler för spelen. Används av både servern (/api/play) och klienten (visning, gränser).
// Servern är alltid den som bestämmer. Klientens kopia används bara för att visa rätt saker.

import { handleDarts } from "./darts";
import { handleChocolateWheel } from "./chocolateWheel";
import { handleReactionRush } from "./reactionRush";
import type { GameResult } from "@/types/api";

export const GAMES = ["darts", "chocolate-wheel", "reaction-rush"] as const;
export type GameId = (typeof GAMES)[number];

/** Fast insats för spel där spelaren inte väljer själv. */
export const DARTS_COST = 3;
export const CHOCOLATE_WHEEL_COST = 1;
export const CHOCOLATE_WHEEL_MULTIPLIER = 3;

/** Gränser för insats och resultat. */
export const MIN_BET = 1;
export const MAX_BET = 100;
export const MAX_DARTS_SCORE = 180; // 3 pilar x triple 20
export const MAX_REACTION_TIME = 60; // sekunder

/** Startsaldo för nya konton i Tivoli-banken. Måste stämma med default i supabase/migrations. */
export const STARTING_BALANCE = 10;

export type GameInput =
  | { game: "darts"; score: number }
  | { game: "chocolate-wheel"; selectedNumber: number }
  | { game: "reaction-rush"; reactionTime: number; bet: number };

export interface ResolvedGame {
  bet: number;
  result: GameResult;
  resultNumber?: number;
}

/** Slår ett tal mellan 1 och 6. `random` kan bytas ut i tester. */
export function rollWheel(random: () => number = Math.random): number {
  return Math.min(6, Math.floor(random() * 6) + 1);
}

/**
 * Räknar ut insats och vinst för en spelomgång. Insatsen bestäms här,
 * inte av klienten (förutom i Reaction Rush där spelaren väljer insats).
 */
export function resolveGame(input: GameInput, random: () => number = Math.random): ResolvedGame {
  switch (input.game) {
    case "darts":
      return { bet: DARTS_COST, result: handleDarts(input.score) };

    case "chocolate-wheel": {
      const resultNumber = rollWheel(random);
      return {
        bet: CHOCOLATE_WHEEL_COST,
        result: handleChocolateWheel(input.selectedNumber, resultNumber, CHOCOLATE_WHEEL_MULTIPLIER),
        resultNumber,
      };
    }

    case "reaction-rush":
      return { bet: input.bet, result: handleReactionRush(input.reactionTime) };
  }
}

/**
 * Hur mycket som betalas tillbaka efter att insatsen dragits: insatsen + vinsten
 * vid vinst, annars 0. Används av BÅDA bankerna, så att de alltid ger samma resultat.
 */
export function payoutFor({ bet, result }: ResolvedGame): number {
  return result.moneyWon > 0 ? bet + result.moneyWon : 0;
}

/** Nettoförändring av saldot: +vinst vid vinst, -insats vid förlust. */
export function netChange(round: ResolvedGame): number {
  return payoutFor(round) - round.bet;
}

/** Gör om valfri inmatning till en giltig insats mellan MIN_BET och `max`. */
export function clampBet(value: number, max: number = MAX_BET): number {
  const upper = Math.max(MIN_BET, Math.min(MAX_BET, Math.floor(max)));
  if (!Number.isFinite(value)) return MIN_BET;
  return Math.min(upper, Math.max(MIN_BET, Math.floor(value)));
}
