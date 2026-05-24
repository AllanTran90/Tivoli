import type { HitPosition } from "@/types/darts";

export function getHitPosition(
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): HitPosition {
  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}