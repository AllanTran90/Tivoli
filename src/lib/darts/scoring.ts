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

export function calculateScore(hit: HitPosition) {
  const dx = hit.x - CENTER;
  const dy = hit.y - CENTER;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // Miss outside the doublering
  if (distance > DOUBLE_RING_OUTER_RADIUS) {
    return 0;
  }

  // Bullseye
  if (distance <= BULLSEYE_RADIUS) {
    return 50;
  }

  // Outer bull
  if (distance <= OUTER_BULL_RADIUS) {
    return 25;
  }

  const sectorScore = getSectorScore(dx, dy);

  // black area outside the field
  if (distance < INNER_SINGLE_RADIUS) {
    return 0;
  }


function getSectorScore(dx: number, dy: number) {
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);

  angle += 90;


  if (angle < 0) {
    angle += 360;
  }

  const sectorIndex = Math.floor(angle / 18);

  return sectors[sectorIndex];
}

  // Triple ring
  if (
    distance >= TRIPLE_RING_INNER_RADIUS &&
    distance <= TRIPLE_RING_OUTER_RADIUS
  ) {
    return sectorScore * 3;
  }

  // Double ring
  if (
    distance >= DOUBLE_RING_INNER_RADIUS &&
    distance <= DOUBLE_RING_OUTER_RADIUS
  ) {
    return sectorScore * 2;
  }

  // Single areas
  if (distance <= OUTER_SINGLE_RADIUS) {
    return sectorScore;
  }

  // between single and double
  if (distance < DOUBLE_RING_INNER_RADIUS) {
    return sectorScore;
  }

  return 0;
}

function getSectorScore(dx: number, dy: number) {
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);

  angle += 90;

  if (angle < 0) {
    angle += 360;
  }

  const sectorIndex = Math.floor((angle + 9) / 18) % 20;

  return sectors[sectorIndex];
}
