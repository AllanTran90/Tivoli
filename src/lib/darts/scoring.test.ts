import { describe, it, expect } from "vitest";
import { calculateScore } from "./scoring";
import { CENTER, sectors } from "./constants";

// Punkt på avståndet `distance` från mitten, rakt uppåt (mitt i sektorn sectors[0])
const up = (distance: number) => ({ x: CENTER, y: CENTER - distance });

describe("calculateScore", () => {
  it("bullseye ger 50", () => {
    expect(calculateScore({ x: CENTER, y: CENTER })).toBe(50);
  });

  it("outer bull ger 25", () => {
    expect(calculateScore(up(15))).toBe(25);
  });

  it("single ger sektorns värde", () => {
    expect(calculateScore(up(100))).toBe(sectors[0]);
  });

  it("triple ger sektorns värde × 3", () => {
    expect(calculateScore(up(157))).toBe(sectors[0] * 3);
  });

  it("double ger sektorns värde × 2", () => {
    expect(calculateScore(up(240))).toBe(sectors[0] * 2);
  });

  it("utanför tavlan ger 0", () => {
    expect(calculateScore(up(260))).toBe(0);
    expect(calculateScore({ x: 0, y: 0 })).toBe(0);
  });

  it("varje sektor ger rätt siffra runt hela tavlan", () => {
    sectors.forEach((value, index) => {
      // vinkel 0° = uppåt, medurs, 18° per sektor
      const rad = (index * 18 - 90) * (Math.PI / 180);
      const hit = { x: CENTER + Math.cos(rad) * 100, y: CENTER + Math.sin(rad) * 100 };
      expect(calculateScore(hit)).toBe(value);
    });
  });

  it("högsta möjliga poäng på 3 pilar är 180", () => {
    const max = Math.max(...sectors) * 3;
    expect(max * 3).toBeLessThanOrEqual(180);
  });
});
