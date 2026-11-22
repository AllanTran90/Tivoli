import { describe, it, expect } from "vitest";
import { validatePlayRequest, MAX_TOKEN_LENGTH } from "./validate";

const valid = {
  darts: { game: "darts", score: 120 },
  wheel: { game: "chocolate-wheel", selectedNumber: 3 },
  reaction: { game: "reaction-rush", reactionTime: 9.98, amount: 2 },
};

function rejects(body: unknown): void {
  expect(validatePlayRequest(body).ok).toBe(false);
}

describe("validatePlayRequest: giltiga anrop", () => {
  it.each(Object.entries(valid))("%s utan token (gästläge)", (_, body) => {
    const res = validatePlayRequest(body);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.identityToken).toBeUndefined();
  });

  it("trimmar identity token", () => {
    const res = validatePlayRequest({ ...valid.darts, identityToken: "  abc  " });
    expect(res.ok && res.data.identityToken).toBe("abc");
  });
});

describe("säkerhet: kroppen", () => {
  it.each([null, undefined, 42, "darts", [], [valid.darts]])("avvisar %j", (body) => rejects(body));

  it("avvisar okänt spel och spel med fel skiftläge", () => {
    rejects({ game: "poker" });
    rejects({ game: "DARTS", score: 10 });
    rejects({ game: "__proto__" });
  });
});

describe("säkerhet: klienten kan inte bestämma insats eller vinst", () => {
  it("ignorerar amount, moneyWon och resultNumber för darts", () => {
    const res = validatePlayRequest({ ...valid.darts, amount: 1, moneyWon: 9999, resultNumber: 3 });
    expect(res.ok && res.data).toEqual({ game: "darts", score: 120, identityToken: undefined });
  });

  it("ignorerar resultNumber och multiplier för chocolate wheel", () => {
    const res = validatePlayRequest({ ...valid.wheel, resultNumber: 3, multiplier: 1000 });
    expect(res.ok && res.data).toEqual({ game: "chocolate-wheel", selectedNumber: 3, identityToken: undefined });
  });
});

describe("säkerhet: identity token", () => {
  it.each(["", "   ", 123, null, {}, ["x"], "x".repeat(MAX_TOKEN_LENGTH + 1)])("avvisar %j", (identityToken) =>
    rejects({ ...valid.darts, identityToken }),
  );
});

describe("säkerhet: darts score", () => {
  it.each([-1, 181, 9999, 50.5, "150", null, Number.NaN, Infinity])("avvisar %j", (score) =>
    rejects({ game: "darts", score }),
  );
});

describe("säkerhet: chocolate wheel", () => {
  it.each([0, 7, 2.5, "3", null])("avvisar selectedNumber %j", (selectedNumber) =>
    rejects({ game: "chocolate-wheel", selectedNumber }),
  );
});

describe("säkerhet: reaction rush", () => {
  it.each([0, -1, 61, Number.NaN, Infinity, "10", null])("avvisar reactionTime %j", (reactionTime) =>
    rejects({ ...valid.reaction, reactionTime }),
  );

  it.each([0, -5, 101, 1.5, "2", null, undefined, 1e9])("avvisar insats %j", (amount) =>
    rejects({ ...valid.reaction, amount }),
  );
});
