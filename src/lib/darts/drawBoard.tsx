import { CENTER, OUTER_BOARD_RADIUS } from "./constants";
import { drawWedges } from "./drawWedges";
import { drawTripleRing, drawDoubleRing } from "./drawRings";
import { drawBullseye } from "./drawBullseye";
import { drawSectorLines } from "./drawSectorLines";
import { drawNumbers } from "./drawNumbers";

export function drawBoard(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 600, 600);

  // outer board

  ctx.beginPath();

  ctx.arc(CENTER, CENTER, OUTER_BOARD_RADIUS, 0, Math.PI * 2);

  ctx.fillStyle = "black";

  ctx.fill();

  drawWedges(ctx);

  drawTripleRing(ctx);

  drawDoubleRing(ctx);

  drawBullseye(ctx);

  drawSectorLines(ctx);

  drawNumbers(ctx);
}
