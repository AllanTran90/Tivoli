// Validering av request-body till /api/play. Körs innan något anrop till banken.
// Klienten skickar bara vad spelaren gjorde. Insats och vinst räknas ut på servern.

import {
  GAMES,
  MIN_BET,
  MAX_BET,
  MAX_DARTS_SCORE,
  MAX_REACTION_TIME,
  type GameId,
  type GameInput,
} from "@/lib/games/rules";

export const MAX_TOKEN_LENGTH = 512;

export type PlayRequest = GameInput & { identityToken?: string };

export type ValidationResult = { ok: true; data: PlayRequest } | { ok: false; error: string };

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

function fail(error: string): ValidationResult {
  return { ok: false, error };
}

export function validatePlayRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail("Request body must be a JSON object");
  }
  const b = body as Record<string, unknown>;

  if (typeof b.game !== "string" || !(GAMES as readonly string[]).includes(b.game)) {
    return fail("Unknown game");
  }
  const game = b.game as GameId;

  // Utan token spelar man mot Tivoli-banken (gästläge). Med token mot Loopland-Centralbanken.
  let identityToken: string | undefined;
  if (b.identityToken !== undefined) {
    if (
      typeof b.identityToken !== "string" ||
      b.identityToken.trim() === "" ||
      b.identityToken.length > MAX_TOKEN_LENGTH
    ) {
      return fail("identityToken must be a non-empty string");
    }
    identityToken = b.identityToken.trim();
  }

  switch (game) {
    case "darts":
      if (!isIntInRange(b.score, 0, MAX_DARTS_SCORE)) {
        return fail(`score must be an integer between 0 and ${MAX_DARTS_SCORE}`);
      }
      return { ok: true, data: { game, score: b.score, identityToken } };

    case "chocolate-wheel":
      if (!isIntInRange(b.selectedNumber, 1, 6)) {
        return fail("selectedNumber must be an integer between 1 and 6");
      }
      return { ok: true, data: { game, selectedNumber: b.selectedNumber, identityToken } };

    case "reaction-rush": {
      if (!isIntInRange(b.amount, MIN_BET, MAX_BET)) {
        return fail(`amount must be an integer between ${MIN_BET} and ${MAX_BET}`);
      }
      const t = b.reactionTime;
      if (typeof t !== "number" || !Number.isFinite(t) || t <= 0 || t > MAX_REACTION_TIME) {
        return fail(`reactionTime must be a number greater than 0 and at most ${MAX_REACTION_TIME}`);
      }
      return { ok: true, data: { game, reactionTime: t, bet: b.amount, identityToken } };
    }
  }
}
