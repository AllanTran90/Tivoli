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
} from "./constants";
import type { HitPosition } from "@/types/darts";

export function calculateScore(
  hit: HitPosition
) {
  const dx = hit.x - CENTER;
  const dy = hit.y - CENTER;

  const distance = Math.sqrt(
    dx * dx + dy * dy
  );

   // angle
  let angle =
    Math.atan2(dy, dx) * (180 / Math.PI);

  // rotate so 20 is at the top
  angle += 90;

  if (angle < 0) {
    angle += 360;
  }

  // each sector = 18 degrees
  const sectorIndex =
    Math.floor(angle / 18) % 20;

  const baseScore =
    sectors[sectorIndex];

  // bullseye
  if (distance <= BULLSEYE_RADIUS) {
    return 50;
  }

  // outer bull
  if (distance <= OUTER_BULL_RADIUS) {
    return 25;
  }

  // triple ring
  if (
    distance >= TRIPLE_RING_INNER_RADIUS &&
    distance <= TRIPLE_RING_OUTER_RADIUS
  ) {
    return baseScore * 3;
  }

  // double ring
  if (
    distance >= DOUBLE_RING_INNER_RADIUS &&
    distance <= DOUBLE_RING_OUTER_RADIUS
  ) {
    return baseScore * 2;
  }

  // single area
  if (
    distance <= OUTER_SINGLE_RADIUS
  ) {
    return baseScore;
  }

  // miss
  return 0;
}