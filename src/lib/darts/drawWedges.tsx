import {
  CENTER,
  INNER_SINGLE_RADIUS,
  OUTER_SINGLE_RADIUS,
  sectors,
  sectorArc,
} from "./constants";

export function drawWedges(ctx: CanvasRenderingContext2D) {
  sectors.forEach((_, index) => {
    const [startAngle, endAngle] = sectorArc(index);

    ctx.beginPath();

    const innerStartX = CENTER + Math.cos(startAngle) * INNER_SINGLE_RADIUS;

    const innerStartY = CENTER + Math.sin(startAngle) * INNER_SINGLE_RADIUS;

    ctx.moveTo(innerStartX, innerStartY);

    ctx.arc(CENTER, CENTER, OUTER_SINGLE_RADIUS, startAngle, endAngle);

    ctx.arc(CENTER, CENTER, INNER_SINGLE_RADIUS, endAngle, startAngle, true);

    ctx.closePath();

    // Som en riktig tavla: 20 är svart, sedan varannan ljus.
    ctx.fillStyle = index % 2 === 0 ? "black" : "#d8d2b0";

    ctx.fill();
  });
}
