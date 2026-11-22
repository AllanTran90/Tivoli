import { describe, it, expect } from "vitest";
import { handleDarts } from "./darts";
import { handleChocolateWheel } from "./chocolateWheel";
import { handleReactionRush } from "./reactionRush";
import {
  resolveGame,
  netChange,
  payoutFor,
  rollWheel,
  clampBet,
  DARTS_COST,
  CHOCOLATE_WHEEL_COST,
  MAX_BET,
} from "./rules";

describe("handleDarts", () => {
  it.each([
    [0, 0],
    [99, 0],
    [100, 5],
    [149, 5],
    [150, 10],
    [180, 10],
  ])("score %i ger %i hjärtan", (score, expected) => {
    expect(handleDarts(score).moneyWon).toBe(expected);
  });
});

describe("handleChocolateWheel", () => {
  it("vinner 2 när siffran matchar", () => {
    expect(handleChocolateWheel(4, 4, 3)).toEqual({ reward: "x3", moneyWon: 2 });
  });

  it("vinner inget när siffran inte matchar", () => {
    expect(handleChocolateWheel(4, 5, 3).moneyWon).toBe(0);
  });
});

describe("handleReactionRush", () => {
  it.each([
    [10, 3],
    [10.004, 3], // avrundas till 10.00
    [9.95, 1],
    [10.05, 1],
    [9.9, 1],
    [10.1, 1],
    [9.89, 0],
    [12, 0],
    [0.01, 0],
  ])("tid %f ger %i hjärtan", (time, expected) => {
    expect(handleReactionRush(time).moneyWon).toBe(expected);
  });
});

describe("rollWheel", () => {
  it("ger alltid 1–6, även i kanterna", () => {
    expect(rollWheel(() => 0)).toBe(1);
    expect(rollWheel(() => 0.999999)).toBe(6);
    expect(rollWheel(() => 1)).toBe(6); // ska aldrig hända, men ger inte 7
  });

  it("ger alla sex siffror", () => {
    const seen = new Set(Array.from({ length: 6 }, (_, i) => rollWheel(() => i / 6)));
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("resolveGame: servern bestämmer insatsen", () => {
  it("darts kostar alltid DARTS_COST", () => {
    expect(resolveGame({ game: "darts", score: 150 }).bet).toBe(DARTS_COST);
  });

  it("chocolate wheel kostar alltid CHOCOLATE_WHEEL_COST och slumpar på servern", () => {
    const round = resolveGame({ game: "chocolate-wheel", selectedNumber: 2 }, () => 0.2);
    expect(round.bet).toBe(CHOCOLATE_WHEEL_COST);
    expect(round.resultNumber).toBe(2);
    expect(round.result.moneyWon).toBe(2);
  });

  it("reaction rush använder spelarens insats", () => {
    expect(resolveGame({ game: "reaction-rush", reactionTime: 10, bet: 7 }).bet).toBe(7);
  });
});

describe("payoutFor", () => {
  it("betalar tillbaka insats + vinst vid vinst", () => {
    expect(payoutFor(resolveGame({ game: "darts", score: 150 }))).toBe(DARTS_COST + 10);
    expect(payoutFor(resolveGame({ game: "reaction-rush", reactionTime: 10, bet: 100 }))).toBe(103);
  });

  it("betalar ingenting vid förlust", () => {
    expect(payoutFor(resolveGame({ game: "darts", score: 0 }))).toBe(0);
  });
});

describe("netChange", () => {
  it.each([
    ["darts vinst", { game: "darts", score: 150 } as const, 10],
    ["darts förlust", { game: "darts", score: 10 } as const, -DARTS_COST],
    ["reaction perfekt", { game: "reaction-rush", reactionTime: 10, bet: 5 } as const, 3],
    ["reaction förlust", { game: "reaction-rush", reactionTime: 3, bet: 5 } as const, -5],
  ])("%s", (_, input, expected) => {
    expect(netChange(resolveGame(input))).toBe(expected);
  });
});

describe("clampBet", () => {
  it.each([
    [5, 10, 5],
    [0, 10, 1],
    [-3, 10, 1],
    [2.7, 10, 2],
    [50, 10, 10],
    [Number.NaN, 10, 1],
    [Infinity, 10, 1],
    [500, 1000, MAX_BET],
    [5, 0, 1], // saldo 0: minsta insats, servern säger ifrån
  ])("clampBet(%f, max %f) = %i", (value, max, expected) => {
    expect(clampBet(value, max)).toBe(expected);
  });
});
