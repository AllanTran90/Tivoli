"use client";

import { useState, useEffect } from "react";
import styles from "./chocolateWheel.module.css";
import Wheel from "./components/Wheel";
import NumberPicker from "./components/NumberPicker";
import BetInput from "./components/BetInput";
import { useWallet } from "@/context/WalletContext";
import HowToPlay from "@/components/HowToPlay";
import GameButton from "@/components/GameButton";
import triggerWinConfetti from "@/lib/confetti";
import { playChocolateWheelRound } from "@/lib/chocolateWheel/playChocolateWheelRound";

export default function ChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const { balance, setBalance } = useWallet();
  const [bet, setBet] = useState(2);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [identityToken, setIdentityToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("identity_token");
    setIdentityToken(token);
  }, []);

  function spin() {
    if (bet > balance || selectedNumber === null) return;

    const values = [1, 2, 3, 4, 5, 6];
    const random = values[Math.floor(Math.random() * values.length)];
    const sliceSize = 360 / 6;
    const sliceIndex = random - 1;
    const sliceCenter = sliceIndex * sliceSize + sliceSize / 2;
    const pointerAngle = 270 + 30;
    const targetAngle = pointerAngle - sliceCenter;
    const current = rotation % 360;

    let delta = targetAngle - current;
    if (delta < 0) delta += 360;

    const newRotation = rotation + delta + 3 * 360;
    setRotation(newRotation);

    setTimeout(async () => {
      setResult(random);

      setHistory((prev) => [
        `${random === selectedNumber ? "WIN 🎉" : "LOSS 😢"} | Number: ${random} | Bet: ${bet}`,
        ...prev,
      ]);

      try {
        const data = await playChocolateWheelRound(
          selectedNumber,
          random,
          bet,
          identityToken || undefined,
        );

        if (data.success && data.result?.moneyWon > 0) {
          triggerWinConfetti();
          setBalance(balance + data.result.moneyWon);
          setHistory((prev) => [`WON €${data.result.moneyWon}`, ...prev]);
        } else {
          setBalance(balance - bet);
          setHistory((prev) => [`LOST €${bet}`, ...prev]);
        }
      } catch (error) {
        console.error(error);
      }
    }, 1200);
  }

  return (
    <div className={styles.container}>
      <h1> Chocolate Wheel</h1>

      <div className={styles.layout}>
        <div className={styles.leftPanel}>
          <BetInput bet={bet} balance={balance} onChange={setBet} />

          <div className={styles.gameRow}>
            <NumberPicker selected={selectedNumber} onSelect={setSelectedNumber} />
          </div>

          <div className={styles.centerPanel}>
            <Wheel rotation={rotation} />
          </div>

          <GameButton
            text="SPIN"
            onClick={spin}
            disabled={selectedNumber === null}
            className={styles.spin}
          />

          {result !== null && (
            <p className={result === selectedNumber ? styles.win : styles.lose}>
              {result === selectedNumber
                ? `🎉 You won! (${result})`
                : `😢 You lost (${result})`}
            </p>
          )}
        </div>

        <div className={styles.rightPanel}>
          <HowToPlay
            title="How To Play"
            steps={[
              "It costs 2€ to play",
              "Each spin costs your bet amount",
              "Choose a number",
              "Place your bet",
              "Spin the wheel and hope for the best",
              "Match the numbers to win coins",
            ]}
          />
          <br />
          <h3>📜 History</h3>
          <div className={styles.historyBox}>
            {history.length === 0 && <p>No games yet</p>}
            {history.map((entry, i) => (
              <p key={i}>{entry}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}