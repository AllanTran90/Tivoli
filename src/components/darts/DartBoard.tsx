"use client";

import { useEffect, useRef } from "react";

import { BOARD_SIZE } from "@/lib/darts/constants";

import { drawBoard } from "@/lib/darts/drawBoard";

import { calculateScore } from "@/lib/darts/scoring";

import { getHitPosition } from "@/lib/darts/hitDetection";


type Props = {
  onScore: (points: number) => void;
};

export default function DartBoard({ onScore }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    drawBoard(ctx);
  }, []);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const hit = getHitPosition(event, canvas);

    const score = calculateScore(hit);

    onScore(score);
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
      }}
    />
  );
}
