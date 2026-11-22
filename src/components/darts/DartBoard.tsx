"use client";

import { useEffect, useRef } from "react";
import { BOARD_SIZE } from "@/lib/darts/constants";
import { drawBoard } from "@/lib/darts/drawBoard";
import { getHitPosition } from "@/lib/darts/hitDetection";
import type { HitPosition } from "@/types/darts";

type Props = {
  hits: HitPosition[];
  aimX: number;
  aimY: number;
  disabled: boolean;
  onThrow: (target: HitPosition) => void;
};

/** Ritar tavlan, träffarna och siktet. All spellogik ligger i useDartsGame. */
export default function DartBoard({ hits, aimX, aimY, disabled, onThrow }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    drawBoard(ctx);

    for (const hit of hits) {
      ctx.beginPath();
      ctx.arc(hit.x, hit.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(aimX, aimY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "lime";
    ctx.fill();
  }, [hits, aimX, aimY]);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>): void {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;
    onThrow(getHitPosition(event, canvas));
  }

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_SIZE}
      height={BOARD_SIZE}
      onClick={handleClick}
      style={{
        borderRadius: "50%",
        border: "none",
        width: "100%",
        height: "auto",
        maxWidth: BOARD_SIZE,
        cursor: disabled ? "not-allowed" : "crosshair",
      }}
    />
  );
}
