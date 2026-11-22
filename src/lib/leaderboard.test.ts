import { describe, it, expect } from "vitest";
import { cleanPlayerName, MAX_PLAYER_NAME_LENGTH } from "./leaderboard";

describe("cleanPlayerName: man måste skriva ett namn", () => {
  it.each(["", " ", "   ", "\t\n"])("tomt namn %j räknas som inget namn", (name) => {
    expect(cleanPlayerName(name)).toBeNull();
  });

  it("trimmar mellanslag runt namnet", () => {
    expect(cleanPlayerName("  Allan  ")).toBe("Allan");
  });

  it("slår ihop flera mellanslag", () => {
    expect(cleanPlayerName("Allan    Tran")).toBe("Allan Tran");
  });

  it(`kortar namn till ${MAX_PLAYER_NAME_LENGTH} tecken (samma gräns som RLS i databasen)`, () => {
    const cleaned = cleanPlayerName("x".repeat(50));
    expect(cleaned).toHaveLength(MAX_PLAYER_NAME_LENGTH);
  });

  it("ett tecken räcker", () => {
    expect(cleanPlayerName("A")).toBe("A");
  });
});
