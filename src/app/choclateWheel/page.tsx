"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import "./style.css";

export default function ChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(10);

  function spin() {
    if (bet > balance) return;

    const values = [0, 2, 3, 5];
    const random = values[Math.floor(Math.random() * values.length)];

    // 🎡 snurra (3 varv + lite extra)
    const newRotation = rotation + 1080 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setResult(random);

      if (random === 0) {
        setBalance((prev) => prev - bet);
      } else {
        setBalance((prev) => prev + bet * random);
      }

      if (random > 0) {
        confetti({
          particleCount: 150,
          spread: 120,
        });
      }
    }, 2000);
  }

  return (
    <div className="container">
      <h1>🍫 Chocolate Wheel</h1>

      <p>💰 Balance: {balance}€</p>

      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(Number(e.target.value))}
      />

      <div className="wheel-container">
        <div className="pointer">▼</div>

        <div
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((num, i) => {
            const angle = i * 60;

            return (
              <span
                key={num}
                className="slice-text"
                style={{
                  transform: `rotate(${angle}deg) translate(80px) rotate(-${angle}deg)`,
                }}
              >
                {num}
              </span>
            );
          })}
        </div>
      </div>

      <button onClick={spin}>SPIN</button>

      {result !== null && (
        <p>{result === 0 ? "😢 You lost" : `🎉 You won x${result}`}</p>
      )}
    </div>
  );
}
