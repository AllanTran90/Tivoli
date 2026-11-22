import { describe, it, expect } from "vitest";
import { calculateScore } from "./scoring";
import { CENTER, SECTOR_DEGREES, sectors, sectorStartDegrees } from "./constants";

/**
 * Punkt på tavlan `degrees` medurs från toppen och `distance` från mitten.
 * Räknas fram oberoende av koden (0° = rakt upp på skärmen), så testerna kontrollerar
 * att poängen stämmer med det spelaren SER på den ritade tavlan.
 */
function at(degrees: number, distance: number) {
  const rad = (degrees - 90) * (Math.PI / 180);
  return { x: CENTER + Math.cos(rad) * distance, y: CENTER + Math.sin(rad) * distance };
}

/** Mitten av den ritade tårtbiten för sektor `index`. */
const middleOf = (index: number) => sectorStartDegrees(index) + SECTOR_DEGREES / 2;

const SINGLE = 100;
const TRIPLE = 157;
const DOUBLE = 240;

describe("calculateScore", () => {
  it("bullseye ger 50", () => {
    expect(calculateScore({ x: CENTER, y: CENTER })).toBe(50);
  });

  it("outer bull ger 25", () => {
    expect(calculateScore(at(45, 15))).toBe(25);
  });

  it("single, triple och double i samma sektor", () => {
    expect(calculateScore(at(middleOf(0), SINGLE))).toBe(sectors[0]);
    expect(calculateScore(at(middleOf(0), TRIPLE))).toBe(sectors[0] * 3);
    expect(calculateScore(at(middleOf(0), DOUBLE))).toBe(sectors[0] * 2);
  });

  it("utanför tavlan ger 0", () => {
    expect(calculateScore(at(0, 260))).toBe(0);
    expect(calculateScore({ x: 0, y: 0 })).toBe(0);
  });

  describe("poängen stämmer med den ritade tavlan", () => {
    it.each(sectors.map((value, index) => [value, index]))("sektor %i (index %i): mitten och båda kanterna", (value, index) => {
      const start = sectorStartDegrees(index);
      expect(calculateScore(at(start + 1, SINGLE))).toBe(value);
      expect(calculateScore(at(start + 9, SINGLE))).toBe(value);
      expect(calculateScore(at(start + 17, SINGLE))).toBe(value);
    });

    it("bugg: triple i högra delen av 20-biten räknades som triple 1 (3 poäng)", () => {
      const index20 = sectors.indexOf(20);
      expect(calculateScore(at(sectorStartDegrees(index20) + 14, TRIPLE))).toBe(60);
    });
  });

  describe("tavlan ser ut som en riktig darttavla", () => {
    it.each([
      [0, 20, "överst"],
      [90, 6, "till höger"],
      [180, 3, "nederst"],
      [270, 11, "till vänster"],
      [-8, 20, "precis vänster om toppen"],
      [8, 20, "precis höger om toppen"],
      [10, 1, "nästa sektor medurs"],
      [350, 5, "nästa sektor moturs"],
    ])("%i° ger %i (%s)", (degrees, expected) => {
      expect(calculateScore(at(degrees, SINGLE))).toBe(expected);
    });
  });

  it("högsta möjliga poäng på 3 pilar är 180", () => {
    expect(Math.max(...sectors) * 3 * 3).toBe(180);
  });
});
