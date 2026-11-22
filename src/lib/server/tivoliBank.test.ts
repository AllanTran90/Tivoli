import { describe, it, expect, vi, beforeEach } from "vitest";

const rpc = vi.fn();
vi.mock("./supabaseAdmin", () => ({ getSupabaseAdmin: () => ({ rpc }) }));

import { playRound, getBalance, InsufficientFundsError, BankUnavailableError } from "./tivoliBank";
import { isValidGuestId, guestAccountId } from "./guest";

beforeEach(() => rpc.mockReset());

describe("playRound", () => {
  it("anropar bank_play och returnerar nytt saldo", async () => {
    rpc.mockResolvedValue({ data: 12, error: null });
    await expect(playRound("guest:x", "darts", 3, 8)).resolves.toBe(12);
    expect(rpc).toHaveBeenCalledWith("bank_play", { p_user: "guest:x", p_game: "darts", p_bet: 3, p_payout: 8 });
  });

  it("insufficient_funds från databasen blir InsufficientFundsError", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "insufficient_funds" } });
    await expect(playRound("guest:x", "darts", 3, 0)).rejects.toBeInstanceOf(InsufficientFundsError);
  });

  it("andra databasfel blir BankUnavailableError", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "connection refused" } });
    await expect(playRound("guest:x", "darts", 3, 0)).rejects.toBeInstanceOf(BankUnavailableError);
  });

  it("oväntat svar blir BankUnavailableError", async () => {
    rpc.mockResolvedValue({ data: "12", error: null });
    await expect(playRound("guest:x", "darts", 3, 0)).rejects.toBeInstanceOf(BankUnavailableError);
  });
});

describe("getBalance", () => {
  it("returnerar saldot", async () => {
    rpc.mockResolvedValue({ data: 10, error: null });
    await expect(getBalance("guest:x")).resolves.toBe(10);
    expect(rpc).toHaveBeenCalledWith("bank_get_balance", { p_user: "guest:x" });
  });
});

describe("säkerhet: gäst-id", () => {
  it("godtar bara UUID v4", () => {
    expect(isValidGuestId(crypto.randomUUID())).toBe(true);
    expect(isValidGuestId(undefined)).toBe(false);
    expect(isValidGuestId("")).toBe(false);
    expect(isValidGuestId("1")).toBe(false);
    expect(isValidGuestId("admin")).toBe(false);
    expect(isValidGuestId("' or 1=1 --")).toBe(false);
    expect(isValidGuestId(`${crypto.randomUUID()}x`)).toBe(false);
  });

  it("konto-id har prefix", () => {
    expect(guestAccountId("abc")).toBe("guest:abc");
  });
});
