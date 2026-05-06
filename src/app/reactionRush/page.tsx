"use client";

import { useState } from "react";

export default function ReactionRushPage() {
  const [startTime, setStartTime] = useState<number | null>(null);

  const [time, setTime] = useState<number | null>(null);

  function startGame() {
    setTime(null);

    setStartTime(Date.now());
  }

  function stopGame() {
    if (!startTime) return;

    const endTime = Date.now();

    const result = (endTime - startTime) / 1000;

    setTime(result);
  }

  return (
    <main>
      <h1>⏱️ Reaction Rush</h1>

      <button onClick={startGame}>Play</button>

      <button onClick={stopGame}>Stop</button>

      {time && (
        <div>
          <p>Your Time: {time.toFixed(2)}</p>

          <p>
            Difference from 10:
            {Math.abs(10 - time).toFixed(2)}
          </p>
        </div>
      )}
    </main>
  );
}
