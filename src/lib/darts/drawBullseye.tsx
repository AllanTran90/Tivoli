import { CENTER, BULLSEYE_RADIUS, OUTER_BULL_RADIUS } from "./constants";

export function drawBullseye(ctx: CanvasRenderingContext2D) {
  // outer bull

  ctx.beginPath();

  ctx.arc(CENTER, CENTER, OUTER_BULL_RADIUS, 0, Math.PI * 2);

  ctx.fillStyle = "green";

  ctx.fill();

  // bullseye

  ctx.beginPath();

  ctx.arc(CENTER, CENTER, BULLSEYE_RADIUS, 0, Math.PI * 2);

  ctx.fillStyle = "red";

  ctx.fill();
}
