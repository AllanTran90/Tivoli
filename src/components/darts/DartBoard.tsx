"use client";

import { useRef } from "react";

type Props = {
  onScore: (points: number) => void;
};

export default function DartBoard({
  onScore,
}: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        background: `
          radial-gradient(
            circle,
            red 0%,
            red 5%,
            green 5%,
            green 10%,
            black 10%,
            black 25%,
            white 25%,
            white 40%,
            black 40%,
            black 100%
          )
        `,
      }}
    />
  );
}