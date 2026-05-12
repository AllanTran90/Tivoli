"use client";

import { useEffect, useRef, useState } from "react";

import { BOARD_SIZE } from "@/lib/darts/constants";
import { drawBoard } from "@/lib/darts/drawBoard";
import { calculateScore } from "@/lib/darts/scoring";
import { getHitPosition } from "@/lib/darts/hitDetection";

type Props = {
  onScore: (points: number) => void;
  throwsLeft: number;
};

type Hit = {
  x: number;
  y: number;
};

export default function DartBoard({ onScore, throwsLeft, }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    
    if (throwsLeft <= 0) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // clean canvas
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // draw dartboard
    drawBoard(ctx);

    // draw hitpoint
    hits.forEach((hit) => {
      ctx.beginPath();

      ctx.arc(
        hit.x,
        hit.y,
        6,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "yellow";

      ctx.fill();
    });
  }, [hits]);

  function handleClick(
    event: React.MouseEvent<HTMLCanvasElement>
  ) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // get hitpoint
    const hit = getHitPosition(event, canvas);

    // save the point
    setHits((prev) => [
      ...prev,
      hit,
    ]);

    // count score
    const score = calculateScore(hit);

    // send score to parent
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