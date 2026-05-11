import type { HitPosition } from "@/types/darts";

export function getHitPosition(
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): HitPosition {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
