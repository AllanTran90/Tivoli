"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import "./style.css";

import Wheel from "./components/Wheel";
import NumberPicker from "./components/NumberPicker";
import BetInput from "./components/BetInput";

export default function ChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  function spin() {
    if (bet > balance || selectedNumber === null) return;

    const values = [1, 2, 3, 4, 5, 6];
    const random = values[Math.floor(Math.random() * values.length)];

    const newRotation = rotation + 1080 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setResult(random);

      if (random === selectedNumber) {
        setBalance((prev) => prev + bet * 2);

        confetti({
          particleCount: 150,
          spread: 120,
        });
      } else {
        setBalance((prev) => prev - bet);
      }
    }, 2000);
  }

  return (
    <div className="container">
      <h1>Chocolate Wheel</h1>

      <BetInput
        bet={bet}
        balance={balance}
        onChange={setBet}
      />

      <NumberPicker
        selected={selectedNumber}
        onSelect={setSelectedNumber}
      />

      <Wheel rotation={rotation} />

      <button onClick={spin} disabled={selectedNumber === null}>
        SPIN
      </button>

      {result !== null && (
        <p>
          {result === selectedNumber
            ? `🎉 You won! It landed on ${result}`
            : `😢 You lost! It landed on ${result}`}
        </p>
      )}
    </div>
  );
}