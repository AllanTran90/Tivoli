import {
  CENTER,
  sectors,
  TRIPLE_RING_INNER_RADIUS,
  TRIPLE_RING_OUTER_RADIUS,
  DOUBLE_RING_INNER_RADIUS,
  DOUBLE_RING_OUTER_RADIUS,
} from "./constants";

export function drawTripleRing(ctx: CanvasRenderingContext2D) {
  sectors.forEach((_, index) => {
    const startAngle = (index * 18 - 90) * (Math.PI / 180);

    const endAngle = ((index + 1) * 18 - 90) * (Math.PI / 180);

    ctx.beginPath();

    ctx.arc(CENTER, CENTER, TRIPLE_RING_OUTER_RADIUS, startAngle, endAngle);

    ctx.arc(
      CENTER,
      CENTER,
      TRIPLE_RING_INNER_RADIUS,
      endAngle,
      startAngle,
      true,
    );

    ctx.closePath();

    ctx.fillStyle = index % 2 === 0 ? "red" : "green";

    ctx.fill();
  });
}

export function drawDoubleRing(ctx: CanvasRenderingContext2D) {
  sectors.forEach((_, index) => {
    const startAngle = (index * 18 - 90) * (Math.PI / 180);

    const endAngle = ((index + 1) * 18 - 90) * (Math.PI / 180);

    ctx.beginPath();

    ctx.arc(CENTER, CENTER, DOUBLE_RING_OUTER_RADIUS, startAngle, endAngle);

    ctx.arc(
      CENTER,
      CENTER,
      DOUBLE_RING_INNER_RADIUS,
      endAngle,
      startAngle,
      true,
    );

    ctx.closePath();

    ctx.fillStyle = index % 2 === 0 ? "red" : "green";

    ctx.fill();
  });
}
