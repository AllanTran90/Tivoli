import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/centralBanken", () => ({
  createTransaction: vi.fn(),
  payoutTransaction: vi.fn(),
}));

vi.mock("@/lib/server/tivoliBank", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/server/tivoliBank")>();
  return { ...actual, playRound: vi.fn(), getBalance: vi.fn() };
});

const cookieJar = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name) } : undefined),
    set: (name: string, value: string) => cookieJar.set(name, value),
  }),
}));

import { POST } from "./route";
import { createTransaction, payoutTransaction } from "@/lib/centralBanken";
import { playRound, InsufficientFundsError, BankUnavailableError } from "@/lib/server/tivoliBank";
import { GUEST_COOKIE } from "@/lib/server/guest";
import { DARTS_COST, CHOCOLATE_WHEEL_COST } from "@/lib/games/rules";

const mockCreate = vi.mocked(createTransaction);
const mockPayout = vi.mocked(payoutTransaction);
const mockPlayRound = vi.mocked(playRound);

const GUEST_ID = "6f1c2b9e-1d2a-4c3b-8e4f-5a6b7c8d9e0f";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/play", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  cookieJar.clear();
  mockCreate.mockImplementation(async (_token, amount) => ({ transaction_id: 42, amount, stamp: null }));
  mockPayout.mockImplementation(async (id, amount) => ({ transaction_id: id, amount }));
  mockPlayRound.mockResolvedValue(20);
});

describe("POST /api/play: Loopland-Centralbanken (med token)", () => {
  const withToken = (body: object) => post({ identityToken: "test-token", ...body });

  it("darts-vinst betalar ut insats + vinst", async () => {
    const data = await (await withToken({ game: "darts", score: 150 })).json();

    expect(data).toMatchObject({ success: true, bank: "loopland" });
    expect(mockCreate).toHaveBeenCalledWith("test-token", DARTS_COST);
    expect(mockPayout).toHaveBeenCalledWith(42, DARTS_COST + 10);
    expect(mockPlayRound).not.toHaveBeenCalled();
  });

  it("darts-förlust drar insatsen utan utbetalning", async () => {
    const data = await (await withToken({ game: "darts", score: 50 })).json();

    expect(data.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockPayout).not.toHaveBeenCalled();
    expect(data.payout).toBeNull();
  });

  it("fel från Centralbanken ger 502 med bankens meddelande", async () => {
    mockCreate.mockRejectedValue(new Error("Insufficient funds"));
    const res = await withToken({ game: "darts", score: 0 });

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ success: false, error: "Insufficient funds" });
  });
});

