"use client";

import { useEffect, useRef } from "react";
import { sectors, CENTER } from "@/lib/darts/constants";

type Props = {
  onScore: (points: number) => void;
};

export default function DartBoard({
  onScore,
}: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // ===== OUTER BOARD =====

    ctx.beginPath();

    ctx.arc(
      CENTER,
      CENTER,
      290,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "black";

    ctx.fill();

    // ===== SECTOR LINES =====

    sectors.forEach((_, index) => {

      const angle =
        ((index * 18) - 90) *
        (Math.PI / 180);

      const x =
        CENTER +
        Math.cos(angle) * 290;

      const y =
        CENTER +
        Math.sin(angle) * 290;

      ctx.beginPath();

      ctx.moveTo(CENTER, CENTER);

      ctx.lineTo(x, y);

      ctx.strokeStyle = "white";

      ctx.lineWidth = 2;

      ctx.stroke();
    });

  }, []);

  function handleClick() {

    console.log("clicked");

    const possibleScores = [1, 2, 25, 50];

    const randomScore =
      possibleScores[
        Math.floor(
          Math.random() * possibleScores.length
        )
      ];

    onScore(randomScore);
  }

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      onClick={handleClick}
      style={{
        borderRadius: "50%",
        border: "4px solid white",
      }}
    />
  );
}