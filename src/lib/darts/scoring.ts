import { CENTER, BULLSEYE_RADIUS, OUTER_BULL_RADIUS, DOUBLE_RING_RADIUS } from "./constants";
import type { HitPosition } from "@/types/darts";

export function calculateScore(
  hit: HitPosition
) {
  const dx = hit.x - CENTER;
  const dy = hit.y - CENTER;

  const distance = Math.sqrt(
    dx * dx + dy * dy
  );

  // bullseye
  if (distance < BULLSEYE_RADIUS) {
    return 50;
  }

  // outer bull
  if (distance < OUTER_BULL_RADIUS) {
    return 25;
  }

  // double ring
  if (distance < DOUBLE_RING_RADIUS) {
    return 2;
  }

  // outer ring
  return 1;
}