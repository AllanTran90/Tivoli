"use client";

import GameButton from "@/components/GameButton";
import GameLayout from "@/components/GameLayout";
import History from "@/components/History";
import HowToPlay from "@/components/HowToPlay";
import { useChocolateWheel } from "@/hooks/useChocolateWheel";
import { CHOCOLATE_WHEEL } from "@/lib/games/catalog";
import { CHOCOLATE_WHEEL_COST } from "@/lib/games/rules";
import NumberPicker from "./components/NumberPicker";
import Wheel from "./components/Wheel";
import styles from "./chocolateWheel.module.css";

const HOW_TO_STEPS = [
  `Each spin costs ${CHOCOLATE_WHEEL_COST} ❤️`,
  "Choose a number from 1 to 6",
  "Spin the wheel",
  "If it stops on your number you win +2 ❤️",
];

export default function ChocolateWheelPage() {
  const { result, rotation, selectedNumber, setSelectedNumber, history, spin, canSpin, ...session } = useChocolateWheel();
  const won = result !== null && result === selectedNumber;

  return (
    <GameLayout
      icon={CHOCOLATE_WHEEL.icon}
      title={CHOCOLATE_WHEEL.name}
      tagline={CHOCOLATE_WHEEL.tagline}
      accent={CHOCOLATE_WHEEL.accent}
      hasLeaderboard={false}
      {...session}
      sidebar={
        <>
          <HowToPlay steps={HOW_TO_STEPS} />
          <History items={history} />
        </>
      }
    >
      <Wheel rotation={rotation} />

      <p className={`${styles.result} ${result === null ? "" : won ? styles.win : styles.lose}`} aria-live="polite">
        {result === null ? "Pick a number and spin!" : won ? `🎉 It landed on ${result}. You won!` : `😢 It landed on ${result}. Try again!`}
      </p>

      <div className={styles.controls}>
        <NumberPicker selected={selectedNumber} onSelect={setSelectedNumber} />
        <GameButton text="🎡 Spin" onClick={spin} disabled={!canSpin} />
      </div>
    </GameLayout>
  );
}
