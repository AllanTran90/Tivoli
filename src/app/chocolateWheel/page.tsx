"use client";

import { useState } from "react";
import styles from "./chocolateWheel.module.css";
import Wheel from "./components/Wheel";
import NumberPicker from "./components/NumberPicker";
import { useWallet } from "@/context/WalletContext";
import HowToPlay from "@/components/HowToPlay";
import GameButton from "@/components/GameButton";
import triggerWinConfetti from "@/lib/confetti";
import BackToLoopland from "@/components/BackToLoopland";
import History from "@/components/History";
import GameSessionBar from "@/components/GameSessionBar";
import { useGameSession } from "@/hooks/useGameSession";
import { playGame } from "@/lib/playGame";

export default function ChocolateWheel() {
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const { plays, setPlays } = useWallet();
  const { identityToken, userName, playerName, setPlayerName, bankError, setBankError } =
    useGameSession("/chocolateWheel");

  async function spin(): Promise<void> {
    if (plays <= 0 || selectedNumber === null) return;

    setBankError(null);

    const values = [1, 2, 3, 4, 5, 6];
    const random = values[Math.floor(Math.random() * values.length)];

    const sliceSize = 360 / 6;
    const sliceCenter = (random - 1) * sliceSize + sliceSize / 2;
    const targetAngle = 300 - sliceCenter;
    const current = rotation % 360;
    let delta = targetAngle - current;
    if (delta < 0) delta += 360;

    setRotation(rotation + delta + 3 * 360);

    setTimeout(async () => {
      setResult(random);

      const updatedLives = plays - 1;

      if (identityToken) {
        const apiResult = await playGame({
          game: "chocolate-wheel",
          amount: 1,
          identityToken,
          selectedNumber: selectedNumber!,
          resultNumber: random,
          multiplier: 3,
        });

        if (!apiResult.success) {
          setBankError(apiResult.error ?? "Betalning misslyckades");
        }
      }

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

      <GameSessionBar
        userName={userName}
        bankError={bankError}
        playerName={playerName}
        setPlayerName={setPlayerName}
      />

      <BackToLoopland />

      <div className={styles.layout}>
        <div className={styles.topSection}>
          <div className={styles.leftPanel}>
            <div className={styles.gameRow}>
              <NumberPicker selected={selectedNumber} onSelect={setSelectedNumber} />
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
                "Write your alias for a chance to enter the leaderboard 🏆",
              ]}
            />

            <History title="📜 History" items={history} />
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
            {result === selectedNumber ? `🎉 You won! (${result})` : `😢 You lost (${result})`}
          </p>
        )}
      </div>
    </div>
  );
}
