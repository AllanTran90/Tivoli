"use client";

import { useEffect, useRef } from "react";
import { sectors, CENTER } from "@/lib/darts/constants";

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

    // clear canvas
    ctx.clearRect(0, 0, 600, 600);

    // ===== OUTER BOARD =====

    ctx.beginPath();

    ctx.arc(CENTER, CENTER, 290, 0, Math.PI * 2);

    ctx.fillStyle = "black";

    ctx.fill();

    // ===== WEDGES =====

    sectors.forEach((_, index) => {
      const startAngle = (index * 18 - 90) * (Math.PI / 180);

      const endAngle = ((index + 1) * 18 - 90) * (Math.PI / 180);

      const innerRadius = 70;

      ctx.beginPath();

      // start inner point
      const innerStartX = CENTER + Math.cos(startAngle) * innerRadius;

      const innerStartY = CENTER + Math.sin(startAngle) * innerRadius;

      ctx.moveTo(innerStartX, innerStartY);

      // outer arc
      ctx.arc(CENTER, CENTER, 250, startAngle, endAngle);

      // inner arc tillbaka
      ctx.arc(CENTER, CENTER, innerRadius, endAngle, startAngle, true);

      ctx.closePath();

      ctx.fillStyle = index % 2 === 0 ? "#d8d2b0" : "black";

      ctx.fill();
    });

    // ===== TRIPLE RING SEGMENTS =====

    sectors.forEach((_, index) => {
      const startAngle = (index * 18 - 90) * (Math.PI / 180);

      const endAngle = ((index + 1) * 18 - 90) * (Math.PI / 180);

      ctx.beginPath();

      // outer edge
      ctx.arc(CENTER, CENTER, 190, startAngle, endAngle);

      // inner edge tillbaka
      ctx.arc(CENTER, CENTER, 170, endAngle, startAngle, true);

      ctx.closePath();

      ctx.fillStyle = index % 2 === 0 ? "green" : "red";

      ctx.fill();
    });

    // ===== DOUBLE RING =====

    ctx.beginPath();

    ctx.arc(CENTER, CENTER, 270, 0, Math.PI * 2);

    ctx.strokeStyle = "red";

    ctx.lineWidth = 18;

    ctx.stroke();

    // ===== SECTOR LINES =====

    sectors.forEach((_, index) => {
      const angle = (index * 18 - 90) * (Math.PI / 180);

      const innerRadius = 70;

      const startX = CENTER + Math.cos(angle) * innerRadius;

      const startY = CENTER + Math.sin(angle) * innerRadius;

      const endX = CENTER + Math.cos(angle) * 290;

      const endY = CENTER + Math.sin(angle) * 290;

      ctx.beginPath();

      ctx.moveTo(startX, startY);

      ctx.lineTo(endX, endY);

      ctx.strokeStyle = "white";

      ctx.lineWidth = 2;

      ctx.stroke();
    });
  }, []);

  function handleClick() {
    console.log("clicked");

    const possibleScores = [1, 2, 25, 50];

    const randomScore =
      possibleScores[Math.floor(Math.random() * possibleScores.length)];

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
