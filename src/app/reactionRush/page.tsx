"use client";

import { useEffect, useState } from "react";

export default function ReactionRushPage() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && startTime) {
      interval = setInterval(() => {
        const now = Date.now();

        setCurrentTime((now - startTime) / 1000);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

  function startGame() {
    setTime(null);

    setStartTime(Date.now());

    setIsPlaying(true);
  }

  function stopGame() {
    if (!startTime) return;

    const endTime = Date.now();

    const result = (endTime - startTime) / 1000;

    setTime(result);

    setIsPlaying(false);
  }

  return (
    <main>
      <h1>⏱️ Reaction Rush</h1>
      <h2>{currentTime.toFixed(2)}</h2>

      <button onClick={startGame}>Play</button>

      <button onClick={stopGame}>Stop</button>

      {time && (
        <div>
          <p>Your Time: {time.toFixed(2)}</p>

          <p>
            Difference:
            {Math.abs(10 - time).toFixed(2)}
          </p>
        </div>
      )}
    </main>
  );
}
