import { CENTER, SECTOR_DEGREES, sectors, sectorStartDegrees, toCanvasRadians } from "./constants";

export function drawNumbers(ctx: CanvasRenderingContext2D) {
  sectors.forEach((number, index) => {
    // Siffran mitt i sin sektor.
    const angle = toCanvasRadians(sectorStartDegrees(index) + SECTOR_DEGREES / 2);

    const x = CENTER + Math.cos(angle) * 275;

    const y = CENTER + Math.sin(angle) * 275;

    ctx.fillStyle = "white";

    ctx.font = "32px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(String(number), x, y);
  });
}
