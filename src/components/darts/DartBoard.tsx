"use client";

import { useEffect, useRef, useState } from "react";

import { BOARD_SIZE } from "@/lib/darts/constants";
import { drawBoard } from "@/lib/darts/drawBoard";
import { calculateScore } from "@/lib/darts/scoring";
import { getHitPosition } from "@/lib/darts/hitDetection";

type Props = {
  onScore: (points: number) => void;
  throwsLeft: number;
  wind: string;
  clearBoard: boolean;
};

type Hit = {
  x: number;
  y: number;
};

export default function DartBoard({ onScore, throwsLeft, wind, clearBoard, }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {

      setHits([]);
}, [clearBoard]);

    useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // clean canvas
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // draw dartboard
    drawBoard(ctx);

    // draw hitpoints
    hits.forEach((hit) => {
      ctx.beginPath();

      ctx.arc(hit.x, hit.y, 6, 0, Math.PI * 2);

      ctx.fillStyle = "yellow";

      ctx.fill();
    });
  }, [hits]);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // stop after 3 throws
    if (throwsLeft <= 0) return;

    // get hitpoint
    const hit = getHitPosition(event, canvas);

    // random wind strength
    const windStrength = Math.floor(Math.random() * 20) + 5;

    // apply wind
    if (wind === "Left") {
      hit.x -= windStrength;
    }

    if (wind === "Right") {
      hit.x += windStrength;
    }

    if (wind === "Up") {
      hit.y -= windStrength;
    }

    if (wind === "Down") {
      hit.y += windStrength;
    }

    // save hit
    setHits((prev) => [...prev, hit]);

    // calculate score
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
