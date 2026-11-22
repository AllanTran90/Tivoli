import {
  CENTER,
  BULLSEYE_RADIUS,
  OUTER_BULL_RADIUS,
  INNER_SINGLE_RADIUS,
  TRIPLE_RING_INNER_RADIUS,
  TRIPLE_RING_OUTER_RADIUS,
  OUTER_SINGLE_RADIUS,
  DOUBLE_RING_INNER_RADIUS,
  DOUBLE_RING_OUTER_RADIUS,
  sectors,
  SECTOR_DEGREES,
  sectorStartDegrees,
} from "./constants";
import type { HitPosition } from "@/types/darts";

/** Vilken sektor en träff ligger i. Samma vinklar som ritkoden, via sectorStartDegrees(). */
function getSectorScore(dx: number, dy: number): number {
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // 0° = uppåt, medurs
  const fromFirstSector = (((angle - sectorStartDegrees(0)) % 360) + 360) % 360;
  return sectors[Math.floor(fromFirstSector / SECTOR_DEGREES) % sectors.length];
}

export function calculateScore(hit: HitPosition): number {
  const dx = hit.x - CENTER;
  const dy = hit.y - CENTER;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > DOUBLE_RING_OUTER_RADIUS) return 0;
  if (distance <= BULLSEYE_RADIUS) return 50;
  if (distance <= OUTER_BULL_RADIUS) return 25;
  if (distance < INNER_SINGLE_RADIUS) return 0;

  const sector = getSectorScore(dx, dy);

  if (distance >= TRIPLE_RING_INNER_RADIUS && distance <= TRIPLE_RING_OUTER_RADIUS) return sector * 3;
  if (distance >= DOUBLE_RING_INNER_RADIUS && distance <= DOUBLE_RING_OUTER_RADIUS) return sector * 2;
  if (distance <= OUTER_SINGLE_RADIUS || distance < DOUBLE_RING_INNER_RADIUS) return sector;

  return 0;
}
