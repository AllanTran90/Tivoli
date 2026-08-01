"use client";

import styles from "./chocolateWheel.module.css";
import Wheel from "./components/Wheel";
import NumberPicker from "./components/NumberPicker";
import HowToPlay from "@/components/HowToPlay";
import GameButton from "@/components/GameButton";
import BackToLoopland from "@/components/BackToLoopland";
import History from "@/components/History";
import GameSessionBar from "@/components/GameSessionBar";
import { useChocolateWheel } from "@/hooks/useChocolateWheel";

const HOW_TO_STEPS = [
  "Each spin costs 1 ❤️",
  "Choose a number",
  "Spin the wheel",
  "Match the number to win",
  "Winning gives +2 ❤️",
  "Write your alias for a chance to enter the leaderboard 🏆",
];

export default function ChocolateWheel() {
  const { result, rotation, selectedNumber, setSelectedNumber, history, spin, userName, bankError, playerName, setPlayerName } = useChocolateWheel();

  return (
    <div className={styles.container}>
      <h1>Chocolate Wheel</h1>
      <GameSessionBar userName={userName} bankError={bankError} playerName={playerName} setPlayerName={setPlayerName} />
      <BackToLoopland />

      <div className={styles.layout}>
        <div className={styles.topSection}>
          <div className={styles.leftPanel}>
            <div className={styles.gameRow}>
              <NumberPicker selected={selectedNumber} onSelect={setSelectedNumber} />
            </div>
          </div>
          <div className={styles.rightPanel}>
            <HowToPlay title="How To Play" steps={HOW_TO_STEPS} />
            <History title="📜 History" items={history} />
          </div>
        </div>

        <div className={styles.centerPanel}>
          <Wheel rotation={rotation} />
        </div>

        <GameButton text="SPIN" onClick={spin} disabled={selectedNumber === null} className={styles.spin} />

        {result !== null && (
          <p className={result === selectedNumber ? styles.win : styles.lose}>
            {result === selectedNumber ? `🎉 You won! (${result})` : `😢 You lost (${result})`}
          </p>
        )}
      </div>
    </div>
  );
}
