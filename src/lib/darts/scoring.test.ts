import { describe, it, expect } from "vitest";
import { calculateScore } from "./scoring";
import { CENTER, sectors } from "./constants";

/**
 * Punkt på tavlan `degrees` medurs från toppen och `distance` från mitten.
 * Samma vinkelräkning som ritkoden (drawWedges: `(index * 18 - 90)` grader i canvas),
 * så testerna kontrollerar att poängen stämmer med det spelaren SER.
 */
function at(degrees: number, distance: number) {
  const rad = (degrees - 90) * (Math.PI / 180);
  return { x: CENTER + Math.cos(rad) * distance, y: CENTER + Math.sin(rad) * distance };
}

/** Mitten av den ritade tårtbiten för sektor `index`. */
const middleOf = (index: number) => index * 18 + 9;

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
      const start = index * 18;
      expect(calculateScore(at(start + 1, SINGLE))).toBe(value);
      expect(calculateScore(at(start + 9, SINGLE))).toBe(value);
      expect(calculateScore(at(start + 17, SINGLE))).toBe(value);
    });

    it("bugg: triple i högra delen av 20-biten räknades som triple 1 (3 poäng)", () => {
      const index20 = sectors.indexOf(20);
      expect(calculateScore(at(index20 * 18 + 14, TRIPLE))).toBe(60);
    });
  });

  it("högsta möjliga poäng på 3 pilar är 180", () => {
    expect(Math.max(...sectors) * 3 * 3).toBe(180);
  });
});
