import {
  CENTER,
  INNER_SINGLE_RADIUS,
  OUTER_BOARD_RADIUS,
  sectors,
} from "./constants";

export function drawSectorLines(ctx: CanvasRenderingContext2D) {
  sectors.forEach((_, index) => {
    const angle = (index * 18 - 90) * (Math.PI / 180);

    const startX = CENTER + Math.cos(angle) * INNER_SINGLE_RADIUS;

    const startY = CENTER + Math.sin(angle) * INNER_SINGLE_RADIUS;

    const endX = CENTER + Math.cos(angle) * OUTER_BOARD_RADIUS;

    const endY = CENTER + Math.sin(angle) * OUTER_BOARD_RADIUS;

    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(endX, endY);

    ctx.strokeStyle = "white";

    ctx.lineWidth = 2;

    ctx.stroke();
  });
}
