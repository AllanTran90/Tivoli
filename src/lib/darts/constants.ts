export const BOARD_SIZE = 600;

export const CENTER = BOARD_SIZE / 2;

//  BULL 

export const BULLSEYE_RADIUS = 10;

export const OUTER_BULL_RADIUS = 22;

// INNER SINGLE 

export const INNER_SINGLE_RADIUS = 22;

//  TRIPLE RING 

export const TRIPLE_RING_INNER_RADIUS = 150;

export const TRIPLE_RING_OUTER_RADIUS = 165;

//  OUTER SINGLE 

export const OUTER_SINGLE_RADIUS = 230;

//  DOUBLE RING 

export const DOUBLE_RING_INNER_RADIUS = 230;

export const DOUBLE_RING_OUTER_RADIUS = 250;

//  BOARD 

export const OUTER_BOARD_RADIUS = 300;

// SECTORS

/** Siffrorna medurs med 20 överst, som på en riktig darttavla. */
export const sectors = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17,
  3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

export const SECTOR_DEGREES = 360 / sectors.length; // 18°

/**
 * Var sektor `index` börjar, i grader medurs från toppen.
 * Sektor 0 (20) är centrerad överst och går från -9° till +9°.
 * Används av BÅDE ritkoden och poängräkningen, så att de alltid stämmer överens.
 */
export function sectorStartDegrees(index: number): number {
  return index * SECTOR_DEGREES - SECTOR_DEGREES / 2;
}

/** Grader medurs från toppen → radianer i canvas (där 0 är åt höger). */
export function toCanvasRadians(degreesFromTop: number): number {
  return ((degreesFromTop - 90) * Math.PI) / 180;
}

/** Start- och slutvinkel i canvas-radianer för sektor `index`. */
export function sectorArc(index: number): [start: number, end: number] {
  const start = sectorStartDegrees(index);
  return [toCanvasRadians(start), toCanvasRadians(start + SECTOR_DEGREES)];
}

export const WINDS = ["Left", "Right", "Up", "Down"] as const;

export type Wind = (typeof WINDS)[number];