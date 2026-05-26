"use client";

import { useState, useEffect } from "react";
import styles from "./chocolateWheel.module.css";
import Wheel from "./components/Wheel";
import NumberPicker from "./components/NumberPicker";
import { useWallet } from "@/context/WalletContext";
import HowToPlay from "@/components/HowToPlay";
import GameButton from "@/components/GameButton";
import triggerWinConfetti from "@/lib/confetti";
import BackToLoopland from "@/components/BackToLoopland";
import PlayerNameInput from "../leaderboard/PlayerNameInput";

export default function ChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const { plays, setPlays } = useWallet();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("identity_token");

    setIdentityToken(token);
  }, []);

  async function spin() {
    if (plays <= 0 || selectedNumber === null) return;

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

      const updatedLives = plays - 1;

      if (random === selectedNumber) {
        triggerWinConfetti();

        await setPlays(updatedLives + 2);

        setHistory((prev) => [`WIN 🎉 | Number: ${random} | +2 ❤️`, ...prev]);
      } else {
        await setPlays(updatedLives);

        setHistory((prev) => [`LOSS 😢 | Number: ${random} | -1 ❤️`, ...prev]);
      }
    }, 1200);
  }

  return (
    <div className={styles.container}>
      <h1>Chocolate Wheel</h1>

      <PlayerNameInput playerName={playerName} setPlayerName={setPlayerName} />

      <BackToLoopland />

      <div className={styles.layout}>
        <div className={styles.topSection}>
          <div className={styles.leftPanel}>
            <div className={styles.gameRow}>
              <NumberPicker
                selected={selectedNumber}
                onSelect={setSelectedNumber}
              />
            </div>
          </div>

          <div className={styles.rightPanel}>
            <HowToPlay
              title="How To Play"
              steps={[
                "Each spin costs 1 ❤️",
                "Choose a number",
                "Spin the wheel",
                "Match the number to win",
                "Winning gives +2 ❤️",
                "Write your alias for a chance to enter the leaderboard 🏆"
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
    </div>
  );
}
