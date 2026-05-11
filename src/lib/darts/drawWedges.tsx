import {
  CENTER,
  INNER_SINGLE_RADIUS,
  OUTER_SINGLE_RADIUS,
  sectors,
} from "./constants";

export function drawWedges(ctx: CanvasRenderingContext2D) {
  sectors.forEach((_, index) => {
    const startAngle = (index * 18 - 90) * (Math.PI / 180);

    const endAngle = ((index + 1) * 18 - 90) * (Math.PI / 180);

    ctx.beginPath();

    const innerStartX = CENTER + Math.cos(startAngle) * INNER_SINGLE_RADIUS;

    const innerStartY = CENTER + Math.sin(startAngle) * INNER_SINGLE_RADIUS;

    ctx.moveTo(innerStartX, innerStartY);

    ctx.arc(CENTER, CENTER, OUTER_SINGLE_RADIUS, startAngle, endAngle);

    ctx.arc(CENTER, CENTER, INNER_SINGLE_RADIUS, endAngle, startAngle, true);

    ctx.closePath();

    ctx.fillStyle = index % 2 === 0 ? "#d8d2b0" : "black";

    ctx.fill();
  });
}