describe("POST /api/play: Tivoli-banken (gäst, utan token)", () => {
  it("skapar gästcookie och spelar mot Tivoli-banken", async () => {
    const data = await (await post({ game: "darts", score: 150 })).json();

    expect(data).toEqual(expect.objectContaining({ success: true, bank: "tivoli", balance: 20 }));
    const guestId = cookieJar.get(GUEST_COOKIE);
    expect(guestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(mockPlayRound).toHaveBeenCalledWith(`guest:${guestId}`, "darts", DARTS_COST, DARTS_COST + 10);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("återanvänder befintlig gästcookie", async () => {
    cookieJar.set(GUEST_COOKIE, GUEST_ID);
    await post({ game: "darts", score: 0 });
    expect(mockPlayRound).toHaveBeenCalledWith(`guest:${GUEST_ID}`, "darts", DARTS_COST, 0);
  });

  it("för lite hjärtan ger 402", async () => {
    mockPlayRound.mockRejectedValue(new InsufficientFundsError());
    const res = await post({ game: "darts", score: 0 });

    expect(res.status).toBe(402);
    expect((await res.json()).error).toBe("Not enough hearts");
  });

  it("databasfel ger 503 utan att läcka interna detaljer", async () => {
    mockPlayRound.mockRejectedValue(new BankUnavailableError({ message: "relation bank_accounts does not exist" }));
    const res = await post({ game: "darts", score: 0 });
    const text = await res.text();

    expect(res.status).toBe(503);
    expect(text).not.toContain("bank_accounts");
  });
});

describe("båda bankerna ger samma resultat", () => {
  // Simulerar bankerna: Tivoli = saldo - bet + payout. Loopland = -createTransaction + payoutTransaction.
  async function netTivoli(body: object): Promise<number> {
    vi.clearAllMocks();
    await post(body);
    const [, , bet, payout] = mockPlayRound.mock.calls[0];
    return payout - bet;
  }

  async function netLoopland(body: object): Promise<number> {
    vi.clearAllMocks();
    await post({ ...body, identityToken: "t" });
    const bet = mockCreate.mock.calls[0][1];
    const payout = mockPayout.mock.calls[0]?.[1] ?? 0;
    return payout - bet;
  }

  it.each([
    ["darts 150 → +10", { game: "darts", score: 150 }, 10],
    ["darts 120 → +5", { game: "darts", score: 120 }, 5],
    ["darts 50 → -3", { game: "darts", score: 50 }, -DARTS_COST],
    ["reaction perfekt med insats 100 → +3", { game: "reaction-rush", reactionTime: 10, amount: 100 }, 3],
    ["reaction close med insats 5 → +1", { game: "reaction-rush", reactionTime: 9.95, amount: 5 }, 1],
    ["reaction miss med insats 5 → -5", { game: "reaction-rush", reactionTime: 7, amount: 5 }, -5],
  ])("%s", async (_, body, expected) => {
    expect(await netTivoli(body)).toBe(expected);
    expect(await netLoopland(body)).toBe(expected);
  });

  it("chocolate wheel: vinst +2, förlust -1", async () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0); // servern slår 1
    expect(await netTivoli({ game: "chocolate-wheel", selectedNumber: 1 })).toBe(2);
    expect(await netLoopland({ game: "chocolate-wheel", selectedNumber: 1 })).toBe(2);
    expect(await netTivoli({ game: "chocolate-wheel", selectedNumber: 4 })).toBe(-CHOCOLATE_WHEEL_COST);
    expect(await netLoopland({ game: "chocolate-wheel", selectedNumber: 4 })).toBe(-CHOCOLATE_WHEEL_COST);
    spy.mockRestore();
  });
});

describe("säkerhet: insats och vinst bestäms på servern", () => {
  it("darts: klientens amount ignoreras", async () => {
    await post({ game: "darts", score: 150, amount: 1, identityToken: "t" });
    expect(mockCreate).toHaveBeenCalledWith("t", DARTS_COST);
  });

  it("chocolate wheel: klientens resultNumber och moneyWon ignoreras", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99); // servern slår 6
    const data = await (await post({ game: "chocolate-wheel", selectedNumber: 1, resultNumber: 1, moneyWon: 999 })).json();
    vi.mocked(Math.random).mockRestore();

    expect(data.resultNumber).toBe(6);
    expect(mockPlayRound).toHaveBeenCalledWith(expect.any(String), "chocolate-wheel", CHOCOLATE_WHEEL_COST, 0);
  });

  it("chocolate wheel slumpar alltid 1–6", async () => {
    for (let i = 0; i < 50; i++) {
      const data = await (await post({ game: "chocolate-wheel", selectedNumber: 3 })).json();
      expect(data.resultNumber).toBeGreaterThanOrEqual(1);
      expect(data.resultNumber).toBeLessThanOrEqual(6);
    }
  });
});

describe("säkerhet: ogiltig input når aldrig banken", () => {
  it.each([
    ["trasig JSON", "{not json"],
    ["okänt spel", { game: "poker" }],
    ["orimlig darts-poäng", { game: "darts", score: 9999 }],
    ["negativ insats", { game: "reaction-rush", reactionTime: 10, amount: -5 }],
    ["tom identity token", { game: "darts", score: 0, identityToken: "" }],
  ])("%s ger 400", async (_, body) => {
    const res = await post(body);

    expect(res.status).toBe(400);
    expect((await res.json()).success).toBe(false);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockPlayRound).not.toHaveBeenCalled();
  });
});
