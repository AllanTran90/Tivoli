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
  aimX: number;
  aimY: number;
  keyboardThrow: boolean;
};

type Hit = {
  x: number;
  y: number;
};

export default function DartBoard({
  onScore,
  throwsLeft,
  wind,
  clearBoard,
  aimX,
  aimY,
  keyboardThrow,
}: Props) {

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [hits, setHits] =
    useState<Hit[]>([]);

  useEffect(() => {
    setHits([]);
  }, [clearBoard]);

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    // clean canvas
    ctx.clearRect(
      0,
      0,
      BOARD_SIZE,
      BOARD_SIZE
    );

    // draw dartboard
    drawBoard(ctx);

    // draw hitpoints
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

    // draw aim
    ctx.beginPath();

    ctx.arc(
      aimX,
      aimY,
      8,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "lime";

    ctx.fill();

  }, [hits, aimX, aimY]);

  function throwDart(hit: Hit) {

    const windStrength =
      Math.floor(Math.random() * 20) + 5;

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

    setHits((prev) => [
      ...prev,
      hit,
    ]);

    const score =
      calculateScore(hit);

    onScore(score);
  }

  useEffect(() => {

    if (!keyboardThrow) return;

    const hit = {
      x: aimX,
      y: aimY,
    };

    throwDart(hit);

  }, [keyboardThrow]);

  function handleClick(
    event: React.MouseEvent<HTMLCanvasElement>
  ) {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    // stop after 3 throws
    if (throwsLeft <= 0) return;

    // get hitpoint
    const hit =
      getHitPosition(
        event,
        canvas
      );

    throwDart(hit);
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
      }}
    />
  );
}