import { CENTER, sectors } from "./constants";

export function drawNumbers(ctx: CanvasRenderingContext2D) {
  sectors.forEach((number, index) => {
    const angle = (index * 18 - 81) * (Math.PI / 180);

    const x = CENTER + Math.cos(angle) * 275;

    const y = CENTER + Math.sin(angle) * 275;

    ctx.fillStyle = "white";

    ctx.font = "32px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(String(number), x, y);
  });
}
