"use client";

import DartBoard from "@/components/darts/DartBoard";
import GameButton from "@/components/GameButton";
import History from "@/components/History";
import InfoBar from "@/components/darts/Infobar";
import ThrowButton from "@/components/darts/throwButton";
import HowToPlay from "@/components/HowToPlay";
import BackToLoopland from "@/components/BackToLoopland";
import GameSessionBar from "@/components/GameSessionBar";
import { useDartsGame } from "@/hooks/useDartsGame";

const HOW_TO_STEPS = [
  "Each round costs 3 ❤️",
  "You get 3 darts",
  "Use arrow keys to aim",
  "Press SPACE or Throw button",
  "Reach 150 points for +10 ❤️",
  "Reach 100 points for +5 ❤️",
  "Write your alias for a chance to enter the leaderboard 🏆",
];

export default function DartsPage() {
  const { score, throwsLeft, history, clearBoard, wind, aimX, aimY, keyboardThrow, handleScore, resetRound, throwRandomDart, userName, bankError, playerName, setPlayerName } = useDartsGame();

  return (
    <main className="darts-main">
      <BackToLoopland />
      <GameSessionBar userName={userName} bankError={bankError} playerName={playerName} setPlayerName={setPlayerName} />
      <InfoBar score={score} throwsLeft={throwsLeft} wind={wind} />
      <DartBoard onScore={handleScore} throwsLeft={throwsLeft} wind={wind} clearBoard={clearBoard} aimX={aimX} aimY={aimY} keyboardThrow={keyboardThrow} />
      <ThrowButton onThrow={throwRandomDart} />
      <HowToPlay title="How To Play" steps={HOW_TO_STEPS} />
      <History title="Throw History" items={history} />
      {throwsLeft <= 0 && <GameButton text="Play Again" onClick={resetRound} />}
    </main>
  );
}
